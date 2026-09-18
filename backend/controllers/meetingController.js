import { sql } from "../config/db";


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
    // Convert unexpected database or server errors into a server response.
    res.status(500).json({error: error.message})
}
}



//*get all user's meetings sessions
export const getUserSessions = async (req, res)=> {
try {
    const userId = req.user.id
    /// fetch  meetings where user is host OR listed in participants
    const meetings = await sql`
    SELECT DISTINCT m.id, m.meeting_id, m.status, m.created_at, m.ended_at, m.host_id, u.name as host_name, u.email as host_email
    FROM meetings m
    JOIN users u ON m.hosted_id = u.id
    LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
    WHERE m.host_id = ${userId} OR  mp.user_id = ${userId}
    ORDER BY m.created_at DESC`;

    const formattedMeetings = await Promise.all(
        meetings.map(async(m)=> {
     const participants = await sql`
        SELECT mp.*, u.email
        FROM meeting_participants mp
        LEFT JOIN users u ON mp.user_Id = u.id
        WHERE mp.meeting_id = ${m.id}`;

        const messages = await sql`
        SELECT id, sender_id, sender_name, text, timestamp
        FROM meeting_messages
        WHERE meeting_id = ${m.id}
        ORDER BY timestamp ASC`;

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
                   }))
        }
        })
    )

} catch (error) {
    res.status(500).json({error: error.message})
}
}
//*get meetings sessions details by id
export const getSessionDetails = async (req, res)=> {

}
//*get plan & meetings statistics for user dashboard
export const getMeetingStats =  async(req, res)=> {

}