import { sql } from "../config/db.js";


const generateMeetingId = ()=> {
    const chars = 'abcdefghijklmonpqrstuvwyz';
    const segment = (len)=> Array.from({length: len}, ()=> chars[Math.floor(Math.random() * chars.length)]).join("")
    return `${segment(3)}-${segment(3)}-${segment(3)}`
}

//*Create meeting
export const  createMeeting = async (req, res)=> {
    try {
        // Read the meeting title and authenticated host from the request.
        const {title} = req.body;
        const userId = req.user.id;

        // Fetch the host's details so the plan and display name are available.
        const users = await sql`SELECT name, plan FROM users WHERE id = ${userId}`;
        const userPlan = users[0]?.plan || "free";

        // Enforce the free-plan limit for meetings created this calendar month.
        if(userPlan === "free"){
            const monthlyCountResult = await sql`
            SELECT COUNT(*) as count
            FROM meeting
            WHERE host_id = ${userId}
            AND created_at >= date_trunc('month', N0W())`;

            const monthlyCount = parseInt(monthlyCountResult[0]?.count || '0');

            if(monthlyCount >= 30){
                return res.status(403).json({
                    error: "Monthly limit reached. Free plan includes 30 meetings per month. Please upgrade to Premium for unlimited meetings",
                    limitReached:true,
                    monthlyCount,
                    limit: 30,
                })
            }
        }

        // Generate a short meeting ID and retry if it already exists.
        let meetingId = generateMeetingId()
        let existing = await sql`SELECT id FROM meeting WHERE meeting_id = ${meetingId}`
        while(existing.length > 0){
            meetingId = generateMeetingId();
            existing = await sql`SELECT id FROM meetings meeting_id = ${meetingId}`
        }

        // Persist the meeting and return the newly created record.
        const [meeting] = await sql`
        INSERT INTO meeting(meeting_id, title, host_id, status)
        VALUES (${meetingId}, ${title || "Instant Meeting"}, ${userId}, active)
        RETURNING id, meeting_id, title, host_id, status, created_at`

        const hostName = users[0]?.name || "Host";

        // Add the host as the first participant in the meeting.
        await sql`INSERT INTO meeting_participants (meeting_id, user_id, name)
        VALUES (${meeting.id}, ${userId}, ${hostName})`

    // Send the public meeting details back to the client.
        res.status(201).json({
            meeting: {
                id: meeting.id,
                meetingId: meeting.meeting_id,
                title: meeting.title,
                host: meeting.host_id,
                status: meeting.status,
                createdAt: meeting.created_at,
            }
        })
    } catch (error) {
        console.error("create Meeting failed:", error);
        
        res.status(500).json({error: error.message})
        
    }
    
}
//*get meeting bt id
export const getMeeting = async (req, res)=> {
try {
    // Read the meeting ID supplied in the route.
    const {meetingId} = req.params

    // Fetch the meeting together with the host details needed by the client.
    const meetings = await sql`SELECT m.*, u.id as host_user_id, u.name as host_name, u.meeting_id = ${meetingId}`

    // Return a not-found response when the meeting does not exist.
    if(meetings.length === 0){
        return res.status(404).json({ error : "Meeting not found"})
    }

    const meeting = meetings[0];

    // Prevent users from joining a meeting that has already ended.
    if(meeting.status === "ended"){
        return res.status(400).json({ error: "This meeting is ended"})
    }

    // Return the meeting data in the shape expected by the client.
    res.json({
         meeting: {
                id: meeting.id,
                meetingId: meeting.meeting_id,
                title: meeting.title,
                status: meeting.status,
                createdAt: meeting.created_at,
                   host:{
                    id: meeting.host_user_id,
                    name: meeting.host_name,
                    email: meeting.host_email,
                   }
            }

    })
} catch (error) {
            console.error(" Fetch Meeting failed:", error);
    // Convert unexpected database or server errors into a server response.
    res.status(500).json({error: error.message})
}
}



//*get all user's meetings sessions
export const getUserSessions = async (req, res)=> {
try {
    // Get the authenticated user's ID from the request context.
    const userId = req.user.id

    // Fetch every meeting where the current user is either the host or a participant.
    // This ensures the dashboard/session list includes both hosted and joined meetings.
    const meetings = await sql`
    SELECT DISTINCT m.id, m.meeting_id, m.status, m.created_at, m.ended_at, m.host_id, u.name as host_name, u.email as host_email
    FROM meetings m
    JOIN users u ON m.hosted_id = u.id
    LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
    WHERE m.host_id = ${userId} OR  mp.user_id = ${userId}
    ORDER BY m.created_at DESC`;

    // Format each meeting with its participants and chat messages for the front-end.
    const formattedMeetings = await Promise.all(
        meetings.map(async(m)=> {
     // Load all participants for the current meeting and attach their user email if available.
     const participants = await sql`
        SELECT mp.*, u.email
        FROM meeting_participants mp
        LEFT JOIN users u ON mp.user_Id = u.id
        WHERE mp.meeting_id = ${m.id}`;

        // Load the meeting chat history in chronological order.
        const messages = await sql`
        SELECT id, sender_id, sender_name, text, timestamp
        FROM meeting_messages
        WHERE meeting_id = ${m.id}
        ORDER BY timestamp ASC`;

        // Return a cleaned meeting object that matches the client-facing session shape.
        return {
            id: m.id,
            meetingId: m.meeting_id,
            title: m.title,
            status: m.status,
            createdAt: m.created_at,
            endedAt: m.ended_at,
              host:{
                    id: m.host_id,
                    name: m.host_name,
                    email: m.host_email,
                   },
                   participants: participants.map((p)=> ({
                    user: p.user_id ? {id: p.user_id, email: p.email} : null,
                    name: p.name,
                    joinedAt: p.joined_at,
                    leftAt: p.left_at,
                   })),
                   messages: messages.map((msg)=> ({
                    id: msg.id,
                    sender: msg.sender_id,
                    senderName: msg.sender_name,
                    text:msg.text,
                    timestamp: msg.timestamp
                   }))
        }
        })
    )

    // Send the formatted session list back to the client.
   res.json({meetings: formattedMeetings})
} catch (error) {
            console.error("get User Session failed failed:", error);
    // If anything goes wrong, surface the server error to the caller.
    res.status(500).json({error: error.message})
}
}


//*get meetings sessions details by id
export const getSessionDetails = async (req, res)=> {
    try {
        // Read the session identifier from the route parameters.
        const {id} = req.params;
        const userId = req.user.id;

        // Look up the meeting and host information using the public meeting ID.
        const meetings = await sql`
        SELECT m.*, u.id AS host_user_id, u.name AS host_name, u.email AS host_email FROM meetings m JOIN users u ON m.host_id = u.id WHERE m.meeting_id = ${id}`;

        // Return a not-found response when the requested session does not exist.
        if (meetings.length === 0){
            return res.status(404).json({error:"Session details not found"})
        }

        // Grab the matching meeting record for additional detail lookups.
        const m = meetings[0];

        // will check if the user is host / not, if they are participants then it returns session details
        if(m.host_id !== userId) {
            const membership = await sql`
            SELECT 1 FROM meeting_participants
            WHERE meeting_id = ${m.id} AND user_id = ${userId} LIMIT 1 `;
            if(membership.length === 0){
                return res.status(404).json({error: "Session details not found"})
            }
        }

        // Fetch all participants for this session so their names and user metadata can be returned.
        const participants = await sql`
        SELECT mp.*, u.email 
        FROM meeting_participants mp
        LEFT JOIN users u ON mp.user_id = u.id
        WHERE mp.meeting_id = ${m.id}`


        // Fetch the session chat messages in chronological order for the detail view.
        const messages = await sql`
        SELECT id, sender_id, sender_name, text, timestamp
        FROM meeting_messages
        WHERE meeting_id = ${m.id}
        ORDER BY timestamp ASC`;


        // Shape the raw DB data into the format expected by the front end.
        const formattedMeeting = {
            id: m.id,
            meetingId:m.meeting_id,
            title:m.title,
            status: m.status,
            createdAt: m.created_at,
            endedAt: m.ended_at,
            host: {
                id: m.host_user_id,
                name: m.host_name,
                email: m.host_email
            },

                participants: participants.map((p)=> ({
                    user: p.user_id ? {id: p.user_id, email: p.email} : null,
                    name: p.name,
                    joinedAt: p.joined_at,
                    leftAt: p.left_at,
                   })),

                   messages: messages.map((msg)=> ({
                    id: msg.id,
                    sender: msg.sender_id,
                    senderName: msg.sender_name,
                    text:msg.text,
                    timestamp: msg.timestamp
                   }))
        }

        // Return the fully formatted session details to the client.
        res.json({meetings: formattedMeeting})
    } catch (error) {
        // Surface unexpected database or server errors to the requester.
                console.error("get session details failed:", error);
        res.status(500).json({error: error.message})
    }

}
//*get plan & meetings statistics for user dashboard
export const getMeetingStats =  async(req, res)=> {
    try {
        // Get the current authenticated user's ID.
        const userId = req.user.id;

        // Fetch the user's plan so the dashboard can apply the correct limits.
        const users = await sql`SELECT plan FROM users WHERE id = ${userId}
        const plan = user[0]?.plan || "free`;

        // Count how many meetings the user has created this month.
        const monthlyCountResult = sql`
        SELECT COUNT(*) as count
        FROM meetings
        WHERE host_id = ${userId} AND created_at >= data_trunc('month', NOW())`

        // Convert the count to a number for the front-end summary.
        const monthlyCount = parseInt(monthlyCountResult[0]?.count || '0', 10);

        // Free users are limited to 30 meetings per month; premium users have no monthly cap.
        const monthlyLimit =plan ==="premium" ? null :30;

        // Return a compact stats payload for the dashboard.
        res.json({plan, monthlyCount, monthlyLimit, maxParticipants: plan === "premium" ? 100 :10,})
    } catch (error) {
                console.error("get meeting stats failed:", error);
         // Surface unexpected database or server errors to the client.
         res.status(500).json({error: error.message})
    }

}