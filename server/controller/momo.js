require("dotenv").config();
const currency = require("node-currency");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const crypto = require("crypto");
const https = require("https");
const MoMo = async (request, response) => {
  let { amountTotal, allProduct, user, address, phone } = request.body;
  //console.log(amountTotal);
  console.log("sản phẩm", allProduct);
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId();
  const exchangeRate = await currency.getCurrency("usd-vnd");
  console.log("tỷ giá:", Number(exchangeRate.lastValue));
  let amountVND = Number(amountTotal) * Number(exchangeRate.lastValue) + "";
  console.log("tiền sau khi đổi" + amountVND);
  let productMoMo = [];

  for (let i = 0; i < allProduct.length; i++) {
    let productMoMoClient = await productModel.findById(allProduct[i].id);

    productMoMo.push(
      productMoMoClient.pName +
        ` [${allProduct[i].price}$ x ${allProduct[i].quantitiy}]`
    );
  }
  console.log("productssss", productMoMo);

  // console.log(amountVND);
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = process.env.PARTNER_CODE;
  var accessKey = process.env.ACCESS_KEY;
  var secretkey = process.env.SECRET_KEY;
  var requestId = partnerCode + id;
  var orderId = id;
  var orderInfo = productMoMo.join(", ");
  var redirectUrl = "http://localhost:8000/api/momo/momocalback";
  var ipnUrl = "https://callback.url/notify";
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  var amount = amountVND;
  //var amount = "1000";
  var requestType = "captureWallet";
  var extraData = ""; //pass empty value if your merchant does not have stores

  let newOrder = new orderModel({
    _id: id,
    allProduct,
    user,
    amount: amountTotal,
    transactionId: orderId,
    address,
    phone,
  });
  let save = await newOrder.save();
  console.log(save);
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature

  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  //Create the HTTPS objects
  const https = require("https");
  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  //Send the request and get the response
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");
    res.on("data", (body) => {
      console.log("Body: ");
      console.log(body);
      console.log("payUrl: ");
      console.log(JSON.parse(body).payUrl);
      response.json(body);
      //response.redirect("https://www.google.com/?hl=vi");
    });
    res.on("end", (body) => {
      console.log("No more data in response.");
    });
  });

  req.on("error", (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log("Sending....");
  req.write(requestBody);
  req.end();
};

module.exports = MoMo;
