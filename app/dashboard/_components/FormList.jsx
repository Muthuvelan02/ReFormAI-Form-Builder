"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormListItem from "./FormListItem";
import dynamic from "next/dynamic";


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
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-5">
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
    );
}

export default dynamic (() => Promise.resolve(FormList), {ssr: false})
