// To fetch an array of dates between two dates

const DateRange = (startDate, endDate, steps = 3) => {
  if (startDate > endDate)
    return "Start date cannot be higher than the end date";
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }
  return dateArray.map(
    (data) =>
      data.getFullYear() +
      "-" +
      (data.getMonth() + 1 < 9
        ? "0" + (data.getMonth() + 1)
        : data.getMonth() + 1) +
      "-" +
      (data.getDate() < 10 ? "0" + data.getDate() : data.getDate())
  );
};

module.exports = DateRange;
