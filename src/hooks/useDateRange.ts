import { useState, useMemo, useCallback } from "react";
import { startOfMonth } from "date-fns";
import { formatDateForApi } from "@/utils/dateUtils";

export const useDateRange = () => {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(() => 
    startOfMonth(new Date())
  );
  const [localEndDate, setLocalEndDate] = useState<Date | null>(() => new Date());
  const [activeDateField, setActiveDateField] = useState<'start' | 'end' | null>(null);

  const startDateString = useMemo(() => 
    formatDateForApi(localStartDate), 
    [localStartDate]
  );

  const endDateString = useMemo(() => 
    formatDateForApi(localEndDate), 
    [localEndDate]
  );

  const handleDayClick = useCallback((date: Date) => {
    const isSelectingStart = activeDateField !== 'end';
    
    if (isSelectingStart) {
      setLocalStartDate(date);
      if (localEndDate && date > localEndDate) {
        setLocalEndDate(date);
      }
      setActiveDateField('end');
    } else {
      setLocalEndDate(date);
      if (localStartDate && date < localStartDate) {
        setLocalStartDate(date);
      }
      setActiveDateField(null);
    }
  }, [activeDateField, localStartDate, localEndDate]);

  const handleToday = useCallback(() => {
    const today = new Date();
    if (activeDateField === 'start') {
      setLocalStartDate(today);
    } else {
      setLocalEndDate(today);
    }
  }, [activeDateField]);

  return {
    localStartDate,
    localEndDate,
    activeDateField,
    startDateString,
    endDateString,
    setLocalStartDate,
    setLocalEndDate,
    setActiveDateField,
    handleDayClick,
    handleToday,
  };
};

