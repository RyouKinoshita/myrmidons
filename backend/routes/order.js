const express = require("express");
const router = express.Router();

const {
  newOrder,
  confirmOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
  totalOrders,
  totalSales,
  customerSales,
  salesPerMonth,
  serviceSales,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post("/order/new", isAuthenticatedUser, newOrder);
router.get("/order/:id/confirm", confirmOrder);
router.get("/order/:id", isAuthenticatedUser, getSingleOrder);
router.get("/orders/me", isAuthenticatedUser, myOrders);
router.get("/admin/orders/", isAuthenticatedUser, allOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, updateOrder)
  .delete(isAuthenticatedUser, deleteOrder);
router.get("/admin/total-orders", totalOrders);
router.get("/admin/total-sales", totalSales);
router.get("/admin/customer-sales", customerSales);
router.get("/admin/sales-per-month", salesPerMonth);
router.get("/admin/service-sales", isAuthenticatedUser, serviceSales);
module.exports = router;
