import { createParser } from "nuqs";
import type { SortDirectionType } from "@/types/User";

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

export const parsers = {
  sortField: createSortFieldParser,
  sortDirection: createSortDirectionParser,
  status: createStatusParser,
  statusArray: createStatusArrayParser,
  enum: createEnumParser,
};
