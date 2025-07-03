const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const format = (input) => {
  let obj;
  if (input instanceof Date) {
    obj = {
      year: input.getFullYear(),
      month: input.getMonth() + 1,
      day: input.getDate(),
    };
  } else if (typeof input === "string") {
    const date = new Date(input);
    obj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  } else {
    const date = new Date();
    obj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  const defaultDesc = `${obj.year}-${obj.month}-${obj.day}`;
  return defaultDesc;
};

const calcCountdown = (target) => {
  let today = dayjs();
  let targetDate = dayjs(target);

  const isLeap = today.year() % 4 === 0;

  today = today.year(1970);
  targetDate = targetDate.year(1970);



  const diff = Math.abs(targetDate.diff(today, "day"));

  return isLeap ? diff - 1 : diff;
};

export { format, calcCountdown };
