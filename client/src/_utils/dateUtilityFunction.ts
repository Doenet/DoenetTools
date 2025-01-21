import { DateTime } from "luxon";

export function formatTime(time: string | null) {
  let timeFormatted: string | undefined;

  if (time !== null) {
    const sameDay = (a: DateTime, b: DateTime): boolean => {
      return (
        a.hasSame(b, "day") && a.hasSame(b, "month") && a.hasSame(b, "year")
      );
    };

    const closeDateTime = DateTime.fromISO(time);
    const now = DateTime.now();
    const tomorrow = now.plus({ day: 1 });

    if (sameDay(closeDateTime, now)) {
      if (closeDateTime.minute === 0) {
        timeFormatted = `today, ${closeDateTime.toLocaleString({ hour: "2-digit" })}`;
      } else {
        timeFormatted = `today, ${closeDateTime.toLocaleString({ hour: "2-digit", minute: "2-digit" })}`;
      }
    } else if (sameDay(closeDateTime, tomorrow)) {
      if (closeDateTime.minute === 0) {
        timeFormatted = `tomorrow, ${closeDateTime.toLocaleString({ hour: "2-digit" })}`;
      } else {
        timeFormatted = `tomorrow, ${closeDateTime.toLocaleString({ hour: "2-digit", minute: "2-digit" })}`;
      }
    } else if (closeDateTime.year === now.year) {
      if (closeDateTime.minute === 0) {
        timeFormatted = closeDateTime.toLocaleString({
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
        });
      } else {
        timeFormatted = closeDateTime.toLocaleString({
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } else {
      timeFormatted = closeDateTime.toLocaleString(DateTime.DATETIME_MED);
    }
  }

  return timeFormatted;
}
