export class Timestamp {
  public static readonly max = new Timestamp(Number.MAX_VALUE);
  public static readonly min = new Timestamp(0);

  private constructor(public readonly epochMs: number) {}

  public static fromEpochSeconds(seconds: number | string): Timestamp {
    return typeof seconds === "string"
      ? new Timestamp(Math.round(parseInt(seconds)) * 1000)
      : new Timestamp(Math.round(seconds) * 1000);
  }

  public static fromEpochMs(ms: number | string): Timestamp {
    return typeof ms === "string"
      ? new Timestamp(Math.round(parseInt(ms)))
      : new Timestamp(Math.round(ms));
  }

  public static fromString(value: string): Timestamp {
    const number = parseInt(value);
    return number > 1000000000000
      ? this.fromEpochMs(value)
      : this.fromEpochSeconds(number);
  }

  public static fromStringOptional(value?: string): Timestamp {
    return this.fromString(value ? value : "0");
  }

  public static now(): Timestamp {
    return this.fromEpochMs(new Date().getTime());
  }

  public get epochSeconds(): number {
    return Math.round(this.epochMs / 1000);
  }

  public toString() {
    return `${this.epochMs}`;
  }

  public addDays(days: number) {
    return new Timestamp(this.epochMs + days * msInDay);
  }

  public addSeconds(seconds: number) {
    return new Timestamp(this.epochMs + seconds * 1000);
  }

  public formatUtc() {
    return formatDateUtc(this.date);
  }

  public get date(): Date {
    return new Date(this.epochMs);
  }

  public isGreaterThan(timestamp: Timestamp) {
    return this.epochMs > timestamp.epochMs;
  }

  public isLessThanOrEqualTo(timestamp: Timestamp) {
    return this.epochMs <= timestamp.epochMs;
  }

  public plusMs(ms: number) {
    return Timestamp.fromEpochMs(this.epochMs + ms);
  }

  public minus(timestamp: Timestamp) {
    return new Timestamp(this.epochMs - timestamp.epochMs);
  }

  public dayBegin(): Timestamp {
    return Timestamp.fromEpochMs(Math.floor(this.epochMs / msInDay) * msInDay);
  }
}

const msInDay = 24 * 3600 * 1000;

const formatToDigitNumber = (input: number) => {
  if (input > 9) {
    return input;
  } else return `0${input}`;
};

function formatDateUtc(date: Date) {
  return {
    dd: formatToDigitNumber(date.getUTCDate()),
    MM: formatToDigitNumber(date.getUTCMonth() + 1),
    yyyy: date.getUTCFullYear(),
    HH: formatToDigitNumber(date.getUTCHours()),
    mm: formatToDigitNumber(date.getUTCMinutes()),
    ss: formatToDigitNumber(date.getUTCSeconds()),
  };
}
