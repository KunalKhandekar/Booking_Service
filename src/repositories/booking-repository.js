const CrudRepository = require("./crud-repository");
const { booking } = require("../models");
const AppError = require("../utils/errors/app-errors");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

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
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction }
    );

    if (response[0] === 0) {
      throw new AppError(
        "Not able to find the resources",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async cancelOldBookings(timestamp) {
    try {
      const response = await booking.update(
        { status: CANCELLED },
        {
          where: {
            [Op.and]: [
              {
                status: {
                  [Op.notIn]: [CANCELLED, BOOKED],
                },
              },
              {
                createdAt: {
                  [Op.lt]: timestamp,
                },
              },
            ],
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = BookingRepository;
