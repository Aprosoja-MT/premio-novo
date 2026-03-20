import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

const INPUT_CLASS = 'h-[46px] rounded-[12px] border-[1.5px] border-[#94d2b9] bg-white text-[13px] text-[#024240] focus-visible:border-[#024240] focus-visible:ring-[#024240]/10';

type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
};

export function DatePicker({ value, onChange, placeholder = 'Selecione uma data', disabled, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={[
            INPUT_CLASS,
            'w-full flex items-center justify-between px-3 cursor-pointer',
            !value && 'text-[#024240]/30',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span>{value ? format(value, 'dd/MM/yyyy') : placeholder}</span>
          <CalendarIcon size={15} strokeWidth={1.75} className="text-[#94d2b9]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2050, 11)}
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          locale={ptBR}
          className="bg-white"
        />
      </PopoverContent>
    </Popover>
  );
}
