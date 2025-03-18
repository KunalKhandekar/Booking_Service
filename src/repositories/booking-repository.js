const CrudRepository = require("./crud-repository");
const { booking } = require("../models");

class BookingRepository extends CrudRepository {
  constructor() {
    super(booking);
  }

  async createBooking(data, transaction) {
    const res = await booking.create(data, { transaction });
    return res;
  }
}

module.exports = BookingRepository;
