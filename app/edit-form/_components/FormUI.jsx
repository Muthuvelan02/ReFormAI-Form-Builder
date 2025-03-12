"use client"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"
import FieldEdit from "@/app/edit-form/_components/FieldEdit"
import AddField from "@/app/edit-form/_components/AddField"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster } from "@/components/ui/toaster"
import { db } from "@/configs"
import { userResponses } from "@/configs/schema"
import moment from "moment"
import { toast } from "sonner"

function FormUI({ jsonForm: initialJsonForm, selectedTheme, onFieldUpdate, deleteField, editable = true, formId = 0 }) {
  const [jsonForm, setJsonForm] = useState(initialJsonForm)

  const handleAddField = (newField) => {
    setJsonForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
    }))
  }

  const handleFieldUpdate = (value, index) => {
    const updatedFields = [...jsonForm.fields]
    updatedFields[index] = { ...updatedFields[index], ...value }
    setJsonForm((prevForm) => ({
      ...prevForm,
      fields: updatedFields,
    }))
    onFieldUpdate(updatedFields)
  }

  const handleDeleteField = (index) => {
    const updatedFields = jsonForm.fields.filter((_, i) => i !== index)
    setJsonForm((prevForm) => ({
      ...prevForm,
      fields: updatedFields,
    }))
    deleteField(index)
  }

  const [formData, setFormData] = useState()
  let formRef = useRef(null)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (fieldName, itemName, value) => {
    const list = formData?.[fieldName] ? formData?.[fieldName] : []

    if (value) {
      list.push({
        label: itemName,
        value: value,
      })
      setFormData({
        ...formData,
        [fieldName]: list,
      })
    } else {
      const result = list.filter((item) => item.label == itemName)
      setFormData({
        ...formData,
        [fieldName]: result,
      })
    }
  }

  const onFormSubmit = async (event) => {
    event.preventDefault()
    console.log(formData);

    const result=await db.insert(userResponses)
    .values({
      jsonResponse:formData,
      createdAt:moment().format('DD/MM/yyyy'),
      formRef:formId
    })

    if(result)
    {
      formRef.reset();
      toast('Response Submitted!')
    }
    else
    {
      toast('Error while saving response!')
    }
  }

  const RequiredIndicator = () => <span className="text-red-500 ml-1">*</span>

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className="border p-5 md:w-[600px] rounded-lg "
      data-theme={selectedTheme}
    >
      <h2 className="font-bold text-center text-2xl  text-primary">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-400 text-center ">{jsonForm?.formSubheading}</h2>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          {field.fieldType === "select" ? (
            <div className="my-3 w-full ">
              <label className="text-sm text-gray-400">
                {field.formLabel}
                {field.required && <RequiredIndicator />}
              </label>
              <Select required={field?.required} onValueChange={(v) => handleSelectChange(field.formName, v)}>
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.selectOptions?.map((item, index) => (
                    <SelectItem key={index} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.fieldType === "radio" ? (
            <div className="w-full my-3">
              <label className="text-sm text-gray-400">
                {field.formLabel}
                {field.required && <RequiredIndicator />}
              </label>
              <RadioGroup required={field?.required}>
                {field.radioOptions?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={item.label}
                      id={item.label}
                      onClick={() => handleSelectChange(field.formName, item.label)}
                    />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.fieldType === "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-sm text-gray-400">
                {field?.formLabel}
                {field.required && <RequiredIndicator />}
              </label>
              {field?.checkboxOptions?.map((item, index) => (
                <div key={index} className="mt-1 flex gap-2">
                  <Checkbox
                    onCheckedChange={(v) => handleCheckboxChange(field?.formLabel, item.label, v)}
                    id={`${field.formName}-${index}`}
                  />
                  <Label htmlFor={`${field.formName}-${index}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          ) : (
            <div className="my-3 w-full ">
              <label className="text-sm text-gray-400">
                {field.formLabel}
                {field.required && <RequiredIndicator />}
              </label>
              <Input
                className="bg-transparent"
                type={field?.fieldType}
                placeholder={field.placeholder}
                name={field.formName}
                required={field?.required}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => handleFieldUpdate(value, index)}
                deleteField={() => handleDeleteField(index)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="mt-4">
        <AddField onAddField={handleAddField} />
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
      <Toaster />
    </form>
  )
}

export default FormUI

