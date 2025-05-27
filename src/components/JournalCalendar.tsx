
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { getEntriesForMonth } from '@/lib/storage';

const JournalCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const entries = getEntriesForMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const symptomLevels = ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'];
  const symptomColors = [
    'bg-emerald-100 text-emerald-800',
    'bg-yellow-100 text-yellow-800', 
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-red-200 text-red-900'
  ];

  const getDateStyle = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = entries[dateStr];
    
    if (!entry) return '';
    
    // Style based on symptom severity
    switch (entry.symptoms) {
      case 0: return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 1: return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case 2: return 'bg-orange-50 text-orange-900 border-orange-200';
      case 3: return 'bg-red-50 text-red-900 border-red-200';
      case 4: return 'bg-red-100 text-red-900 border-red-300';
      default: return '';
    }
  };

  const selectedEntry = selectedDate ? entries[selectedDate.toISOString().split('T')[0]] : null;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white/90">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-serif text-slate-700 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-slate-500" />
            Symptom Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            onMonthChange={setCurrentMonth}
            month={currentMonth}
            className="rounded-md border-0"
            modifiers={{
              hasEntry: (date) => {
                const dateStr = date.toISOString().split('T')[0];
                return !!entries[dateStr];
              }
            }}
            modifiersClassNames={{
              hasEntry: "border-2 font-medium"
            }}
            classNames={{
              day: "h-12 w-12 text-sm font-crimson relative",
              day_selected: "bg-slate-800 text-white hover:bg-slate-700",
              day_today: "bg-slate-100 text-slate-900 font-semibold",
            }}
            components={{
              Day: ({ date, ...props }) => {
                const style = getDateStyle(date);
                return (
                  <div 
                    className={`h-12 w-12 flex items-center justify-center rounded-md cursor-pointer hover:bg-slate-50 ${style}`}
                    {...props}
                  >
                    {date.getDate()}
                  </div>
                );
              }
            }}
          />
          
          {/* Legend */}
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-slate-600 font-serif">Symptom Severity Legend:</p>
            <div className="flex flex-wrap gap-2">
              {symptomLevels.map((level, index) => (
                <Badge key={index} variant="outline" className={`${symptomColors[index]} border-0 font-crimson`}>
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedEntry && (
        <Card className="border-0 shadow-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-slate-700">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-crimson">Mood:</span>
              <span className="text-2xl">
                {['😰', '😕', '😐', '😊', '😍'][selectedEntry.mood]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-crimson">Symptoms:</span>
              <Badge className={`${symptomColors[selectedEntry.symptoms]} border-0`}>
                {symptomLevels[selectedEntry.symptoms]}
              </Badge>
            </div>
            {selectedEntry.notes && (
              <div>
                <span className="text-slate-600 font-crimson block mb-1">Notes:</span>
                <p className="text-slate-700 italic font-lora text-sm leading-relaxed">
                  "{selectedEntry.notes}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalCalendar;
