// const moment = require('moment');
const momentTz = require('moment-timezone');

const tzName = 'Asia/Shanghai';

function TimeNowStr() {
  const now = momentTz().tz(tzName).format('YYYY-MM-DD HH:mm:ss');
  return now;
}

module.exports = {
  TimeNowStr,
}