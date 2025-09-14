"use client";

import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import { JsonForms, userResponses } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const exportToPDF = (organizedData, formTitle) => {
        if (organizedData.length === 0) {
            console.warn("No data to export.");
            return;
        }

        try {
            const pdf = new jsPDF('l', 'pt', 'a4'); // Use landscape orientation for better table fit
            
            // Add title
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(formTitle || "Form Responses", 40, 40);
            
            // Add date
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const currentDate = new Date().toLocaleDateString();
            pdf.text(`Generated on: ${currentDate}`, 40, 60);
            
            // Prepare data for table
            if (organizedData.length > 0) {
                const headers = Object.keys(organizedData[0]);
                const rows = organizedData.map(item => 
                    headers.map(header => {
                        const value = item[header];
                        
                        // Handle different data types properly
                        if (Array.isArray(value)) {
                            // For checkbox arrays, join with commas
                            return value.join(', ');
                        } else if (typeof value === 'object' && value !== null) {
                            // For objects, convert to JSON string or extract meaningful info
                            return JSON.stringify(value);
                        } else if (typeof value === 'string' && value.length > 50) {
                            // Handle long text by truncating if necessary
                            return value.substring(0, 50) + '...';
                        } else {
                            // Handle primitives (string, number, boolean, null, undefined)
                            return value || '';
                        }
                    })
                );
                
                // Calculate column widths based on content
                const pageWidth = pdf.internal.pageSize.width;
                const marginLeft = 40;
                const marginRight = 40;
                const tableWidth = pageWidth - marginLeft - marginRight;
                const columnWidth = tableWidth / headers.length;
                
                // Use autoTable with improved formatting
                autoTable(pdf, {
                    head: [headers],
                    body: rows,
                    startY: 80,
                    margin: { left: marginLeft, right: marginRight },
                    styles: { 
                        fontSize: 8,
                        cellPadding: 4,
                        overflow: 'linebreak',
                        halign: 'left',
                        valign: 'middle',
                        lineColor: [200, 200, 200],
                        lineWidth: 0.5
                    },
                    headStyles: { 
                        fillColor: [66, 139, 202],
                        textColor: [255, 255, 255],
                        fontSize: 9,
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    columnStyles: {
                        // Set minimum column width
                        ...headers.reduce((acc, header, index) => {
                            acc[index] = { 
                                cellWidth: Math.max(columnWidth, 60),
                                overflow: 'linebreak'
                            };
                            return acc;
                        }, {})
                    },
                    tableWidth: 'auto',
                    theme: 'striped'
                });
            }
            
            pdf.save(`${formTitle || "Exported_Data"}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const ExportToPDF = async (formId, formTitle) => {
        setExportLoading(prevState => ({ ...prevState, [`${formId}_pdf`]: true }));
        try {
            const result = await db.select().from(userResponses)
                .where(eq(userResponses.formRef, formId));

            const organizedData = result.map(response => JSON.parse(response.jsonResponse));
            exportToPDF(organizedData, formTitle);
        } catch (error) {
            console.error("Error fetching responses for PDF:", error);
        } finally {
            setExportLoading(prevState => ({ ...prevState, [`${formId}_pdf`]: false }));
        }
    };

    return (
        <div className='p-12 md:p-10'>
            <h2 className='font-bold text-lg md:text-3xl mb-4 md:mb-5'>Responses</h2>

            {loading ? (
                <p className="text-sm">Loading responses...</p>
            ) : formList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {formList.map((form, index) => {
                        let parsedForm = {};
                        try {
                            parsedForm = JSON.parse(form.jsonform?.replace(/```json\n|\n```/g, '') || '{}');
                        } catch (error) {
                            console.error("Error parsing form JSON:", error);
                        }

                        return (
                            <div key={index} className='border shadow-sm rounded-lg p-3 md:p-4'>
                                <h2 className='text-sm md:text-lg text-black'>{parsedForm.formTitle || "Untitled Form"}</h2>
                                <h2 className='text-xs md:text-sm text-gray-500'>{parsedForm.formSubheading || "No subheading available"}</h2>
                                <hr className='my-3 md:my-4' />

                                <div className='flex justify-between items-center'>
                                    <div className='w-full space-y-3'>
                                        <div className='flex items-center justify-between w-full'>
                                            <h2 className='text-xs md:text-sm'>Export to <strong>Excel</strong></h2>
                                            <Button className="text-xs px-2 py-1 md:text-sm md:px-3 md:py-2"
                                                onClick={() => ExportData(form.id, parsedForm.formTitle)}
                                                disabled={exportLoading[form.id]}
                                            >
                                                {exportLoading[form.id] ? <Loader2 className='animate-spin' /> : 'Export Excel'}
                                            </Button>
                                        </div>
                                        <div className='flex items-center justify-between w-full'>
                                            <h2 className='text-xs md:text-sm'>Export to <strong>PDF</strong></h2>
                                            <Button className="text-xs bg-red-400 px-2 py-1 md:text-sm md:px-3 md:py-2"
                                                onClick={() => ExportToPDF(form.id, parsedForm.formTitle)}
                                                disabled={exportLoading[`${form.id}_pdf`]}
                                                variant="outline"
                                            >
                                                {exportLoading[`${form.id}_pdf`] ? <Loader2 className='animate-spin' /> : 'Export PDF'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="relative">
                        {/* Animated background shapes */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full animate-bounce"></div>
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-full animate-pulse delay-500"></div>
                        
                        {/* Main icon */}
                        <div className="relative z-10 w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="text-center mt-6 max-w-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Forms Available</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            You haven't created any forms yet. Create your first form to start collecting responses and see them here.
                        </p>
                        
                        {/* Steps */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
                            <h4 className="font-semibold text-gray-800 mb-3">Getting Started:</h4>
                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    Go to Dashboard
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    Click "Create Form"
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                    Share your form to collect responses
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                            📊 Once you have forms with responses, you'll be able to export them as Excel or PDF files
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Responses;
