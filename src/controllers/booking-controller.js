const { BookingService } = require("../services");

const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function createBooking(req, res) {
  try {
    const flights = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.message = "Successfully made a booking";
    SuccessResponse.data = flights;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message =
      "Something went wrong while trying to make a booking";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


async function makePayment(req, res) {
  try {
    const flights = await BookingService.makePayment({
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      totalCost: req.body.totalCost,
    });
    SuccessResponse.message = "Successfully completed payment";
    SuccessResponse.data = flights;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message =
      "Something went wrong while trying to make a paymrn";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = { createBooking, makePayment };
