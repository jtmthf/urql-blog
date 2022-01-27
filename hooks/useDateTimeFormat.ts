import { useRouter } from "next/router";
import { useMemo } from "react";

export function useDateTimeFormat(
  date?: number | string | Date,
  {
    dateStyle,
    timeStyle,
    calendar,
    dayPeriod,
    numberingSystem,
    localeMatcher,
    timeZone,
    hourCycle,
    formatMatcher,
    weekday,
    era,
    year,
    month,
    day,
    hour,
    minute,
    second,
    fractionalSecondDigits,
    timeZoneName,
  }: Intl.DateTimeFormatOptions = {}
) {
  const router = useRouter();

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(router.locale, {
        dateStyle,
        timeStyle,
        calendar,
        dayPeriod,
        numberingSystem,
        localeMatcher,
        timeZone,
        hourCycle,
        formatMatcher,
        weekday,
        era,
        year,
        month,
        day,
        hour,
        minute,
        second,
        fractionalSecondDigits,
        timeZoneName,
      }),
    [
      router.locale,
      dateStyle,
      timeStyle,
      calendar,
      dayPeriod,
      numberingSystem,
      localeMatcher,
      timeZone,
      hourCycle,
      formatMatcher,
      weekday,
      era,
      year,
      month,
      day,
      hour,
      minute,
      second,
      fractionalSecondDigits,
      timeZoneName,
    ]
  );

  const normalizedDate = useMemo(() => {
    if (typeof date === "string") {
      if (/^\d+$/.test(date)) {
        return Number(date);
      } else {
        return new Date(date);
      }
    }
  }, []);

  return useMemo(
    () => formatter.format(normalizedDate),
    [normalizedDate, formatter]
  );
}
