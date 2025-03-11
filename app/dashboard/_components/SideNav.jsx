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
      <div className='fixed bottom-10 p-6 w-64'>
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
  )
}

export default dynamic(() => Promise.resolve(SideNav), { ssr: false })
