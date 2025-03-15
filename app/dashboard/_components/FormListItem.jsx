"use client"
import { Button } from '@/components/ui/button'
import { Edit2, Share, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
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
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { and, eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { RWebShare } from 'react-web-share'
import dynamic from "next/dynamic";

function FormListItem({ formRecord, jsonForm, refreshData }) {
    const { user } = useUser();
    
    const onDeleteForm = async () => {
        const result = await db.delete(JsonForms)
            .where(and(eq(JsonForms.id, formRecord.id),
                eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)));

        if (result) {
            toast('Form Deleted!');
            refreshData();
        }
    };

    return (
        <div className='bg-white border shadow-sm rounded-lg p-3 sm:p-4'>
        {/* Form Title & Delete Button */}
        <div className='bg-white flex justify-between items-center'>
            <h2 className='text-xs sm:text-base font-semibold'>{jsonForm?.formTitle}</h2>

            {/* Delete Button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Trash2 className='h-4 w-4 sm:h-6 sm:w-6 text-red-600 cursor-pointer hover:scale-105 transition-all' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xs sm:text-lg">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-base">
                            This action cannot be undone. This will permanently delete your form
                            and remove the data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs sm:text-sm">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="text-xs sm:text-sm" onClick={() => onDeleteForm()}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        {/* Form Subheading */}
        <h2 className='text-xs sm:text-sm text-gray-500'>{jsonForm?.formSubheading}</h2>
        <hr className='my-2 sm:my-4' />

        {/* Buttons (Stacked on Mobile, Inline on Desktop) */}
        <div className='flex flex-col  justify-between sm:flex-row gap-2 sm:gap-4'>
            {/* Share Button */}
            <RWebShare
                data={{
                    text: jsonForm?.formSubheading + " , Make forms in seconds with AI.",
                    url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + formRecord?.id,
                    title: jsonForm?.formTitle,
                }}
                onClick={() => console.log("shared successfully!")}
            >
                <Button variant="outline" size="sm" className='flex items-center gap-2 text-xs sm:text-base w-full sm:w-auto'>
                    <Share className='h-4 w-4 sm:h-6 sm:w-6' /> Share
                </Button>
            </RWebShare>

            {/* Edit Button */}
            <Link href={'/edit-form/' + formRecord?.id} className="w-full sm:w-auto">
                <Button className='flex items-center gap-2 text-xs sm:text-base w-full sm:w-auto' size="sm">
                    <Edit2 className='h-4 w-4 sm:h-6 sm:w-6' /> Edit
                </Button>
            </Link>
        </div>
    </div>
    );
}

export default dynamic(() => Promise.resolve(FormListItem), { ssr: false });
