// src/utils/helpers.js

/**
 * PHONE HELPERS
 */
export const formatPhone = (value = "") => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const isValidPhone = (value = "") => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10;
};


/**
 * VALIDATION HELPERS
 */
export const emailPattern = /^\S+@\S+$/i;

export const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

export const isStrongPassword = (value = "") => {
    return passwordPattern.test(value);
};

export const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

export const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;

export const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

export const zipPattern = /^[0-9]{4,10}$/;

export const alphaPattern = /^[A-Za-z ]+$/;

export const numberPattern = /^[0-9]*\.?[0-9]+$/;

/**
 * GENERAL FORMATTERS
 */
export const onlyDigits = (value = "") => value.replace(/\D/g, "");

export const capitalize = (value = "") =>
    value.charAt(0).toUpperCase() + value.slice(1);

//replace _ with space && ucfirst each word
export const formatString = (str = "") => {
    return str
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};


/**
 * DATE HELPERS
 */

// Format date to DD/MM/YYYY
export const formatDateDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

// Format date to DD-MM-YYYY
export const formatDateDDMMYYYYDash = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};

// Format to YYYY-MM-DD (useful for API input)
export const formatDateYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
};

// Convert DD/MM/YYYY -> YYYY-MM-DD
export const convertDDMMYYYYToAPI = (value) => {
    if (!value) return "";
    const [day, month, year] = value.split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`;
};

// Check valid DD/MM/YYYY format
export const isValidDDMMYYYY = (value) => {
    if (!value) return false;

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(value)) return false;

    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
};

// Today's date in YYYY-MM-DD
export const today = () => {
    return formatDateYYYYMMDD(new Date());
};

// Add days to a date
export const addDays = (date, days) => {
    const d = new Date(date);
    if (isNaN(d)) return "";
    d.setDate(d.getDate() + days);
    return d;
};

// Subtract days
export const subtractDays = (date, days) => {
    const d = new Date(date);
    if (isNaN(d)) return "";
    d.setDate(d.getDate() - days);
    return d;
};


export const formatCurrency = (amount, currency) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);


/**
 * TIME HELPERS
 */

// Format JS date object or string to HH:mm (24-hour)
export const formatTime24 = (time) => {
    const d = new Date(time);
    if (isNaN(d)) return "";

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
};

// Format JS date object or string to hh:mm AM/PM (12-hour)
export const formatTime12 = (time) => {
    const d = new Date(time);
    if (isNaN(d)) return "";

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

// Convert 12-hour string → 24-hour
// Example: "02:30 PM" → "14:30"
export const convert12To24 = (value) => {
    if (!value) return "";
    const [time, modifier] = value.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
};

// Convert 24-hour → 12-hour
// Example: "14:30" → "02:30 PM"
export const convert24To12 = (value) => {
    if (!value) return "";

    let [hours, minutes] = value.split(":").map(Number);

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

// Validate HH:mm (24-hour format)
export const isValidTime24 = (value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(value);
};

// Validate hh:mm AM/PM (12-hour)
export const isValidTime12 = (value) => {
    const regex = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
    return regex.test(value);
};

// Returns current time HH:mm (24-hour)
export const currentTime24 = () => {
    const now = new Date();
    return formatTime24(now);
};

// Returns current time hh:mm A
export const currentTime12 = () => {
    const now = new Date();
    return formatTime12(now);
};


/**
 * DATETIME HELPERS
 */

// Format full datetime → "DD/MM/YYYY HH:mm"
export const formatDateTimeDDMMYYYY_HHMM = (datetime) => {
    if (!datetime) return "";
    const d = new Date(datetime);
    if (isNaN(d)) return "";

    const date = formatDateDDMMYYYY(d);
    const time = formatTime24(d);

    return `${date} ${time}`;
};

// Format full datetime → "DD/MM/YYYY hh:mm AM/PM"
export const formatDateTimeDDMMYYYY_12H = (datetime) => {
    if (!datetime) return "";
    const d = new Date(datetime);
    if (isNaN(d)) return "";

    const date = formatDateDDMMYYYY(d);
    const time = formatTime12(d);

    return `${date} ${time}`;
};

// Format full datetime → "YYYY-MM-DD HH:mm" (API friendly)
export const formatDateTimeYYYYMMDD_HHMM = (datetime) => {
    if (!datetime) return "";
    const d = new Date(datetime);
    if (isNaN(d)) return "";

    const date = formatDateYYYYMMDD(d);
    const time = formatTime24(d);

    return `${date} ${time}`;
};

// Convert "DD/MM/YYYY HH:mm" -> "YYYY-MM-DD HH:mm"
export const convertDDMMYYYY_HHMMToAPI = (value) => {
    if (!value) return "";

    const [datePart, timePart] = value.split(" ");
    if (!datePart || !timePart) return "";

    const apiDate = convertDDMMYYYYToAPI(datePart);
    return `${apiDate} ${timePart}`;
};

// Extract just the date (YYYY-MM-DD) from ISO datetime
export const extractDateFromISO = (value) => {
    if (!value) return "";
    return value.split("T")[0]; // "2025-02-01T10:20:30" → "2025-02-01"
};

// Extract time (HH:mm) from ISO datetime
export const extractTimeFromISO = (value) => {
    if (!value) return "";
    const time = value.split("T")[1];
    return time ? time.slice(0, 5) : ""; // "10:20"
};

// Combine date + time strings → ISO datetime
export const combineDateTime = (date, time) => {
    if (!date || !time) return "";
    return `${date}T${time}:00`;
    // Example: "2025-01-30" + "14:20" → "2025-01-30T14:20:00"
};

// Check if valid ISO datetime
export const isValidISODateTime = (value) => {
    return !isNaN(new Date(value));
};

// Today's datetime as ISO
export const nowISO = () => {
    return new Date().toISOString();
};

// Current datetime in YYYY-MM-DD HH:mm
export const nowDateTime = () => {
    return formatDateTimeYYYYMMDD_HHMM(new Date());
};

// Credit Card Helpers
export const currentYear = new Date().getFullYear();
export const creditYears = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear + i,
    label: currentYear + i
}));
export const ccNumberRegex = /^[0-9]{13,19}$/; // basic length check
export const cvvRegex = /^[0-9]{3,4}$/;        // 3-4 digits
export const validateLuhn = (num) => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num[i], 10);
        if (shouldDouble) digit = digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};
export const ccRegex = {
    AmericanExpress: /^3[47][0-9]{13}$/, // starts 34 or 37
    Visa: /^4[0-9]{15}$/,
    MasterCard: /^5[1-5][0-9]{14}$/,
    Rupay: /^[6-9][0-9]{15}$/,
    Maestro: /^[5-6][0-9]{15}$/
};
export const formatCardNumber = (num, type) => {
  const clean = num.replace(/\D/g, "");

  // American Express (4-6-5)
  if (type === "AmericanExpress") {
    return clean
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (m, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join(" ")
      );
  }
  // Default mask 4-4-4-4 (Visa, MasterCard, Rupay, Maestro)
  return clean
    .replace(/(\d{4})/g, "$1 ")
    .trim();
};


