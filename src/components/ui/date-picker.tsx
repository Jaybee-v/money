"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected?: string;
  onSelect: (date: string | undefined) => void;
}

export function DatePicker({ selected, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(new Date(selected), "PPP")
          ) : (
            <span>Sélectionnez une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected ? new Date(selected) : undefined}
          onSelect={(date) => {
            if (date) {
              // Forcer le fuseau horaire local
              const localDate = new Date(date.setHours(12));
              onSelect(localDate.toISOString());
            } else {
              onSelect(undefined);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
