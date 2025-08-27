

const stripe = require('stripe')(process.env.sk_test);



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

  function paypalClient() {
    const env =
      process.env.PAYPAL_ENV === "live"
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );
    return new paypal.core.PayPalHttpClient(env);
  }


  // ---------------- Helpers (example cart -> order) ----------------
// In a real app, compute totals server-side from product IDs to prevent tampering.
function buildPurchaseUnits({ items }) {
  // items: [{ name, unit_amount, quantity, currency_code }]
  // All amounts as strings with 2 decimals.
  const currency = items[0]?.currency_code || "USD";
  const total = items
    .reduce(
      (sum, it) => sum + Number(it.unit_amount) * Number(it.quantity),
      0
    )
    .toFixed(2);

  return [
    {
      amount: {
        currency_code: currency,
        value: total,
        breakdown: {
          item_total: { currency_code: currency, value: total }
        }
      },
      items: items.map((it) => ({
        name: it.name,
        quantity: String(it.quantity),
        unit_amount: {
          currency_code: currency,
          value: Number(it.unit_amount).toFixed(2)
        }
      }))
    }
  ];
}

// Create Order (server-side)
// app.post("/api/paypal/create-order", async (req, res) => {

  exports.createOrder = async (req, res) => {
  try {
    // Expect { items: [{name, unit_amount, quantity, currency_code}], invoiceId? }
    const { items = [], invoiceId } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "No items provided" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: buildPurchaseUnits({ items }),
      application_context: {
        brand_name: "Your Store",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW"
      },
      ...(invoiceId ? { invoice_id: invoiceId } : {})
    });

    const client = paypalClient();
    const order = await client.execute(request);
    return res.status(201).json({ id: order.result.id });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Failed to create PayPal order" });
  }
};


// app.post("/api/paypal/capture-order", async (req, res) => {

  exports.captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: "Missing orderID" });

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({}); // empty body for capture
    const client = paypalClient();
    const capture = await client.execute(request);

    // TODO: persist capture.result in your DB for fulfillment/audit
    return res.status(200).json(capture.result);
  } catch (err) {
    console.error("Capture order error:", err);
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
};