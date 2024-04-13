import { format } from "date-fns";

export const displayDateFormat = (date: Date) => {
  return format(new Date(date), "dd-MMM-yyyy");
};