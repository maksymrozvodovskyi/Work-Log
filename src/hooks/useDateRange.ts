import { useState, useMemo } from "react";
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

  const handleDayClick = (date: Date) => {
    if (activeDateField === 'start') {
      if (localEndDate && date > localEndDate) {
        setLocalEndDate(date);
      }
      setLocalStartDate(date);
      setActiveDateField('end');
    } else if (activeDateField === 'end') {
      if (localStartDate && date < localStartDate) {
        setLocalStartDate(date);
      }
      setLocalEndDate(date);
      setActiveDateField(null);
    } else {
      setLocalStartDate(date);
      if (!localEndDate || date > localEndDate) {
        setLocalEndDate(date);
      }
      setActiveDateField('end');
    }
  };

  const handleToday = () => {
    const todayDate = new Date();
    if (activeDateField === 'start') {
      setLocalStartDate(todayDate);
    } else if (activeDateField === 'end') {
      setLocalEndDate(todayDate);
    } else {
      setLocalEndDate(todayDate);
    }
  };

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

