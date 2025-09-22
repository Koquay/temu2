

const stripe = require('stripe')(process.env.sk_test);
const axios = require('axios');


exports.createPaymentIntent = async (req, res) => {
    console.log('order.service.createPaymentIntent called...');
  
    let { amount, currency } = req.body;
    amount *= 100;
  
    console.log('amount', amount);
    console.log('currency', currency);
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
  
      res.status(200).json(paymentIntent);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).send({ error: 'Error creating payment intent' });
    }
  } 








const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // or live

// Generate access token
async function generateAccessToken() {
  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
    }
  );
  return response.data.access_token;
}

// Create order
exports.createPaypalOrder = async (req, res) => {
  console.log('payment.createPaypalOrder called...');

  const accessToken = await generateAccessToken();

  console.log('payment.createPaypalOrder.accessToken', accessToken);

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: 'description goes here', // optional
          // quantity: 1,
          amount: { currency_code: "USD", value: "100.00" },
        },
      ],
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  console.log('payment.createPaypalOrder.response.data', response.data);
  res.json(response.data);
};

// Capture order

  exports.capturePaypalOrder = async (req, res) => {
    console.log('payment.capturePaypalOrder called...');
    const { orderID } = req.params;
    const accessToken = await generateAccessToken();   

    try {
      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {},
        { headers: { 
          Authorization: `Bearer ${accessToken}`,
        } }
      )
    } catch(error) {
      console.error(error);
    }

    

    console.log('orderID', orderID);
    console.log("CLIENT_ID used:", PAYPAL_CLIENT_ID);
    console.log("API endpoint:", PAYPAL_API);
    console.log("OrderID being captured:", orderID);

    res.json(response.data);
};

