export function getTimeZoneOffset(): string {
  const offset = new Date().getTimezoneOffset() / 60;
  return offset < 0 ? `+${Math.abs(offset)}` : `-${Math.abs(offset)}`;
}
