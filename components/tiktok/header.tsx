"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, Flame, ChevronDown, Target, Award } from "lucide-react"

interface HeaderProps {
  activeLanguage: "bahasa" | "chinese"
  onLanguageChange: (lang: "bahasa" | "chinese") => void
  xp?: number
  streak?: number
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
}

const levelColors: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-green-100 text-green-700",
  B1: "bg-sky-100 text-sky-700",
  B2: "bg-blue-100 text-blue-700",
  C1: "bg-violet-100 text-violet-700",
  C2: "bg-amber-100 text-amber-700",
}

export function Header({ activeLanguage, onLanguageChange, xp = 0, streak = 0, level = "A1" }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      {/* Mobile: Proficiency Level (left side) */}
      <div className="flex items-center gap-2 md:hidden">
        <div className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
          levelColors[level]
        )}>
          <Target className="h-3.5 w-3.5" />
          {level}
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-20" />

      {/* Language Tabs */}
      <div className="flex items-center gap-1 rounded-full bg-muted p-1">
        <button 
          onClick={() => onLanguageChange("bahasa")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all md:gap-2 md:px-5 md:py-2 md:text-sm",
            activeLanguage === "bahasa" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-base md:text-lg">{"\u{1F1EE}\u{1F1E9}"}</span>
          <span className="hidden sm:inline">Bahasa</span>
        </button>
        <button 
          onClick={() => onLanguageChange("chinese")}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all md:gap-2 md:px-5 md:py-2 md:text-sm",
            activeLanguage === "chinese" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-base md:text-lg">{"\u{1F1E8}\u{1F1F3}"}</span>
          <span className="hidden sm:inline">Chinese</span>
        </button>
      </div>

      {/* Mobile: Dropdown for stats (right side) */}
      <div className="relative md:hidden">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5"
        >
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <ChevronDown className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            showDropdown && "rotate-180"
          )} />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)} 
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl bg-card p-3 shadow-lg ring-1 ring-border">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                    <span className="text-sm text-muted-foreground">XP</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{xp.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Streak</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Daily Goal</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">15 min</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-20" />
    </header>
  )
}
