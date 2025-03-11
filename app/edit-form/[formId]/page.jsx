"use client"
import { db } from "@/configs"
import { useUser } from "@clerk/nextjs"
import { JsonForms } from "@/configs/schema"
import { and, eq } from "drizzle-orm"
import React, { useEffect, useState, useCallback } from "react"
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import FormUI from "@/app/edit-form/_components/FormUI"
import { Button } from "@/components/ui/button"
import Controller from "@/app/edit-form/_components/Controller"
import Link from "next/link"
import { RWebShare } from "react-web-share"
import { PuffLoader } from "react-spinners"

function EditForm({ params }) {
  const { user } = useUser()
  const [jsonForm, setJsonForm] = useState(null)
  const [record, setRecord] = useState(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedBackground, setSelectedBackground] = useState();

  // Properly unwrap the params promise
  const resolvedParams = React.use(params)
  const formId = resolvedParams.formId

  useEffect(() => {
    if (user) {
      GetFormData()
    }
  }, [user, formId])

  useEffect(() => {
    if (jsonForm) {
      console.log("Form updated:", jsonForm)
    }
  }, [jsonForm, updateTrigger])

  const GetFormData = async () => {
    try {
      setLoading(true)

      if (!formId) {
        throw new Error("Missing form ID")
      }

      if (!user?.primaryEmailAddress?.emailAddress) {
        throw new Error("User not authenticated")
      }

      const result = await db
        .select()
        .from(JsonForms)
        .where(and(eq(JsonForms.id, Number(formId)), eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress)))

      if (!result?.length) {
        throw new Error("Form not found")
      }

      setRecord(result[0]) // Set the entire record

      // Clean and parse JSON
      const rawData = result[0].jsonform
      const cleanedJson = rawData
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      const parsedData = JSON.parse(cleanedJson)
      setJsonForm(parsedData)

      setSelectedBackground(result[0].background)
      setSelectedTheme(result[0].theme)

      console.log("Form Data:", parsedData)
    } catch (error) {
      console.error("Error:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const onFieldUpdate = useCallback((value, index) => {
    setJsonForm((prevForm) => {
      if (!prevForm || !prevForm.fields) return prevForm

      const updatedFields = [...prevForm.fields]
      updatedFields[index] = {
        ...updatedFields[index],
        formLabel: value.label,
        placeholder: value.placeholder,
      }

      return { ...prevForm, fields: updatedFields }
    })
    setUpdateTrigger((prev) => prev + 1)

  }, [])


  const updateJsonFormInDb = async () => {
    try {
      if (!record || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("Missing record or user email")

      }


      const result = await db
        .update(JsonForms)
        .set({
          jsonform: JSON.stringify(jsonForm), // Stringify the jsonForm object
        })
        .where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress)))

      console.log("Update result:", result)
      toast('Form Updated!')
    } catch (error) {
      console.error("Error updating form:", error)


    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PuffLoader size={60} color={"#123abc"} loading={loading} />
      </div>
    )
  }

  const deleteField = (indexToRemove) => {
    const result = jsonForm.fields.filter((item, index) => index != indexToRemove)
    jsonForm.fields = result;
    setUpdateTrigger(Date.now())

  }

  const updateControllerFields = async (value, columnName) => {
    const result = await db.update(JsonForms).set({
      [columnName]: value
    }).where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress)))

  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-5">
        <button className="btn btn-primary flex gap-2 items-center cursor-pointer hover:font-bold" onClick={() => router.back()}>
          <ArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <Link href={'/aiform/' + record?.id} target="_blank">
            <Button className="flex gap-2">
              <SquareArrowOutUpRight className="h-5 w-5" /> Live Preview
            </Button>
          </Link>
          <RWebShare
            data={{
              text: jsonForm?.formSubheading + " , Make forms in seconds with AI.",
              url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
              title: jsonForm?.formTitle,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <Button className='flex gap-2 bg-green-600 hover:bg-green-700'><Share2 className="h-5 w-5" />Share</Button>
          </RWebShare>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value) => {
              updateControllerFields(value, 'theme')
              setSelectedTheme(value)
            }}
            selectedBackground={(value) => {
              updateControllerFields(value, 'background')
              setSelectedBackground(value)
            }}
          />
        </div>

        <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center'
          style={{
            backgroundImage: selectedBackground
          }}>
          {jsonForm && <FormUI jsonForm={jsonForm}
            selectedTheme={selectedTheme}
            onFieldUpdate={onFieldUpdate}
            deleteField={(index) => deleteField(index)}
            formId={record.id} />}
        </div>
      </div>
    </div>
  )
}

export default EditForm 