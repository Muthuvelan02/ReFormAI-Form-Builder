"use client"
import { Edit, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

function FieldEdit({ defaultValue, onUpdate, deleteField }) {
  const [formLabel, setLabel] = useState(defaultValue?.formLabel)
  const [placeholder, setPlaceholder] = useState(defaultValue?.placeholder)
  const [options, setOptions] = useState(
    defaultValue?.checkboxOptions?.map(o => o.label).join(', ') ||
    defaultValue?.radioOptions?.map(o => o.label).join(', ') ||
    defaultValue?.selectOptions?.map(o => o.label).join(', ') ||
    ''
  )
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleUpdate = () => {
    const updatedField = {
      formLabel,
      placeholder,
      formName: formLabel.toLowerCase().replace(/\s+/g, '_'),
    }

    if (['checkbox', 'radio', 'select'].includes(defaultValue.fieldType)) {
      const optionsArray = options.split(',').map(option => ({ label: option.trim() }))
      if (defaultValue.fieldType === 'checkbox') updatedField.checkboxOptions = optionsArray
      if (defaultValue.fieldType === 'radio') updatedField.radioOptions = optionsArray
      if (defaultValue.fieldType === 'select') updatedField.selectOptions = optionsArray
    }

    onUpdate(updatedField)
    setOpen(false)
    toast({
      title: "Field Updated",
      description: `The ${defaultValue.fieldType} field has been updated successfully.`,
    })
  }

  return (
    <div className='flex gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger><Edit className='h-5 w-5 text-gray-500 cursor-pointer hover:text-black transition'/></PopoverTrigger>
        <PopoverContent>
          <h2>Edit Fields</h2>
          <div>
            <label className='text-xs'>Label Name</label>
            <Input
              type="text"
              value={formLabel}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          {defaultValue.fieldType === 'text' && (
            <div>
              <label className='text-xs'>Placeholder Name</label>
              <Input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>
          )}
          {['checkbox', 'radio', 'select'].includes(defaultValue.fieldType) && (
            <div>
              <label className='text-xs'>Options (comma-separated)</label>
              <Input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            </div>
          )}
          <Button size="sm" className="mt-3" onClick={handleUpdate}>
            Update
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger>
          <Trash2 className='h-5 w-5 text-red-400 cursor-pointer hover:text-red-600 transition'/>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the entire field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              deleteField()
              toast({
                title: "Field Deleted",
                description: "The field has been deleted successfully.",
                variant: "destructive",
              })
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FieldEdit
