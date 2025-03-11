"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormUI from "@/app/edit-form/_components/FormUI";
import Image from "next/image";
import Link from "next/link";

function LiveAiForm() {
  const paramsPromise = useParams(); // useParams hook to get dynamic params
  const [formId, setFormId] = useState(null);
  const [record, setRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [loading, setLoading] = useState(true);  // Added loading state

  useEffect(() => {
    const fetchParams = async () => {
      const params = await paramsPromise;
      setFormId(Number(params?.formid)); // Safely set formId after params are available
    };

    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (formId !== null) {
      GetFormData(); // Fetch form data once formId is available
    }
  }, [formId]);

  const GetFormData = async () => {
    if (!formId) return; // Ensure formId is valid

    setLoading(true);  // Set loading state to true

    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, formId));

    // Handle JSON parse safely after removing markdown formatting (backticks)
    if (result && result[0] && result[0].jsonform) {
      try {
        // Remove markdown formatting or backticks (`) if present
        const cleanJson = result[0].jsonform.replace(/```json|```/g, '').trim();
        const parsedJsonForm = JSON.parse(cleanJson); // Safely parse JSON
        setJsonForm(parsedJsonForm); // Store the parsed JSON
      } catch (error) {
        console.error("Error parsing JSON form:", error);
        setJsonForm(null); // Handle parsing errors gracefully
      }
    }

    setRecord(result[0]); // Store the record
    setLoading(false);  // Set loading state to false
    console.log(result);
  };

  // Conditional rendering based on loading state
  if (loading) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="p-10 flex justify-center "
    style={{
        backgroundImage:record?.background
    }}>
      {/* Check if jsonForm is loaded and pass it to FormUI */}
      
        <FormUI
          jsonForm={jsonForm}
          onFieldUpdate={() => console.log("Field Updated")}
          deleteField={() => console.log("Field Deleted")}
          selectedTheme={record?.theme}
          editable={false}
          formId={record?.id}
        />
        <Link className='flex gap-2 items-center
        bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer'
        href={process.env.NEXT_PUBLIC_BASE_URL}
        >
            <Image alt='logo' src={'/logo.png'} width={26} height={26}/>
            Developed By Group-12 ACE
        </Link>
    
      
    </div>
  );
}

export default LiveAiForm;
