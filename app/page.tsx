"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/tiktok/header"
import { VideoFeed, type VideoData } from "@/components/tiktok/video-feed"
import { ProficiencySidebar } from "@/components/tiktok/proficiency-sidebar"
import { TranscriptPanel } from "@/components/tiktok/transcript-panel"
import { MobileTranscriptSheet } from "@/components/tiktok/mobile-transcript-sheet"

// Fixed proficiency levels per language
const LANGUAGE_LEVELS: Record<"bahasa" | "chinese", "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
  bahasa: "A2",
  chinese: "B1",
}

export default function Home() {
  const [activeLanguage, setActiveLanguage] = useState<"bahasa" | "chinese">("bahasa")
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [xp, setXp] = useState(2450)
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null)
  const [showMobileTranscript, setShowMobileTranscript] = useState(false)

  const handleVideoChange = useCallback((video: VideoData) => {
    setCurrentVideo(video)
    setActiveLineIndex(null)
  }, [])

  const handleAllVideosWatched = useCallback(() => {
    setShowQuiz(true)
  }, [])

  const handleQuizComplete = useCallback((earnedXp: number) => {
    setXp(prev => prev + earnedXp)
    setShowQuiz(false)
  }, [])

  const handleLineClick = useCallback((index: number) => {
    setActiveLineIndex(index)
  }, [])

  return (
    <main className="flex h-screen flex-col bg-background">
      <Header 
        activeLanguage={activeLanguage} 
        onLanguageChange={setActiveLanguage}
        xp={xp}
        streak={7}
        level={LANGUAGE_LEVELS[activeLanguage]}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Proficiency (hidden on mobile) */}
        <div className="hidden md:block">
          <ProficiencySidebar 
            level={LANGUAGE_LEVELS[activeLanguage]}
            xp={xp}
            streak={7}
          />
        </div>

        {/* Main Video Feed */}
        <div className="flex-1 relative">
          <VideoFeed 
            language={activeLanguage}
            theme="food"
            onVideoChange={handleVideoChange}
            onAllVideosWatched={handleAllVideosWatched}
            showQuiz={showQuiz}
            onQuizComplete={handleQuizComplete}
            onShowTranscript={() => setShowMobileTranscript(true)}
          />
        </div>

        {/* Right Sidebar - Transcript (hidden on mobile) */}
        <div className="hidden lg:block">
          <TranscriptPanel 
            transcript={currentVideo?.transcript || []}
            language={activeLanguage}
            activeLineIndex={activeLineIndex}
            onLineClick={handleLineClick}
          />
        </div>
      </div>

      {/* Mobile Transcript Sheet */}
      <MobileTranscriptSheet
        isOpen={showMobileTranscript}
        onClose={() => setShowMobileTranscript(false)}
        transcript={currentVideo?.transcript || []}
        language={activeLanguage}
        activeLineIndex={activeLineIndex}
        onLineClick={handleLineClick}
      />
    </main>
  )
}
