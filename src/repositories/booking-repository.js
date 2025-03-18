const CrudRepository = require("./crud-repository");
const { booking } = require("../models");
const AppError = require("../utils/errors/app-errors");
const { StatusCodes } = require("http-status-codes");

class BookingRepository extends CrudRepository {
  constructor() {
    super(booking);
  }

  async createBooking(data, transaction) {
    const res = await booking.create(data, { transaction });
    return res;
  }

  async get(data, transaction) {
    const res = await booking.findByPk(data, { transaction });
    if (!res) {
      throw new AppError("Booking not found", StatusCodes.NOT_FOUND);
    }
    return res;
  }

  async update(id, data, transaction) {
    const response = await this.model.update(data, {
      where: {
        id: id,
      },
    }, { transaction });

    if (response[0] === 0) {
      throw new AppError(
        "Not able to find the resources",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
}

module.exports = BookingRepository;
