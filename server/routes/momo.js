const express = require("express");
const router = express.Router();
const MoMo = require("../controller/momo");
const ordersController = require("../controller/orders");
//router.post("/braintree/get-token", brainTreeController.ganerateToken);
router.post("/momo/payment", MoMo);
router.get("/momocalback", ordersController.updateOrderMoMo);
router.get("/successfull", ordersController.successMoMo);
module.exports = router;
