import { type ReactNode } from "react";
import { TimelineContext } from "./timelineContextValue";
import type { TimelineContextType } from "./timelineContextValue";

type TimelineProviderPropsType = {
  children: ReactNode;
  value: TimelineContextType;
};

export function TimelineProvider({ children, value }: TimelineProviderPropsType) {
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}
