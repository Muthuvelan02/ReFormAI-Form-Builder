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
import { Checkbox } from '@/components/ui/checkbox'

function Controller({ selectedTheme, selectedBackground }) {
  const [showMore, setShowMore] = useState(6)
  const [activeTheme, setActiveTheme] = useState("light") // Default theme set to "light"
  const [activeBackground, setActiveBackground] = useState(null);

  return (
    <div className='p-4 bg-white shadow-lg rounded-lg'>
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
          {Themes.map((theme, index) => (
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
      <h2 className='mt-6 mb-2 text-lg font-semibold text-gray-700'>Background</h2>
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
      <Button variant="outline" size="sm"
        className='w-full mt-2'
        onClick={() => setShowMore(showMore > 6 ? 6 : 20)}
      >{showMore > 6 ? 'Show Less' : 'Show More'}</Button>
  
    </div>

  )
}

export default Controller
