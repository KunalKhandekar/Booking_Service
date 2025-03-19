const cron = require("node-cron");

const { BookingService } = require("../../services");

function scheduleCrons() {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Cron Job: Update Expired Bookings");
    const response = await BookingService.updateExpiredBookings();
    console.log("Expired Bookings Updated", response);
  });
}

module.exports = {
  scheduleCrons,
};
