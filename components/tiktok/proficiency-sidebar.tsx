"use client"

import { cn } from "@/lib/utils"
import { Flame, Star, Trophy, Target, Zap } from "lucide-react"

interface ProficiencySidebarProps {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  xp: number
  streak: number
}

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500",
  A2: "bg-emerald-400",
  B1: "bg-amber-500",
  B2: "bg-amber-400",
  C1: "bg-sky-500",
  C2: "bg-violet-500",
}

const levelDescriptions: Record<string, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper Int.",
  C1: "Advanced",
  C2: "Mastery",
}

export function ProficiencySidebar({ level, xp, streak }: ProficiencySidebarProps) {
  return (
    <aside className="flex w-20 flex-col items-center gap-4 border-r border-border bg-card py-6">
      {/* Level Badge */}
      <div className="flex flex-col items-center gap-1">
        <div 
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg",
            levelColors[level]
          )}
        >
          {level}
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">
          {levelDescriptions[level]}
        </span>
      </div>

      <div className="h-px w-12 bg-border" />

      {/* Stats */}
      <div className="flex flex-col items-center gap-4">
        {/* XP */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-300/35">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-xs font-bold text-foreground">{xp}</span>
          <span className="text-[9px] text-muted-foreground">XP</span>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 ring-1 ring-orange-300/35">
            <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
          </div>
          <span className="text-xs font-bold text-foreground">{streak}</span>
          <span className="text-[9px] text-muted-foreground">Streak</span>
        </div>

        {/* Goals */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-300/35">
            <Target className="h-5 w-5 text-sky-500" />
          </div>
          <span className="text-xs font-bold text-foreground">3/5</span>
          <span className="text-[9px] text-muted-foreground">Goals</span>
        </div>

        {/* Achievements */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 ring-1 ring-violet-300/35">
            <Trophy className="h-5 w-5 text-violet-500" />
          </div>
          <span className="text-xs font-bold text-foreground">12</span>
          <span className="text-[9px] text-muted-foreground">Badges</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <span className="text-[9px] font-medium text-primary">Boost</span>
      </div>
    </aside>
  )
}
