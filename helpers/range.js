module.exports.MILLISECONDS_IN_HOUR = 2 * 60 * 60 * 1000;
// function to cala The Date Range I want
module.exports.calculateDayRange = (date, daysAgo = 0) => {
  const start = new Date(date);
  start.setDate(date.getDate() - daysAgo);
  start.setUTCHours(0, 0, 0, 0);
  const beginningOfDayISOString = start.toISOString();

  const end = new Date(date);
  end.setDate(date.getDate() - daysAgo);
  end.setUTCHours(23, 59, 59, 999);
  const endingOfDayISOString = end.toISOString();

  return { beginningOfDayISOString, endingOfDayISOString };
};

module.exports.calculateWeekRange = (date, dayOfWeek) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  start.setDate(date.getDate() - dayOfWeek);
  const beginningOfWeekISOString = start.toISOString();

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  end.setDate(date.getDate() + (6 - dayOfWeek));
  const endingOfWeekISOString = end.toISOString();

  return { beginningOfWeekISOString, endingOfWeekISOString };
};

module.exports.calculateMonthRange = (date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  start.setDate(1);
  const beginningOfMonthISOString = start.toISOString();

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  end.setMonth(date.getMonth() + 1, 0);
  const endingOfMonthISOString = end.toISOString();

  return { beginningOfMonthISOString, endingOfMonthISOString };
};
