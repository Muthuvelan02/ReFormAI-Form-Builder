"use client"
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Themes from "@/app/_data/Themes"
import GradientBg from "@/app/_data/GradientBg"
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

function Controller({ selectedTheme, selectedBackground }) {
  const [showMore, setShowMore] = useState(9)
  const [activeTheme, setActiveTheme] = useState("default") 
  const [activeBackground, setActiveBackground] = useState("default");

  function generateRandomTheme() {
    const randomIndex = Math.floor(Math.random() * Themes.length)
    const randomTheme = Themes[randomIndex].theme
    setActiveTheme(randomTheme) // Fixed function call
    selectedTheme(randomTheme) // Update the selected theme
  }

  function generateRandomBackground() {
    const randomIndex = Math.floor(Math.random() * GradientBg.length)
    const randomBackground = GradientBg[randomIndex].gradient
    setActiveBackground(randomBackground) // Update active background
    selectedBackground(randomBackground) // Update the selected background
  }

  return (
    <div className=' bg-white rounded-lg'>
      {/* Theme Selection Controller */}
      <h2 className='my-2 text-lg font-semibold text-gray-700'>Themes</h2>
      <Select onValueChange={(value) => { 
        selectedTheme(value);
        setActiveTheme(value);
      }}>
        <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Select a Theme" />
        </SelectTrigger>
        <SelectContent className="border-gray-200 shadow-md rounded-md">
          {Themes.map((theme) => (
            <SelectItem value={theme.theme} key={theme.theme}>
              <div className='flex items-center gap-3 p-2 rounded-md transition-all 
                hover:bg-gray-100 hover:shadow-sm cursor-pointer'
              >
                <div className='flex border rounded-md overflow-hidden'>
                  <div className='h-6 w-6' style={{ backgroundColor: theme.primary }}></div>
                  <div className='h-6 w-6' style={{ backgroundColor: theme.secondary }}></div>
                  <div className='h-6 w-6' style={{ backgroundColor: theme.accent }}></div>
                  <div className='h-6 w-6' style={{ backgroundColor: theme.neutral }}></div>
                </div>
                <span className="flex-1">{theme.theme}</span>
                {activeTheme === theme.theme && <CheckCircle className="text-green-500" size={16} />}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Background Selection Controller */}
      <h2 className='mt-3 mb-2 text-lg font-semibold text-gray-700'>Background</h2>
      <div className='grid grid-cols-3 gap-4'>
        {GradientBg.map((bg, index) => (index < showMore) && (
          <div
            key={index}
            onClick={() => {
              selectedBackground(bg.gradient);
              setActiveBackground(bg.gradient);
            }}
            className={`w-full h-[75px] rounded-lg cursor-pointer border border-gray-200 shadow-sm transition-all 
              flex items-center justify-center hover:shadow-md hover:border-gray-400 
              ${activeBackground === bg.gradient ? 'border-2 border-primary' : ''}`}
            style={{ background: bg.gradient }}>
            {index === 0 && <span className="text-gray-600 font-medium">None</span>}
          </div>
        ))}
      </div>

      {/* Show More / Less Button */}
      <Button variant="outline" size="sm"
        className='w-full mt-2'
        onClick={() => setShowMore(showMore > 9 ? 9 : 50)}
      >
        {showMore > 9 ? 'Show Less' : 'Show More'}
      </Button>

      {/* Buttons for Generating Random Theme & Background */}
      <div className="mt-4 space-y-2">
      <Button 
    className="w-full py-2 text-white font-semibold rounded-lg transition-all 
               bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md 
               hover:from-indigo-600 hover:to-purple-500 hover:shadow-lg 
               "
    onClick={generateRandomTheme}
  >
    Generate Random Theme
  </Button>
  <Button 
    className="w-full py-2 text-white font-semibold rounded-lg transition-all 
               bg-gradient-to-r from-green-500 to-teal-600 shadow-md 
               hover:from-teal-600 hover:to-cyan-500 hover:shadow-lg 
               "
    onClick={generateRandomBackground}
  >
     Generate Random Background
  </Button>
      </div>
    </div>
  )
}

export default Controller
