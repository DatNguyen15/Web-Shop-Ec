const EmailService = require("../config/EmailService");
const orderModel = require("../models/orders");
const userModel = require("../models/users");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    console.log("Product", allProduct);
    console.log("user", user);
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newOrder.save();
        console.log(save);

        //var mailBody = "";
        //mailBody += `<h1>Hello ${infoOrder.user.name}</h1`;
        if (save) {
          let infoOrder = await orderModel
            .findById(save._id)
            .populate("allProduct.id", "pName pImages pPrice")
            .populate("user", "name email");
          console.log("Infor:", infoOrder.allProduct[0].id.pName);
          console.log("infor", infoOrder.user.name);

          var lengthPro = infoOrder.allProduct.length;
          var contentProduct = "";
          for (let i = 0; i < lengthPro; i++) {
            var totalPrice =
              infoOrder.allProduct[i].id.pPrice *
              infoOrder.allProduct[i].quantitiy;
            contentProduct += `<tr>
          <td align="center" valign="middle" rowspan="1">${i + 1}</td>
          <td>

            <p><strong >
            ${infoOrder.allProduct[i].id.pName}
            </strong></p>
          </td>
          <td align="center">${infoOrder.allProduct[i].quantitiy}</td>
          <td align="center">${infoOrder.allProduct[i].id.pPrice}$</td>
          <td align="center">${totalPrice}$</td>
          </tr>`;
          }

          var bodyMail = "";

          bodyMail +=
            '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;border:1px solid #cccccc">';
          bodyMail += "<tbody><tr>";
          bodyMail +=
            '<td align="center" bgcolor="#f4f4f4" style="height:150px;border:1px solid #cccccc">';
          bodyMail +=
            '<img src="https://thanhdatat.surge.sh/src/img/tempsnip2.png" alt="hdshop.com" width="100%" height="140%" style="display:block" class="CToWUd">';
          bodyMail += "</td>";
          bodyMail += "</tr>";

          bodyMail += "<tr>";
          bodyMail +=
            '<td bgcolor="#ffffff" style="padding:40px 30px 40px 30px">';

          bodyMail +=
            '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif">';
          bodyMail += "<tbody><tr>";
          bodyMail += '<td style="color:#00483d;font-family:Arial,sans-serif">';
          bodyMail +=
            '<h1  align="center" style="font-size:24px;margin:10px 0">ORDER INFORMATION NO <strong style="color:red">' +
            infoOrder.transactionId.toUpperCase() +
            "</strong></h1>";
          bodyMail += "</td>";
          bodyMail += "</tr>";
          bodyMail += "<tr>";
          bodyMail += '<td style="color:#00483d;font-family:Arial,sans-serif">';
          bodyMail +=
            '<h2 style="font-size:20px;margin:10px 0">1. Customer Information</h2>';
          bodyMail += "</td>";
          bodyMail += "</tr>";
          bodyMail += "<tr>";
          bodyMail += "<td>";
          bodyMail +=
            '<table border="0" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
          bodyMail += '<tbody><tr style="border-bottom:1px dotted #ccc">';
          bodyMail += '<td style="width:110px">Name:</td>';
          bodyMail += "<td>" + infoOrder.user.name + "</td>";
          bodyMail += "</tr>";
          bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
          bodyMail += "<td>Phone:</td>";
          bodyMail += "<td>" + infoOrder.phone + "</td>";
          bodyMail += "</tr>";
          bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
          bodyMail += "<td>Email:</td>";
          bodyMail +=
            '<td><a href="mailto:' +
            infoOrder.user.email +
            '" target="_blank">' +
            infoOrder.user.email +
            "</a></td>";
          bodyMail += "</tr>";
          bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
          bodyMail += "<td>Address:</td>";
          bodyMail += "<td>" + infoOrder.address + "</td>";
          bodyMail += "</tr>";

          bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
          bodyMail += "<td>Note:</td>";
          bodyMail += "<td></td>";
          bodyMail += "</tr>";
          bodyMail += "</tbody></table>";
          bodyMail += "</td>";
          bodyMail += "</tr>";

          bodyMail += "<tr>";
          bodyMail += '<td style="color:#153643;font-family:Arial,sans-serif">';
          bodyMail +=
            '<h2 style="font-size:20px;margin:10px 0">2. Ordered Products</h2>';
          bodyMail += "</td>";
          bodyMail += "</tr>";

          bodyMail += "<tr>";
          bodyMail += "<td>";
          bodyMail +=
            '<table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
          bodyMail += "<tbody><tr>";
          bodyMail += "<th>#</th>";
          bodyMail += "<th>Product Name</th>";
          bodyMail += "<th>Quantity</th>";
          bodyMail += "<th>Price</th>";
          bodyMail += "<th>Total (QxP)</th>";
          bodyMail += "</tr>";
          bodyMail += contentProduct;
          bodyMail += "<tr>";
          bodyMail += '<td colspan="4" align="right">Total:</td>';
          bodyMail += "<td align='center'>" + infoOrder.amount + "$</td>";
          bodyMail += "</tr>";
          bodyMail += "<tr>";
          bodyMail += '<td colspan="4" align="right">Discount:</td>';
          bodyMail += "<td align='center'>-00 $</td>";
          bodyMail += "</tr>";
          bodyMail += "<tr>";
          bodyMail += '<td  colspan="4" align="right">Total Payment:</td>';
          bodyMail +=
            "<td align='center'><strong style='color:red'>" +
            infoOrder.amount +
            "$</strong></td>";
          bodyMail += "</tr>";
          bodyMail += "</tbody></table>";
          bodyMail += "</td>";
          bodyMail += "</tr>";

          bodyMail += "<tr>";
          bodyMail +=
            '<td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px">';
          bodyMail +=
            "<p>Thank you for your order. Orders are being received and are pending.</p>";
          bodyMail += "</td>";
          bodyMail += "</tr>";
          bodyMail += "</tbody></table>";

          const mailer = new EmailService();
          mailer.sendMail(
            process.env.EMAIL,
            infoOrder.user.email,
            `[HDSHOP] Order Information No: ${infoOrder.transactionId.toUpperCase()}`,
            bodyMail
          );
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  async updateOrderMoMo(req, res) {
    let orderId = req.query.orderId;
    let resultCode = req.query.resultCode;
    console.log(resultCode);

    if (resultCode == "0") {
      let infoOrder = await orderModel
        .findById(orderId)
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email");
      console.log("Infor:", infoOrder.allProduct[0].id.pName);
      console.log("infor", infoOrder.user.name);

      var lengthPro = infoOrder.allProduct.length;
      var contentProduct = "";
      for (let i = 0; i < lengthPro; i++) {
        var totalPrice =
          infoOrder.allProduct[i].id.pPrice * infoOrder.allProduct[i].quantitiy;
        contentProduct += `<tr>
      <td align="center" valign="middle" rowspan="1">${i + 1}</td>
      <td>

        <p><strong >
        ${infoOrder.allProduct[i].id.pName}
        </strong></p>
      </td>
      <td align="center">${infoOrder.allProduct[i].quantitiy}</td>
      <td align="center">${infoOrder.allProduct[i].id.pPrice}$</td>
      <td align="center">${totalPrice}$</td>
      </tr>`;
      }

      var bodyMail = "";

      bodyMail +=
        '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse:collapse;border:1px solid #cccccc">';
      bodyMail += "<tbody><tr>";
      bodyMail +=
        '<td align="center" bgcolor="#f4f4f4" style="height:150px;border:1px solid #cccccc">';
      bodyMail +=
        '<img src="https://thanhdatat.surge.sh/src/img/tempsnip2.png" alt="hdshop.com" width="100%" height="140%" style="display:block" class="CToWUd">';
      bodyMail += "</td>";
      bodyMail += "</tr>";

      bodyMail += "<tr>";
      bodyMail += '<td bgcolor="#ffffff" style="padding:40px 30px 40px 30px">';

      bodyMail +=
        '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif">';
      bodyMail += "<tbody><tr>";
      bodyMail += '<td style="color:#00483d;font-family:Arial,sans-serif">';
      bodyMail +=
        '<h1  align="center" style="font-size:24px;margin:10px 0">ORDER INFORMATION NO <strong style="color:red">' +
        infoOrder.transactionId.toUpperCase() +
        "</strong></h1>";
      bodyMail += "</td>";
      bodyMail += "</tr>";
      bodyMail += "<tr>";
      bodyMail += '<td style="color:#00483d;font-family:Arial,sans-serif">';
      bodyMail +=
        '<h2 style="font-size:20px;margin:10px 0">1. Customer Information</h2>';
      bodyMail += "</td>";
      bodyMail += "</tr>";
      bodyMail += "<tr>";
      bodyMail += "<td>";
      bodyMail +=
        '<table border="0" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
      bodyMail += '<tbody><tr style="border-bottom:1px dotted #ccc">';
      bodyMail += '<td style="width:110px">Name:</td>';
      bodyMail += "<td>" + infoOrder.user.name + "</td>";
      bodyMail += "</tr>";
      bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
      bodyMail += "<td>Phone:</td>";
      bodyMail += "<td>" + infoOrder.phone + "</td>";
      bodyMail += "</tr>";
      bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
      bodyMail += "<td>Email:</td>";
      bodyMail +=
        '<td><a href="mailto:' +
        infoOrder.user.email +
        '" target="_blank">' +
        infoOrder.user.email +
        "</a></td>";
      bodyMail += "</tr>";
      bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
      bodyMail += "<td>Address:</td>";
      bodyMail += "<td>" + infoOrder.address + "</td>";
      bodyMail += "</tr>";

      bodyMail += '<tr style="border-bottom:1px dotted #ccc">';
      bodyMail += "<td>Note:</td>";
      bodyMail += "<td></td>";
      bodyMail += "</tr>";
      bodyMail += "</tbody></table>";
      bodyMail += "</td>";
      bodyMail += "</tr>";

      bodyMail += "<tr>";
      bodyMail += '<td style="color:#153643;font-family:Arial,sans-serif">';
      bodyMail +=
        '<h2 style="font-size:20px;margin:10px 0">2. Ordered Products</h2>';
      bodyMail += "</td>";
      bodyMail += "</tr>";

      bodyMail += "<tr>";
      bodyMail += "<td>";
      bodyMail +=
        '<table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
      bodyMail += "<tbody><tr>";
      bodyMail += "<th>#</th>";
      bodyMail += "<th>Product Name</th>";
      bodyMail += "<th>Quantity</th>";
      bodyMail += "<th>Price</th>";
      bodyMail += "<th>Total (QxP)</th>";
      bodyMail += "</tr>";
      bodyMail += contentProduct;
      bodyMail += "<tr>";
      bodyMail += '<td colspan="4" align="right">Total:</td>';
      bodyMail += "<td align='center'>" + infoOrder.amount + "$</td>";
      bodyMail += "</tr>";
      bodyMail += "<tr>";
      bodyMail += '<td colspan="4" align="right">Discount:</td>';
      bodyMail += "<td align='center'>-00 $</td>";
      bodyMail += "</tr>";
      bodyMail += "<tr>";
      bodyMail += '<td  colspan="4" align="right">Total Payment:</td>';
      bodyMail +=
        "<td align='center'><strong style='color:red'>" +
        infoOrder.amount +
        "$</strong></td>";
      bodyMail += "</tr>";
      bodyMail += "</tbody></table>";
      bodyMail += "</td>";
      bodyMail += "</tr>";

      bodyMail += "<tr>";
      bodyMail +=
        '<td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px">';
      bodyMail +=
        "<p>Thank you for your order. Orders are being received and are pending.</p>";
      bodyMail += "</td>";
      bodyMail += "</tr>";
      bodyMail += "</tbody></table>";

      const mailer = new EmailService();
      mailer.sendMail(
        process.env.EMAIL,
        infoOrder.user.email,
        `[HDSHOP] Order Information No: ${infoOrder.transactionId.toUpperCase()}`,
        bodyMail
      );
      //return res.redirect("http://localhost:8000/api/momo/successfull");
      return res.redirect("http://localhost:3000/paymentsucess");
    } else {
      let deleteOrder = await orderModel.findByIdAndDelete(orderId);
      if (deleteOrder) {
        return res.redirect("http://localhost:3000/checkout");
      }
    }
  }
  async successMoMo(req, res) {
    return res.json({ message: "Order successfull" });
  }
}

const ordersController = new Order();
module.exports = ordersController;
