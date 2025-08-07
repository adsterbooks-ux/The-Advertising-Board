const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { square } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: `Ad Square #${square}`
        },
        unit_amount: 100,
      },
      quantity: 1,
    }],
    success_url: `${process.env.URL}/success.html`,
    cancel_url: `${process.env.URL}/cancel.html`,
    metadata: {
      square
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ id: session.id })
  };
};