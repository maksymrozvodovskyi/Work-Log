import { useContext } from "react";
import { TimelineContext } from "./timelineContextValue";

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimelineContext must be used within TimelineProvider");
  }
  return context;
};

