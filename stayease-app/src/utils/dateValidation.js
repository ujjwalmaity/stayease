import dayjs from "dayjs";

/**
 * Validate a check-in / check-out date pair.
 *
 * Works for keyboard-typed values too, since it checks the actual dayjs value
 * rather than relying on the DatePicker's calendar UI limits (minDate/maxDate
 * only restrict the calendar — they do NOT block manually typed dates).
 *
 * Rules enforced:
 *  - Both dates are required.
 *  - Dates must be valid.
 *  - Neither date can be in the past.
 *  - Check-out must be strictly after check-in (no same-day, no reverse order).
 *
 * @param {import("dayjs").Dayjs | null} checkInDate
 * @param {import("dayjs").Dayjs | null} checkOutDate
 * @returns {{ checkIn: string, checkOut: string }} error strings (empty when valid)
 */
export const validateDates = (checkInDate, checkOutDate) => {
  const errs = { checkIn: "", checkOut: "" };
  const today = dayjs().startOf("day");

  // Check-In
  if (!checkInDate) {
    errs.checkIn = "Required";
  } else if (!checkInDate.isValid()) {
    errs.checkIn = "Invalid date";
  } else if (checkInDate.startOf("day").isBefore(today)) {
    errs.checkIn = "Past date not allowed";
  }

  // Check-Out
  if (!checkOutDate) {
    errs.checkOut = "Required";
  } else if (!checkOutDate.isValid()) {
    errs.checkOut = "Invalid date";
  } else if (checkOutDate.startOf("day").isBefore(today)) {
    errs.checkOut = "Past date not allowed";
  } else if (checkInDate && checkInDate.isValid()) {
    // Only compare when check-in is a valid date
    if (!checkOutDate.startOf("day").isAfter(checkInDate.startOf("day"))) {
      errs.checkOut = "Must be after check-in";
    }
  }

  return errs;
};

/** Convenience helper — true when the date pair has no validation errors. */
export const areDatesValid = (checkInDate, checkOutDate) => {
  const { checkIn, checkOut } = validateDates(checkInDate, checkOutDate);
  return !checkIn && !checkOut;
};
