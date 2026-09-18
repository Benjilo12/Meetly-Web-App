import { verifyWebhook } from "@clerk/express/webhooks";
import { sql } from "../config/db.js";

export const handleClerkWebhook = async (req, res) => {
  try {
    // Verify the webhook payload from Clerk.
    const evt = await verifyWebhook(req);
    const eventType = evt.type;
    const data = evt.data;

    // Handle supported user lifecycle events.
    switch (eventType) {
      case "user.created": {
        // Create or refresh the local user record.
        const userId = data.id;
        const primaryEmail = data.email_addresses?.[0]?.email_address || "";
        const name = `${data.first_name || "User"} ${data.last_name || ""}`.trim() || "User";
        const image = data.image_url || "";
        const plan = "free";

        await sql`
          INSERT INTO users (id, name, email, image, plan)
          VALUES (${userId}, ${name}, ${primaryEmail}, ${image}, ${plan})
          ON CONFLICT (id) DO UPDATE SET
            id = EXCLUDED.id,
            name = EXCLUDED.name,
            image = EXCLUDED.image,
            plan = EXCLUDED.plan,
            updated_at = NOW()
        `;
        break;
      }

      case "user.updated": {
        const userId = data.id;
        const primaryEmail = data.email_addresses?.[0]?.email_address || "";
        const name = `${data.first_name || "User"} ${data.last_name || ""}`.trim() || "User";
        const image = data.image_url || "";
       

        await sql`
          INSERT INTO users (id, name, email, image)
          VALUES (${userId}, ${name}, ${primaryEmail}, ${image})
          ON CONFLICT (id) DO UPDATE SET
            id = EXCLUDED.id,
            name = EXCLUDED.name,
            image = EXCLUDED.image,
            updated_at = NOW()
        `;
        break;
      }

      case "user.deleted": {
        // Remove the user if Clerk reports a deletion.
        const userId = data.id;
        if (userId) {
          await sql`DELETE FROM users WHERE id = ${userId}`;
        }

      }
      default:
        console.log(`Unhanded Clerk webhook event type: ${eventType}`);
        
    }

    return res.status(200).json({ success: true, eventType });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return res.status(400).json({ error: "Webhook verification failed"  + (error.message || error)});
  }
};