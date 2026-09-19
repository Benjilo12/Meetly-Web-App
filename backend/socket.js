import { Socket } from "socket.io";
import { sql } from "./config/db.js";

// In-memory map used to track active meeting rooms and the participants inside them.
const rooms = new Map();

// Initialize the Socket.IO event handlers for meeting-related real-time behavior.
export function setupSocketIO(io){
    io.on("connection", ()=> {
        // Track the current room and user for this connected socket instance.
        let currentRoomId = null;
        let currentUser = null;

        // Handle when a client joins a meeting room.
        Socket.on("join-room", async({roomId, user, audioEnabled = true, videoEnabled}) => {
            try {
                // Verify that the meeting actually exists before allowing a user to join.
                const meetings = await sql`SELECT * FROM meetings WHERE meeting_id =${roomId}`

                if (meetings.length === 0){
                    Socket.emit("meeting-ended", {message: "Meeting not found"})
                    return
                }
                const meeting = meeting[0];

                // Prevent participants from joining a room that has already been ended.
                if(meeting.status === "ended"){
                    Socket.emit("meeting-ended", {message: "This meeting has already ended"})
                    return;
                }
                currentRoomId = roomId;
                const isHost = meeting.host_id && user?.id && meeting.host_id.toString()

                // Store the connected user's room state for this socket.
                currentUser = {
                    Socketid: Socket.id,
                    userId: user?.id,
                    userName: user?.name || "Anonymous",
                    isHost,
                    audioEnabled,
                    videoEnabled,

                }

                // Create the room if it does not already exist.
                if(!rooms.has(roomId)){
                    rooms.set(roomId, new Map())
                }

                const roomParticipants = rooms.get(roomId)


                // Check the host's plan to enforce the participant capacity limit.
                const hosts = await sql`SELECT plan FROM users WHERE id = ${meeting.host_id}`;

                const hostPlan = hosts[0]?.plan || "free";
                const maxParticipants = hostPlan === "premium" ? 100 : 10;

                // Stop joining if the room has reached its allowed participant count.
                if(roomParticipants.size >= maxParticipants){
                  Socket.emit("meeting-ended", {
                    message: `Meeting capacity limit reached(max ${maxParticipants} participants for ${hostPlan.toUpperCase()} plan). Host must upgrade to Premium for up to 100 participants!`,
                  })  
                  return;
                }
                Socket.join(roomId)


                // Gather currently connected participants already in the room.
                const existingUsers = Array.from(roomParticipants.values());

                // Add the new participant to the in-memory room state.
                roomParticipants.set(Socket.id, currentUser);



                // Save the participant to the database if they are not already recorded.
                const userId = user?.id || null;
                const existingParticipants = await sql`
                SELECT id FROM meeting_participants
                WHERE meeting_id = ${meeting.id}
                AND ((${userId}::text IS NOT NULL user_id = ${userId}) OR name = ${currentUser.userName})`

                if(existingParticipants.length === 0){
                    sql`
                    INSERT INTO meeting_participants (meeting_id, user_id, name, joined_at)
                    VALUES (${meeting.id}, ${userId}, ${currentUser.userName}, NOW( ))`
                }

                //Send list existing users to the newcomer
                Socket.emit("all-users", existingUsers)

                //Notify everyone else in the room
                Socket.to(roomId).emit("user-joined", currentUser)
            } catch (error) {
                // Log the error for debugging if a socket join fails.
            }
        })

        //WebRTC signaling: Offer
        // Send the information needed to start the connection

        Socket.on('offer', ({targetSocketId, callerSocketId, sdp})=> {
            io.to(targetSocketId).emit("offer", {
                callerSocketId,
                sdp,
                callerUser: currentUser
            })
        })

        // WebRTC Signaling: Answer
        // accept_ the offer request and process the connection
          Socket.on('answer', ({targetSocketId, responderSocketId, sdp})=> {
            io.to(targetSocketId).emit("answer", {
                callerSocketId,
                sdp,
            })
        })

        // WebRTC signaling: ICE Candidate
        // passes the connection details from user to the other so WebRTC can figure out how to connect them directly.


        Socket.on('ice-candidate', ({ targetSocketId, senderSocketId, candidate}) => {
            io.to(targetSocketId).emit("ice-candidate", {
                senderSocketId,
                candidate,
            })
        })

        // Audio toggle event
        Socket.on('toggle-audio', ({roomId, audioEnabled }) => {
           if(rooms.has(roomId) && rooms.get(roomId).has(Socket.id)){
            rooms.get(roomId).get(Socket.id).audioEnabled = audioEnabled
           }
           Socket.to(roomId).emit('user-toggled-audio', {
            Socketid: Socket.id,
            audioEnabled,
           })
        })

        // Video toggle event
        Socket.on('toggle-Video', ({roomId, videoEnabled }) => {
           if(rooms.has(roomId) && rooms.get(roomId).has(Socket.id)){
            rooms.get(roomId).get(Socket.id).videoEnabled = videoEnabled
           }
           Socket.to(roomId).emit('user-toggled-video', {
            Socketid: Socket.id,
           videoEnabled,
           })
        })

       // chat message event -> persist to DB &  broadcast
       Socket.on("send-message", async ({roomId, message})=> {
        try {
            const meetings = await sql`SELECT id, status FROM meetings WHERE meeting_id = ${roomId}`;

            if(meetings.length > 0 && meetings[0].status !== "ended"){
                const meetingId = meetings[0].id;
                const senderId = message.senderId || null;

                await sql`
                INSERT INTO meeting_messages (meeting_id, sender_id, sender_name, text, timestamp)
                VALUES (${meetingId}, ${senderId}, ${message.senderName || "Anonymous"}, ${message.text}, NOW())
                `

                io.in(roomId).emit("receive-message", {
                    ...message,
                    senderSocketId: Socket.id,
                })
            }
        } catch (error) {
            console.error("Error saving chat message to DB:", err);
            
        }
       })

       // Host ends meeting for all Via End Meeting Button
        // Video toggle event
        Socket.on('end-meeting', async ({roomId }) => {
           try {
            await sql`
            SET status = 'ended, ended_at = NOW()
            UPDATE meetings_id = ${roomId}
            `;

            io.on(roomId).emit("meeting-ended", { message: "The meeting has been ended by the host."});
            rooms.delete(roomId);
    
           } catch (error) {
            console.error("Error ending meeting", err);
            
           }
        })

       // Handle Disconnect (Reloading window, network drop, or closing tab)
        Socket.on('disconnect', async ({roomId }) => {
         if (currentRoomId && rooms.has(currentRoomId)){
            const roomParticipants = rooms.get(currentRoomId);
            roomParticipants.delete(Socket.id);

            if (roomParticipants.size === 0){
                rooms.delete(currentRoomId)
            }else{
                //Notify remaining peers that a user disconnected
                Socket.to(currentRoomId).emit("user-left", {
                    Socketid: Socket.id,
                    user: currentUser,
                })
            }
         }
        })

    })
}