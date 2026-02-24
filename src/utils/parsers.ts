import { createParser } from "nuqs";
import type { SortDirectionType } from "@/types/User";
import type { ActivityType } from "@/types/Report";

const createSortFieldParser = <T extends string>(
  validFields: T[],
  defaultValue: T,
) => {
  return createParser({
    parse: (value: string): T => {
      if (validFields.includes(value as T)) {
        return value as T;
      }
      return defaultValue;
    },
    serialize: (value: T) => value,
  });
};

const createSortDirectionParser = () => {
  return createParser<SortDirectionType>({
    parse: (value: string): SortDirectionType => {
      if (value === "asc" || value === "desc") {
        return value as SortDirectionType;
      }
      return "asc";
    },
    serialize: (value: SortDirectionType) => value,
  });
};

const createStatusParser = <T extends string>(validStatuses: T[]) => {
  return createParser<T | null>({
    parse: (value: string | null): T | null => {
      if (!value) return null;
      if (validStatuses.includes(value as T)) {
        return value as T;
      }
      return null;
    },
    serialize: (value: T | null): string => value || "",
  });
};

const createStatusArrayParser = <T extends string>(validStatuses: T[]) => {
  return createParser<T[]>({
    parse: (value: string | null): T[] => {
      if (!value?.trim()) return [];
      return value
        .split(",")
        .filter((s) => s.trim() && validStatuses.includes(s.trim() as T))
        .map((s) => s.trim()) as T[];
    },
    serialize: (value: T[]): string =>
      value.length > 0 ? value.join(",") : "",
  });
};

const createEnumParser = <T extends string>(validValues: T[]) => {
  return createParser<T | null>({
    parse: (value: string | null): T | null => {
      if (!value) return null;
      if (validValues.includes(value as T)) {
        return value as T;
      }
      return null;
    },
    serialize: (value: T | null): string => value || "",
  });
};

export const parseAsFeedbackPeriod = createParser<"7days" | "30days" | null>({
  parse: (value: string): "7days" | "30days" | null => {
    if (value === "7days" || value === "30days") {
      return value;
    }
    return null;
  },
  serialize: (value: "7days" | "30days" | null): string => value ?? "",
});

const ACTIVITY_TYPES = [
  "CODING",
  "REVIEW",
  "STUDING",
  "SICKLEAVE",
  "VACATION",
] as const;
const ACTIVITY_TYPES_WITH_WITHOUT = [
  ...ACTIVITY_TYPES,
  "WITHOUT_REPORT",
] as const;
const HOURS_FILTERS = ["<8h", "8h", "8h>"] as const;
const REPORT_HOURS_FILTERS = ["LT_8", "EQ_8", "GT_8"] as const;
const REPORTS_SORT_FIELDS = ["name", "status", "totalMinutes"] as const;

export const parseAsReportActivityTypes = createParser<string[]>({
  parse: (value: string | null): string[] => {
    if (!value?.trim()) return [];
    return value
      .split(",")
      .filter(
        (s) =>
          s.trim() &&
          ACTIVITY_TYPES.includes(s.trim() as (typeof ACTIVITY_TYPES)[number]),
      )
      .map((s) => s.trim());
  },
  serialize: (value: string[]): string =>
    value.length > 0 ? value.join(",") : "",
});

export const parseAsReportActivityTypesWithWithout = createParser<
  ActivityType[]
>({
  parse: (value: string | null): ActivityType[] => {
    if (!value?.trim()) return [];
    return value
      .split(",")
      .filter(
        (s) =>
          s.trim() &&
          ACTIVITY_TYPES_WITH_WITHOUT.includes(
            s.trim() as (typeof ACTIVITY_TYPES_WITH_WITHOUT)[number],
          ),
      )
      .map((s) => s.trim() as ActivityType);
  },
  serialize: (value: ActivityType[]) =>
    (value.length ? value.join(",") : null) as string,
});

export const parseAsReportHoursFilter = createParser<
  (typeof REPORT_HOURS_FILTERS)[number] | null
>({
  parse: (
    value: string | null,
  ): (typeof REPORT_HOURS_FILTERS)[number] | null => {
    if (
      !value ||
      !REPORT_HOURS_FILTERS.includes(
        value as (typeof REPORT_HOURS_FILTERS)[number],
      )
    )
      return null;
    return value as (typeof REPORT_HOURS_FILTERS)[number];
  },
  serialize: (value: (typeof REPORT_HOURS_FILTERS)[number] | null): string =>
    value ?? "",
});

export const parseAsReportHoursFilterArray = createParser<
  (typeof REPORT_HOURS_FILTERS)[number][]
>({
  parse: (value: string | null) => {
    if (!value?.trim()) return [];
    return value
      .split(",")
      .filter(
        (s) =>
          s.trim() &&
          REPORT_HOURS_FILTERS.includes(
            s.trim() as (typeof REPORT_HOURS_FILTERS)[number],
          ),
      )
      .map((s) => s.trim()) as (typeof REPORT_HOURS_FILTERS)[number][];
  },
  serialize: (value) => (value.length ? value.join(",") : null) as string,
});

export const parseAsHoursFilter = createParser<
  (typeof HOURS_FILTERS)[number] | null
>({
  parse: (value: string | null): (typeof HOURS_FILTERS)[number] | null => {
    if (
      !value ||
      !HOURS_FILTERS.includes(value as (typeof HOURS_FILTERS)[number])
    )
      return null;
    return value as (typeof HOURS_FILTERS)[number];
  },
  serialize: (value: (typeof HOURS_FILTERS)[number] | null): string =>
    value ?? "",
});

export const parseAsReportSortField = createParser<
  (typeof REPORTS_SORT_FIELDS)[number]
>({
  parse: (value: string): (typeof REPORTS_SORT_FIELDS)[number] => {
    if (
      REPORTS_SORT_FIELDS.includes(
        value as (typeof REPORTS_SORT_FIELDS)[number],
      )
    ) {
      return value as (typeof REPORTS_SORT_FIELDS)[number];
    }
    return "name";
  },
  serialize: (value: (typeof REPORTS_SORT_FIELDS)[number]) => value,
});

export const parseAsReportDate = createParser<string>({
  parse: (value: string | null): string => {
    if (!value?.trim()) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return value;
  },
  serialize: (value: string): string => value ?? "",
});

const REPORT_TYPES = ["missed", "work", "special", "overtime"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const parseAsReportType = createParser<ReportType | null>({
  parse: (value: string | null): ReportType | null => {
    if (!value || !REPORT_TYPES.includes(value as ReportType)) return null;
    return value as ReportType;
  },
  serialize: (value: ReportType | null): string => value ?? "",
});

export const parsers = {
  sortField: createSortFieldParser,
  sortDirection: createSortDirectionParser,
  status: createStatusParser,
  statusArray: createStatusArrayParser,
  enum: createEnumParser,
};
