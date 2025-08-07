const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    const squareNumber = session.metadata?.square || null;
    const email = session.customer_details?.email || null;
    const linkUrl = session.metadata?.link_url || null;
    const imageUrl = session.metadata?.image_url || null;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("purchases").insert([
      {
        square_number: parseInt(squareNumber),
        email,
        link_url: linkUrl,
        image_url: imageUrl,
        paid_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Database error" }),
      };
    }

    console.log(`Purchase recorded: Square #${squareNumber}, Email: ${email}`);
  }

  return { statusCode: 200, body: "Webhook received" };
};