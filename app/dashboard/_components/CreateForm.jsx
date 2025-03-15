"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { chatSession } from "@/configs/AiModal"
import { useUser } from '@clerk/nextjs'
import { JsonForms } from '@/configs/schema'
import moment from 'moment'
import { db } from '@/configs'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
import dynamic from "next/dynamic";


const PROMPT = ", On the basis of Description, Generate a JSON structure for a form based on the user's given prompt. The JSON should include all necessary input types such as text, select (selectOptions with label and value) (have placeholder), checkbox, and radio. Each field should have properties like label, name, type, options (if applicable), required, and placeholder. The JSON should be structured in an array format with multiple fields. Provide a well-formatted output. formTitle, formSubheading, fieldType, formLabel, formName, placeholder, select, selectOptions, radio, radioOptions with (label), checkbox, checkboxOptions with (label), use these keywords for naming. Use checkbox for selecting multiple options."

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState();
    const { user } = useUser();
    const route = useRouter();

    const onCreateForm = async () => {

        setLoading(true)
        const result = await chatSession.sendMessage("Description:" + userInput + PROMPT);
        console.log(result.response.text());
        if (result.response.text()) {
            const resp = await db.insert(JsonForms)
                .values({
                    jsonform: result.response.text(),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('YYYY/MM/DD')
                }).returning({ id: JsonForms.id });
            console.log("New Form ID", resp[0].id);
            if (resp[0].id) {
                route.push('/edit-form/' + resp[0].id)
            }
            setLoading(false);
        }
        setLoading(false);
    }
    return (
        <div>
        {/* Desktop Button (Visible on screens ≥640px, Hidden on smaller screens) */}
        <div className='w-60 hidden sm:block'>
            <button
                onClick={() => setOpenDialog(true)}
                className="overflow-hidden relative w-full p-2 h-11 bg-primary text-white border-none rounded-md text-xl font-bold cursor-pointer z-10 group">
                <Plus className="h-4 w-4 inline-block mr-2" />
                <span className="absolute w-full h-32 -top-12 -left-0 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left rounded-md"></span>
                <span className="absolute w-full h-32 -top-12 -left-0 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left rounded-md"></span>
                <span className="absolute w-full h-32 -top-12 -left-0 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left rounded-md"></span>
                <span className="items-center group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2 left-7 z-10"> + Create Form  </span>
            </button>
        </div>

        {/* Mobile Button (Visible on screens <640px, Hidden on larger screens) */}
        <div className="w-full flex justify-center sm:hidden">
            <button
                onClick={() => setOpenDialog(true)}
                className="relative flex items-center gap-2 px-2 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-normal rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95">
                <Plus className="h-4 w-4" />
                Create Form
                <span className="absolute inset-0 bg-white opacity-0 rounded-full transition-opacity duration-300 hover:opacity-10"></span>
            </button>
        </div>

        {/* Dialog Component */}
        <Dialog open={openDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Form</DialogTitle>
                    <DialogDescription asChild>
                        <span>
                            <Textarea
                                className="my-2"
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder="Write description of your form"
                            />
                            <div className="flex gap-2 my-3 justify-end">
                                <Button onClick={() => setOpenDialog(false)} variant="destructive">
                                    Cancel
                                </Button>
                                <Button disabled={loading} onClick={() => onCreateForm()}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Create"}
                                </Button>
                            </div>
                        </span>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
);
}

export default dynamic(() => Promise.resolve(CreateForm), { ssr: false })
