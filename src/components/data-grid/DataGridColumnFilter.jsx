import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function DataGridColumnFilter({ column, title, options }) {
  const [selectedValue, setSelectedValue] = React.useState(options[0]?.value || ""); // Default to first option value
  const [sortingOrder, setSortingOrder] = React.useState("Ascending");
  const [isOpen, setIsOpen] = React.useState(false); // Control Popover visibility

  const closePopover = () => setIsOpen(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="light" size="sm" onClick={() => setIsOpen(true)}>
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Groups</h3>
          <Button variant="ghost" size="sm" onClick={closePopover}>
            ✕
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          {/* Selection Dropdown */}
          <div>
            <h4 className="mb-2 font-medium">Selection</h4>
            <Select
              value={selectedValue}
              onValueChange={(value) => setSelectedValue(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <h4 className="mb-2 font-medium">Sorting</h4>
            <Select
              value={sortingOrder}
              onValueChange={(value) => setSortingOrder(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ascending" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ascending">Ascending</SelectItem>
                <SelectItem value="Descending">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
