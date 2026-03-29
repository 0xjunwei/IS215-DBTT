"use client"

import { X, Volume2, Copy, BookmarkPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TranscriptLine {
  timestamp: string
  original: string
  translation: string
}

interface MobileTranscriptSheetProps {
  isOpen: boolean
  onClose: () => void
  transcript: TranscriptLine[]
  language: "bahasa" | "chinese"
  activeLineIndex: number | null
  onLineClick: (index: number) => void
}

export function MobileTranscriptSheet({ 
  isOpen, 
  onClose, 
  transcript, 
  language, 
  activeLineIndex, 
  onLineClick 
}: MobileTranscriptSheetProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop - reduced opacity */}
      <div 
        className="absolute inset-0 bg-background/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 flex max-h-[70vh] flex-col rounded-t-3xl bg-card shadow-xl animate-in slide-in-from-bottom">
        {/* Handle */}
        <div className="flex shrink-0 justify-center py-3">
          <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{language === "bahasa" ? "\u{1F1EE}\u{1F1E9}" : "\u{1F1E8}\u{1F1F3}"}</span>
            <h2 className="font-bold text-foreground">Transcript</h2>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Transcript Content - scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="flex flex-col gap-3">
            {transcript.map((line, index) => (
              <button 
                key={index}
                onClick={() => onLineClick(index)}
                className={cn(
                  "group rounded-xl p-3 text-left transition-colors",
                  activeLineIndex === index
                    ? "bg-primary/10 ring-2 ring-primary/30" 
                    : "hover:bg-muted active:bg-muted"
                )}
              >
                {/* Timestamp */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {line.timestamp}
                  </span>
                  <div className="flex items-center gap-1">
                    <span 
                      className="rounded-md p-1.5 hover:bg-secondary active:bg-secondary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <span 
                      className="rounded-md p-1.5 hover:bg-secondary active:bg-secondary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <span 
                      className="rounded-md p-1.5 hover:bg-secondary active:bg-secondary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BookmarkPlus className="h-4 w-4 text-muted-foreground" />
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

        {/* Footer - fixed at bottom with safe area padding */}
        <div className="shrink-0 border-t border-border bg-card p-4 pb-6">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80">
            <BookmarkPlus className="h-4 w-4" />
            Save to Vocabulary
          </button>
        </div>
      </div>
    </div>
  )
}
