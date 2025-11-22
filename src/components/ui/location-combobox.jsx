import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function LocationCombobox({ value, onSelect, options = [], placeholder = "Select location...", className }) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  const selectedOption = options.find((option) => option.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-transparent text-gray-800 border-0 border-r sm:border-r border-gray-200 rounded-none px-4 sm:px-6 py-3 sm:py-4 h-auto font-normal hover:bg-gray-50/50 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-full sm:min-w-[200px]",
            !selectedOption && "text-gray-500",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="truncate text-sm sm:text-base">
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[300px] p-0 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl shadow-orange-500/10"
        align="start"
      >
        <Command>
          <CommandInput 
            placeholder="Search locations..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="text-gray-800 border-b border-gray-100"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No location found.
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.name}
                  value={option.name}
                  onSelect={(currentValue) => {
                    onSelect(option)
                    setOpen(false)
                    setSearchValue("")
                  }}
                  className="flex items-center gap-2 text-gray-800 hover:bg-orange-50 data-[selected=true]:bg-orange-100 cursor-pointer px-3 py-2"
                >
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="flex-1">{option.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-orange-500",
                      selectedOption?.name === option.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}