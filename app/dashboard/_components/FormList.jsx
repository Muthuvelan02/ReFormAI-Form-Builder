"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";
import dynamic from "next/dynamic";
import CreateForm from "./CreateForm";


function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFormList();
        }
    }, [user]);

    const GetFormList = async () => {
        try {
            const result = await db
                .select()
                .from(JsonForms)
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JsonForms.id));

            setFormList(result);
            console.log("Fetched Form List:", result);
        } catch (error) {
            console.error("Error fetching form list:", error);
        }
    };

    return (
        <div className="mt-5">
            {formList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {formList.map((form, index) => {
                        let parsedJson = {};
                        try {
                            let jsonString = form.jsonform;

                            // Remove Markdown-like formatting (backticks)
                            jsonString = jsonString.replace(/```json|```/g, "").trim();

                            // Extract only valid JSON content
                            const startIndex = jsonString.indexOf("{");
                            const endIndex = jsonString.lastIndexOf("}");
                            if (startIndex !== -1 && endIndex !== -1) {
                                jsonString = jsonString.substring(startIndex, endIndex + 1);
                            }

                            parsedJson = JSON.parse(jsonString); // Safely parse JSON
                        } catch (error) {
                            console.error("Invalid JSON format in form.jsonform:", form.jsonform, error);
                        }

                        return (
                            <div key={index}>
                                <FormListItem 
                                    jsonForm={parsedJson}
                                    formRecord={form}
                                    refreshData={GetFormList} 
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="relative">
                        {/* Animated background circles */}
                        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full animate-pulse delay-300"></div>
                        
                        {/* Main icon */}
                        <div className="relative z-10 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="text-center mt-8 max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Forms Yet</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Get started by creating your first form. Build beautiful, intelligent forms powered by AI in just a few clicks.
                        </p>
                        
                        {/* Feature highlights */}
                        <div className="flex justify-center gap-6 mb-8">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                AI-Powered
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Easy to Use
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Customizable
                            </div>
                        </div>
                        
                        <div className="flex justify-center items-center">
                            <CreateForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default dynamic (() => Promise.resolve(FormList), {ssr: false})
