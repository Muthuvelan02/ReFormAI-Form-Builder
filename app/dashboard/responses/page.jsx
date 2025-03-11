"use client";

import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import { JsonForms, userResponses } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';  // Import XLSX  

function Responses({ jsonForm = {}, formRecord = {} }) {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState({});
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            getFormList();
        }
    }, [user]);

    const getFormList = async () => {
        setLoading(true);
        try {
            const result = await db.select().from(JsonForms)
                .where(eq(JsonForms.createdBy, user.primaryEmailAddress.emailAddress));

            console.log("Fetched Forms:", result);
            setFormList(result || []);
        } catch (error) {
            console.error("Error fetching forms:", error);
        } finally {
            setLoading(false);
        }
    };

    const ExportData = async (formId, formTitle) => {
        setExportLoading(prevState => ({ ...prevState, [formId]: true }));
        try {
            const result = await db.select().from(userResponses)
                .where(eq(userResponses.formRef, formId));

            const organizedData = result.map(response => JSON.parse(response.jsonResponse));
            setJsonData(prevData => [...prevData, ...organizedData]);

            console.log("Organized Responses:", organizedData);
            exportToExcel(organizedData, formTitle);
        } catch (error) {
            console.error("Error fetching responses:", error);
        } finally {
            setExportLoading(prevState => ({ ...prevState, [formId]: false }));
        }
    };

    const exportToExcel = (organizedData, formTitle) => {
        if (organizedData.length === 0) {
            console.warn("No data to export.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(organizedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, `${formTitle || "Exported_Data"}.xlsx`);
    };

    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl mb-5'>Responses</h2>

            {loading ? (
                <p>Loading responses...</p>
            ) : formList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formList.map((form, index) => {
                        let parsedForm = {};
                        try {
                            parsedForm = JSON.parse(form.jsonform?.replace(/```json\n|\n```/g, '') || '{}');
                        } catch (error) {
                            console.error("Error parsing form JSON:", error);
                        }

                        return (
                            <div key={index} className='border shadow-sm rounded-lg p-4'>
                                <h2 className='text-lg text-black'>{parsedForm.formTitle || "Untitled Form"}</h2>
                                <h2 className='text-sm text-gray-500'>{parsedForm.formSubheading || "No subheading available"}</h2>
                                <hr className='my-4' />

                                <div className='flex justify-between items-center'>
                                    <h2 className='text-sm'>Export Responses to <strong>Excel</strong></h2>
                                    <Button size='sm'
                                        onClick={() => ExportData(form.id, parsedForm.formTitle)}
                                        disabled={exportLoading[form.id]}
                                    >
                                        {exportLoading[form.id] ? <Loader2 className='animate-spin' /> : 'Export'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>No responses found.</p>
            )}
        </div>
    );
}

export default Responses;
