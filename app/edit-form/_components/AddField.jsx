"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PlusCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'select', label: 'Select' },
]

export default function AddField({ onAddField }) {
  const [fieldType, setFieldType] = useState('text')
  const [formLabel, setFormLabel] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [options, setOptions] = useState('')
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleAddField = () => {
    const newField = {
      fieldType,
      formLabel,
      placeholder,
      formName: formLabel.toLowerCase().replace(/\s+/g, '_'),
    }

    if (['checkbox', 'radio', 'select'].includes(fieldType)) {
      const optionsArray = options.split(',').map(option => ({ label: option.trim() }))
      if (fieldType === 'checkbox') newField.checkboxOptions = optionsArray
      if (fieldType === 'radio') newField.radioOptions = optionsArray
      if (fieldType === 'select') newField.selectOptions = optionsArray
    }

    onAddField(newField)
    setFieldType('text')
    setFormLabel('')
    setPlaceholder('')
    setOptions('')
    setOpen(false)
    toast({
      title: "Field Added",
      description: `New ${fieldType} field has been added successfully.`,
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className='btn btn-primary' variant="outline"><PlusCircle className="mr-2 h-4 w-4 " /> Add Field</button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Field</h4>
            <p className="text-sm text-muted-foreground">
              Configure the new field you want to add.
            </p>
          </div>
          <div className="grid gap-2">
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Field Label"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
            />
            {fieldType === 'text' && (
              <Input
                placeholder="Placeholder"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            )}
            {['checkbox', 'radio', 'select'].includes(fieldType) && (
              <Input
                placeholder="Options (comma-separated)"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            )}
            <button className='btn btn-primary' onClick={handleAddField}>Add Field</button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
