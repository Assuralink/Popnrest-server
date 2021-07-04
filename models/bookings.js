function Booking() {
  this.id = 0;
  this.date = "";
  this.date_sql = "";
  this.time = "";
  this.time_sql = "";
  this.duration = "";
  this.location = "";
  this.price = "";
  this.from_today = 0;
}

module.exports = Booking;