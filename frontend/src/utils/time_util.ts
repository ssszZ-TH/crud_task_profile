import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTimeThai = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";

  // Parse เป็น UTC แล้ว convert ไป Asia/Bangkok โดยอัตโนมัติ (+7)
  return dayjs.utc(isoString).tz("Asia/Bangkok").format("DD/MM/YYYY HH:mm:ss");
};

export const formatDateThai = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";

  return dayjs.utc(isoString).tz("Asia/Bangkok").format("DD/MM/YYYY");
};