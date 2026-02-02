import { type ReactNode } from "react";
import { TimelineContext } from "./timelineContextValue";
import type { TimelineContextType } from "./timelineContextValue";

type TimelineProviderProps = {
  children: ReactNode;
  value: TimelineContextType;
};

export function TimelineProvider({ children, value }: TimelineProviderProps) {
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}
