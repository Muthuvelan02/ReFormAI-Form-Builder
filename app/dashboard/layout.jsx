"use client";
import { SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import SideNav from "./_components/SideNav";
import dynamic from "next/dynamic";


function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);


  return (
    <SignedIn>
      <div>
        <div className="md:w-64 fixed">
          <SideNav />
        </div>
        <div className="md:ml-64">{children}</div>
      </div>
    </SignedIn>
  );
}

export default dynamic (() => Promise.resolve(DashboardLayout), {ssr: false})
