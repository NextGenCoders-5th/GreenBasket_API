const OneDay = 24 * 60 * 60 * 1000;

export function DayToTimestamp(day: number) {
  return day * OneDay;
}
