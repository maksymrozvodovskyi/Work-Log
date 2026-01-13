import { createParser } from "nuqs";
import type { SortDirectionType } from "@/types/User";

const createSortFieldParser = <T extends string>(
  validFields: T[],
  defaultValue: T
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

export const parsers = {
  sortField: createSortFieldParser,
  sortDirection: createSortDirectionParser,
  status: createStatusParser,
  enum: createEnumParser,
};
