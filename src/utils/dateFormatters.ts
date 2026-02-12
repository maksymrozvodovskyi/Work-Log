import { format, parseISO } from "date-fns";

export const formatFeedbackDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "MM/dd/yyyy");
  } catch {
    return "";
  }
};