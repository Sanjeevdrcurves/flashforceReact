
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Repeat, ChevronDown } from 'lucide-react';
import { RecurrencePattern } from '@/types/activity';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RecurrenceSelectorProps {
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern;
  recurrenceEndDate?: Date;
  recurrenceCount?: number;
  recurrenceDays: number[];
  onIsRecurringChange: (isRecurring: boolean) => void;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onEndDateChange: (date?: Date) => void;
  onCountChange: (count?: number) => void;
  onDaysChange: (days: number[]) => void;
  simplified?: boolean;
}

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  isRecurring,
  recurrencePattern,
  recurrenceEndDate,
  recurrenceCount,
  recurrenceDays,
  onIsRecurringChange,
  onPatternChange,
  onEndDateChange,
  onCountChange,
  onDaysChange,
  simplified = false,
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [endType, setEndType] = useState<'never' | 'on_date' | 'after'>(
    recurrenceEndDate ? 'on_date' : recurrenceCount ? 'after' : 'never'
  );

  // Day names for weekly selection
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Get pattern label for display
  const getPatternLabel = (pattern: RecurrencePattern): string => {
    switch (pattern) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'bi-weekly': return 'Every 2 weeks';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      case 'custom': return 'Custom';
      default: return 'Weekly';
    }
  };

  // Check if a day is selected
  const isDaySelected = (day: number) => recurrenceDays.includes(day);

  // Toggle a day selection
  const toggleDay = (day: number) => {
    if (isDaySelected(day)) {
      onDaysChange(recurrenceDays.filter(d => d !== day));
    } else {
      onDaysChange([...recurrenceDays, day]);
    }
  };

  const handleEndTypeChange = (value: 'never' | 'on_date' | 'after') => {
    setEndType(value);
    if (value === 'never') {
      onEndDateChange(undefined);
      onCountChange(undefined);
    }
  };

  if (simplified) {
    return (
      <div>
        <Popover>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Switch
                checked={isRecurring}
                onCheckedChange={onIsRecurringChange}
              />
              <span className="text-sm font-medium flex items-center">
                <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                {isRecurring 
                  ? `Repeat ${getPatternLabel(recurrencePattern).toLowerCase()}` 
                  : "Repeat this activity"}
              </span>
            </div>
            
            {isRecurring && (
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
            )}
          </div>
          
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Repeat frequency</h3>
              
              <RadioGroup 
                value={recurrencePattern} 
                onValueChange={(value) => onPatternChange(value as RecurrencePattern)}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bi-weekly" id="bi-weekly" />
                    <Label htmlFor="bi-weekly">Every 2 weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Yearly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </div>
              </RadioGroup>
              
              {recurrencePattern === 'weekly' && (
                <>
                  <h3 className="font-medium text-sm mt-4">Repeat on</h3>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {dayNames.map((day, index) => (
                      <Button
                        key={index}
                        variant={isDaySelected(index) ? 'default' : 'outline'}
                        className="w-9 h-9 p-0 flex items-center justify-center"
                        onClick={() => toggleDay(index)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              
              <div className="space-y-2 mt-4">
                <h3 className="font-medium text-sm">Ends</h3>
                <RadioGroup 
                  value={endType} 
                  onValueChange={(value) => handleEndTypeChange(value as 'never' | 'on_date' | 'after')}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="never" />
                      <Label htmlFor="never">Never</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="on_date" id="on_date" />
                      <Label htmlFor="on_date">On date</Label>
                      {endType === 'on_date' && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "ml-2 w-[120px] justify-start text-left font-normal text-xs h-8",
                                !recurrenceEndDate && "text-muted-foreground"
                              )}
                            >
                              {recurrenceEndDate ? format(recurrenceEndDate, "MMM d, yyyy") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={recurrenceEndDate}
                              onSelect={onEndDateChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after" id="after" />
                      <Label htmlFor="after">After</Label>
                      {endType === 'after' && (
                        <div className="flex items-center ml-2">
                          <Input
                            type="number"
                            value={recurrenceCount || ''}
                            onChange={(e) => onCountChange(Number(e.target.value))}
                            className="w-14 h-8 text-sm"
                            min={1}
                          />
                          <span className="ml-2 text-sm">occurrences</span>
                        </div>
                      )}
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowMoreOptions(false)}>Done</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="isRecurring">Repeat this activity</Label>
        <Switch
          id="isRecurring"
          checked={isRecurring}
          onCheckedChange={onIsRecurringChange}
        />
      </div>

      {isRecurring && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="recurrencePatternSelect" className="text-sm">
              Recurrence Pattern
            </Label>
            <Select
              value={recurrencePattern}
              onValueChange={onPatternChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurrencePattern === 'weekly' && (
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={index}
                  variant={isDaySelected(index) ? 'default' : 'outline'}
                  className="w-9 h-9 p-0 flex items-center justify-center"
                  onClick={() => toggleDay(index)}
                >
                  {day}
                </Button>
              ))}
            </div>
          )}

          {recurrencePattern !== 'custom' && (
            <div className="space-y-2">
              <Label className="text-sm">End Recurrence</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className={cn(
                    'w-[140px] justify-start text-left font-normal',
                    recurrenceEndDate ? 'text-foreground' : 'text-muted-foreground'
                  )}
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {recurrenceEndDate ? format(recurrenceEndDate, 'PPP') : <span>Pick a date</span>}
                </Button>
                <Popover open={showMoreOptions} onOpenChange={setShowMoreOptions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !recurrenceEndDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recurrenceEndDate ? format(recurrenceEndDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={recurrenceEndDate}
                      onSelect={onEndDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="number"
                  placeholder="Number of occurrences"
                  value={recurrenceCount || ''}
                  onChange={(e) => onCountChange(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
