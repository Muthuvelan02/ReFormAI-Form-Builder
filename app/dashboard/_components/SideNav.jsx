"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LibraryBig, LineChart, MessageSquare, Shield, Loader2, Plus, PlusCircle, PlusCircleIcon, FilePlus } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import dynamic from "next/dynamic";


function SideNav() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");  // Fixed: Added state for user input

  const menuList = [
    { id: 1, name: 'My Forms', icon: LibraryBig, path: '/dashboard' },
    { id: 2, name: 'Responses', icon: MessageSquare, path: '/dashboard/responses' },
    
  ];

  const path = usePathname();

  useEffect(() => {
    // console.log(path)
  }, [path]);

  // Fixed: Added placeholder function for form creation
  const onCreateForm = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("Form Created:", userInput);
      setLoading(false);
      setOpenDialog(false);
    }, 2000);
  };

  return (
    <div className='h-screen shadow-md borders'>
      <div className='p-5'>
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index} className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer transition text-gray-500
          ${path == menu.path && 'bg-primary text-white'}`}>
            <menu.icon className="font-bold" />
            {menu.name}
          </Link>
        ))}
      </div>

    </div>
  )
}

export default dynamic(() => Promise.resolve(SideNav), { ssr: false })
