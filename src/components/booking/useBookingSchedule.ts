import { useState, useMemo, useEffect, useRef } from 'react';
import { DayItem } from './types.ts';

export const useBookingSchedule = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<DayItem | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate 6-day week strip (Monday through Saturday) for the active weekOffset
  const weekDays: DayItem[] = useMemo(() => {
    const list: DayItem[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dayOfWeek = now.getDay();
    const diffToMon = dayOfWeek === 0 ? 1 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon + weekOffset * 7);

    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dateString = d.toISOString().split('T')[0];
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = d.toLocaleDateString('en-US', { month: 'long' });
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const dayNum = d.getDate();
      const isPast = d < now;

      list.push({
        id: `${dateString}`,
        dateString,
        dayShort,
        dayFull,
        dayNum,
        monthName,
        monthShort,
        year,
        formattedDate: `${monthShort} ${dayNum}, ${year}`,
        isPast,
      });
    }

    return list;
  }, [weekOffset]);

  const displayedMonthYear = useMemo(() => {
    if (weekDays.length === 0) return 'September 2026';
    const first = weekDays[0];
    const last = weekDays[weekDays.length - 1];
    if (first.monthName === last.monthName) {
      return `${first.monthName} ${first.year}`;
    }
    return `${first.monthShort} – ${last.monthShort} ${last.year}`;
  }, [weekDays]);

  useEffect(() => {
    if (weekDays.length > 0) {
      const match = weekDays.find((d) => d.dateString === selectedDate?.dateString);
      if (!match) {
        const firstAvailable = weekDays.find((d) => !d.isPast) || weekDays[0];
        setSelectedDate(firstAvailable);
      }
    }
  }, [weekDays, selectedDate]);

  // Physics Drag Hook for Days Strip
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animId = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    velocity.current = 0;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
    if (animId.current) cancelAnimationFrame(animId.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (e.pageX - lastX.current) / dt;
    }
    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    if (!isDown.current || !containerRef.current) return;
    isDown.current = false;

    let v = velocity.current * 14;
    const friction = 0.92;
    const step = () => {
      if (!containerRef.current || Math.abs(v) < 0.25) return;
      containerRef.current.scrollLeft -= v;
      v *= friction;
      animId.current = requestAnimationFrame(step);
    };
    animId.current = requestAnimationFrame(step);
  };

  const daysDrag = {
    ref: containerRef,
    props: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };

  return {
    weekOffset,
    setWeekOffset,
    weekDays,
    displayedMonthYear,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    daysDrag,
  };
};
