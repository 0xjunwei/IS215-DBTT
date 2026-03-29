"use client"

import { Volume2, Copy, BookmarkPlus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TranscriptLine {
  timestamp: string
  original: string
  translation: string
}

interface TranscriptPanelProps {
  transcript: TranscriptLine[]
  language: "bahasa" | "chinese"
  activeLineIndex: number | null
  onLineClick: (index: number) => void
}

export function TranscriptPanel({ transcript, language, activeLineIndex, onLineClick }: TranscriptPanelProps) {
  return (
    <aside className="flex w-80 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{language === "bahasa" ? "🇮🇩" : "🇨🇳"}</span>
          <h2 className="font-bold text-foreground">Transcript</h2>
        </div>
        <button className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">
          <span>EN</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <div className="flex flex-col gap-4">
          {transcript.map((line, index) => (
            <button 
              key={index}
              onClick={() => onLineClick(index)}
              className={cn(
                "group rounded-xl p-3 text-left transition-colors",
                activeLineIndex === index
                  ? "bg-primary/10 ring-2 ring-primary/30" 
                  : "hover:bg-muted"
              )}
            >
              {/* Timestamp */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {line.timestamp}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <span 
                    className="rounded-md p-1 hover:bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <span 
                    className="rounded-md p-1 hover:bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <span 
                    className="rounded-md p-1 hover:bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BookmarkPlus className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </div>
              </div>

              {/* Original Text */}
              <p className={cn(
                "text-sm font-medium leading-relaxed",
                activeLineIndex === index ? "text-primary" : "text-foreground"
              )}>
                {line.original}
              </p>

              {/* Translation */}
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {line.translation}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
            <BookmarkPlus className="h-4 w-4" />
            Save to Vocabulary
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Tap any line to highlight it
        </p>
      </div>
    </aside>
  )
}
