const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  try {
    const { square } = JSON.parse(event.body);

    console.log("Creating Stripe session for square:", square);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Ad Square #${square}`
          },
          unit_amount: 100, // £1 in pence
        },
        quantity: 1,
      }],
      success_url: `${process.env.URL}/success.html`, // Use dynamic URL
      cancel_url: `${process.env.URL}/cancel.html`, // Use dynamic URL
      metadata: {
        square
      }
    });

    console.log("✅ Stripe session created:", session.id);
    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};