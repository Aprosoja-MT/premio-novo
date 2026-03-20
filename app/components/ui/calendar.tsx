import { useState } from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import 'react-day-picker/style.css';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const SELECT_CLASS = [
  'appearance-none bg-white border-[1.5px] border-[#94d2b9] rounded-[8px]',
  'text-[12px] font-bold text-[#024240] px-2 py-1 outline-none cursor-pointer',
  'hover:border-[#024240] transition-colors',
].join(' ');

export function Calendar({ className, ...props }: DayPickerProps & { className?: string }) {
  const today = new Date();
  const [month, setMonth] = useState<Date>(
    (props as { selected?: Date }).selected instanceof Date
      ? new Date((props as { selected: Date }).selected.getFullYear(), (props as { selected: Date }).selected.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const currentYear = month.getFullYear();
  const currentMonth = month.getMonth();
  const years = Array.from({ length: 31 }, (_, i) => today.getFullYear() + i);

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonth(new Date(currentYear, Number(e.target.value), 1));
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setMonth(new Date(Number(e.target.value), currentMonth, 1));
  }

  return (
    <DayPicker
      month={month}
      onMonthChange={setMonth}
      showOutsideDays
      className={['p-3 font-sans', className].filter(Boolean).join(' ')}
      classNames={{
        month_caption: 'flex justify-center items-center h-9 relative',
        caption_label: 'hidden',
        nav: 'hidden',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-[11px] font-bold text-[#024240]/40 text-center uppercase',
        week: 'flex mt-1',
        day: 'w-9 h-9 text-center text-[13px] p-0 relative',
        day_button: 'w-9 h-9 rounded-full font-sans text-[13px] text-[#024240] hover:bg-[#94d2b9]/30 transition-colors',
        selected: '[&>button]:bg-[#024240] [&>button]:text-white [&>button]:hover:bg-[#024240]',
        today: '[&>button]:border [&>button]:border-[#94d2b9] [&>button]:font-bold',
        outside: '[&>button]:text-[#024240]/25',
        disabled: '[&>button]:text-[#024240]/20 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent',
        hidden: 'invisible',
      }}
      components={{
        MonthCaption: () => (
          <div className="flex items-center justify-center gap-2 h-9">
            <select value={currentMonth} onChange={handleMonthChange} className={SELECT_CLASS}>
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select value={currentYear} onChange={handleYearChange} className={SELECT_CLASS}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        ),
      }}
      {...props}
    />
  );
}
