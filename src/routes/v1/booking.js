const express = require("express");

const { BookingController } = require("../../controllers");

const BookingRouter = express.Router();

BookingRouter.post("/", BookingController.createBooking);
BookingRouter.post("/payments", BookingController.makePayment);

module.exports = BookingRouter;
