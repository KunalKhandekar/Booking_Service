const express = require("express");

const { InfoController } = require("../../controllers");
const BookingRouter = require("./booking");

const router = express.Router();
router.use("/bookings", BookingRouter);
router.get("/info", InfoController.info);

module.exports = router;
