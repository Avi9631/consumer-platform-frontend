import * as React from "react"
import { Search, Building2, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function SearchWithSuggestions({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  suggestions = [],
  onSuggestionSelect,
  className 
}) {
  const [open, setOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef(null)
  const dropdownRef = React.useRef(null)

  // Filter suggestions based on search value
  const filteredSuggestions = React.useMemo(() => {
    if (!value || value.length < 2) return []
    
    const searchLower = value.toLowerCase()
    return suggestions.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower)
    ).slice(0, 8) // Limit to 8 results
  }, [value, suggestions])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!open || filteredSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleSelect = (item) => {
    onSuggestionSelect?.(item)
    onChange(item.name)
    setOpen(false)
    setHighlightedIndex(-1)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Open dropdown when there are suggestions
  React.useEffect(() => {
    if (filteredSuggestions.length > 0 && value.length >= 2) {
      setOpen(true)
    } else {
      setOpen(false)
      setHighlightedIndex(-1)
    }
  }, [filteredSuggestions.length, value])

  const getIcon = (category) => {
    switch (category) {
      case 'location':
        return <MapPin className="h-4 w-4 text-orange-500" />
      case 'developer':
        return <Users className="h-4 w-4 text-blue-500" />
      case 'project':
        return <Building2 className="h-4 w-4 text-green-500" />
      default:
        return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'location':
        return 'Location'
      case 'developer':
        return 'Developer'
      case 'project':
        return 'Project'
      default:
        return ''
    }
  }

  return (
    <div className={cn("relative flex-1", className)}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredSuggestions.length > 0) {
            setOpen(true)
          }
        }}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-gray-800 focus:outline-none text-sm sm:text-base"
      />
      
      {/* Suggestions Dropdown */}
      {open && filteredSuggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl shadow-orange-500/10 max-h-[320px] overflow-y-auto z-50"
        >
          <div className="py-2">
            {filteredSuggestions.map((item, index) => (
              <button
                key={`${item.category}-${item.name}-${index}`}
                onClick={() => handleSelect(item)}
                className={cn(
                  "w-full px-4 py-2.5 flex items-center gap-3 hover:bg-orange-50 transition-colors text-left",
                  highlightedIndex === index && "bg-orange-50"
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="shrink-0">
                  {getIcon(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Use ↑↓ to navigate • Enter to select • Esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
