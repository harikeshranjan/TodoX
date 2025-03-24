"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure the theme is loaded before rendering
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getThemeLabel = () => {
    if (!mounted) return "..." // Prevent flickering
    if (resolvedTheme === "light") return "Light"
    if (resolvedTheme === "dark") return "Dark"
    return "System"
  }

  if (!mounted) return null // Prevent hydration mismatch error

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-full flex items-center gap-2 px-3">
          {resolvedTheme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {resolvedTheme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {resolvedTheme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
          <span>{getThemeLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-5 w-5 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-5 w-5 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-5 w-5 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
