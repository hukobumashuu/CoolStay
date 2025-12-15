"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AvailabilityCalendar() {
  const [currentDate] = useState(new Date(2021, 1, 1)); // Set to Feb 2021 to match design for now

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-[340px]">
      {/* Calendar Card */}
      <div className="bg-white p-6 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 p-0 text-gray-600"
          >
            &lt;
          </Button>
          <h3 className="font-bold text-lg text-gray-800">February 2021</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 p-0 text-gray-600"
          >
            &gt;
          </Button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-wider">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
          {days.map((day) => {
            // Mocking some slots availability logic
            const isFull = day === 15 || day === 20;

            return (
              <div
                key={day}
                className="flex flex-col items-center justify-center relative group cursor-pointer"
              >
                <span
                  className={`
                  text-sm font-medium transition-all h-8 w-8 flex items-center justify-center rounded-full
                  ${
                    isFull
                      ? "text-gray-300"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
                >
                  {day}
                </span>
                {/* Slot Indicator Dot */}
                {!isFull && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
