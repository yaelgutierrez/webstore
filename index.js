const express = require("express");
const bodyParser = require("body-parser");
const repository = require("./repository");
const mercadopago = require('mercadopago');
const app = express();
const port = 3000;

mercadopago.configure({
  access_token: "TEST-3823627780415641-091511-7bcd3565da3c2348332f7333c841c21c-267108347",
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/api/products", async (req, res) => {
  res.send(await repository.read());
});

app.post("/api/pay", async (req, res) => {
  const ids = req.body;
  const productsCopy = await repository.read();

  let preference = {
    items: [],
    back_urls: {
			success: "http://localhost:3000/feedback",
			failure: "http://localhost:3000/feedback",
			pending: "http://localhost:3000/feedback"
		},
		auto_return: "approved",
  };

  let error = false;
  ids.forEach((id) => {
    const product = productsCopy.find((p) => p.id === id);
    if (product.stock > 0) {
      product.stock--;
      preference.items.push({
        title: product.name,
        unit_price: product.price,
        quantity: 1,
      })
    } else {
      error = true;
    }
  });

  if (error) {
    res.send("Sin stock").statusCode(400);
  }
  else {
    const response = await mercadopago.preferences.create(preference)
    const preferenceId = response.body.id
    await repository.write(productsCopy);
    res.send({ preferenceId });
  }
});


app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});