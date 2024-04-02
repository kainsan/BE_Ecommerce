const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authMiddleWare,authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleWare, OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.get('/get-all-order',authMiddleWare, OrderController.getAllOrder)
router.delete('/cancel-order/:id',authUserMiddleWare, OrderController.cancelOrderDetails)

module.exports = router