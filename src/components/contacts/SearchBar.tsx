import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search contacts...' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
