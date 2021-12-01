const formatToDigitNumber = (input: number) => {
  if (input > 9) {
    return input;
  } else return `0${input}`;
};

export function formatDateUtc(date: Date) {
  return {
    dd: formatToDigitNumber(date.getUTCDate()),
    MM: formatToDigitNumber(date.getUTCMonth() + 1),
    yyyy: date.getUTCFullYear(),
    HH: formatToDigitNumber(date.getUTCHours()),
    mm: formatToDigitNumber(date.getUTCMinutes()),
    ss: formatToDigitNumber(date.getUTCSeconds()),
  };
}
