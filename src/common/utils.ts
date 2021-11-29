import { randomBytes } from "crypto";

const pad = (value: number): string => {
  return (value < 10 ? '0' : '') + value;
};

const secsToHMS = (seconds: number): string => {
  let hrs = Math.floor(seconds / (60 * 60));
  let mins = Math.floor(seconds % (60 * 60) / 60);
  let secs = Math.floor(seconds % 60);

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

const formatDateTime = (dateTime: Date | string): string => {
  const dt = typeof dateTime === 'string'
    ? new Date(dateTime)
    : dateTime;

  const day = dt.getDate(),
    monthIndex = dt.getMonth(),
    year = dt.getFullYear(),
    minutes = pad(dt.getMinutes()),
    hours = pad(dt.getHours()),
    seconds = pad(dt.getSeconds());

  const formatted = `${day}/${monthIndex+1}/${year} ${hours}:${minutes}:${seconds}`;

  return formatted;
};

// ID ramdomly generated in order for both publishers
// and listeners being instantiated without conflict
const generateClientID = (prefix: string): string => {
  return `${prefix}-${randomBytes(4).toString('hex')}`;
};

export {
  formatDateTime,
  generateClientID,
  secsToHMS,
};
