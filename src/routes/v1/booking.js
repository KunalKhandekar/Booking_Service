const express = require("express");

const { BookingController } = require("../../controllers");

const BookingRouter = express.Router();

BookingRouter.post("/", BookingController.createBooking);

module.exports = BookingRouter;
