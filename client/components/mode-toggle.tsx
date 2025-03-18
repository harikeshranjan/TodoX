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
import { useLanguage } from "@/hooks/use-language"
import { useHotkeys } from "react-hotkeys-hook"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { language } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  // Ensure the theme is loaded before rendering
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "light" ? "dark" : "light"
    setTheme(nextTheme)
  }

  useHotkeys("shift+t", () => toggleTheme())

  const getThemeLabel = () => {
    if (!mounted) return "..." // Prevent flickering
    if (resolvedTheme === "light") return language === "en" ? "Light" : "Açık"
    if (resolvedTheme === "dark") return language === "en" ? "Dark" : "Koyu"
    return language === "en" ? "System" : "Sistem"
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
          {language === "en" ? "Light" : "Açık"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-5 w-5 mr-2" />
          {language === "en" ? "Dark" : "Koyu"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-5 w-5 mr-2" />
          {language === "en" ? "System" : "Sistem"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
