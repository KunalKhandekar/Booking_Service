const axios = require("axios");

const { BookingRepository } = require("../repositories");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-errors");
const serverConfig = require("../config/server-config");

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

module.exports = { createBooking };
