const axios = require("axios");

const { BookingRepository } = require("../repositories");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-errors");
const serverConfig = require("../config/server-config");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      serverConfig.FLIGHT_SERVICE_URL + "/api/v1/flights/" + data.flightId
    );
    const flightData = flight.data?.data;
    if (flightData?.totalSeats < data.noOfSeats) {
      throw new AppError(
        "No of seats requested is greater than available seats",
        StatusCodes.BAD_REQUEST
      );
    }

    const totalCost = data.noOfSeats * flightData.price;

    const bookingPayload = {
      ...data,
      totalCost,
    };

    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    await axios.patch(
      `${serverConfig.FLIGHT_SERVICE_URL}/api/v1/flights/${data.flightId}/seats`,
      { seats: data.noOfSeats }
    );

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );

    if (bookingDetails.status === BOOKED) {
      throw new AppError("Booking already confirmed", StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.status === CANCELLED) {
      throw new AppError("Booking already cancelled", StatusCodes.BAD_REQUEST);
    }

    const boookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    if (currentTime - boookingTime > 10 * 60 * 1000) {
      await bookingRepository.update(
        data.bookingId,
        { status: CANCELLED },
        transaction
      );
      throw new AppError("Booking expired", StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.totalCost != data.totalCost) {
      throw new AppError("Amount mismatch", StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.userId != data.userId) {
      throw new AppError("User mismatch", StatusCodes.BAD_REQUEST);
    }

    // Assuming the payment is successfully made

    await bookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      transaction
    );

    console.log("Booking confirmed", respone);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { createBooking, makePayment };
