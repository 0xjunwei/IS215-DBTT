"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Bookmark, Share2, Play, Pause, Volume2, VolumeX, GraduationCap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface VideoData {
  id: string
  username: string
  displayName: string
  userAvatar: string
  description: string
  soundName: string
  likes: number
  comments: number
  bookmarks: number
  shares: number
  videoUrl: string
  isFollowing: boolean
  language: "bahasa" | "chinese"
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
}

interface VideoCardProps {
  video: VideoData
  isActive: boolean
}

const levelColors: Record<string, string> = {
  A1: "bg-emerald-500",
  A2: "bg-emerald-400",
  B1: "bg-amber-500",
  B2: "bg-amber-400",
  C1: "bg-sky-500",
  C2: "bg-violet-500",
}

export function VideoCard({ video, isActive }: VideoCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showPlayPause, setShowPlayPause] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
      setShowPlayPause(true)
      setTimeout(() => setShowPlayPause(false), 800)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="relative h-full w-full snap-start snap-always bg-muted">
      {/* Video Background */}
      <div className="absolute inset-0" onClick={togglePlay}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={video.videoUrl}
          loop
          muted={isMuted}
          playsInline
          preload="auto"
        />
        
        {/* Play/Pause Overlay */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            showPlayPause ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="rounded-full bg-black/30 p-5">
            {isPlaying ? (
              <Play className="h-16 w-16 fill-white text-white" />
            ) : (
              <Pause className="h-16 w-16 fill-white text-white" />
            )}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      {/* Level Badge - Top Left */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <div 
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-white shadow-lg",
            levelColors[video.level]
          )}
        >
          <GraduationCap className="h-4 w-4" />
          {video.level}
        </div>
        <span className="rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white">
          {video.language === "bahasa" ? "Indonesian" : "Mandarin"}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
            <AvatarImage src={video.userAvatar} alt={video.displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{video.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Like */}
        <button 
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <Heart 
              className={cn(
                "h-6 w-6 transition-colors",
                liked ? "fill-red-500 text-red-500" : "text-white"
              )} 
            />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow">
            {formatCount(liked ? video.likes + 1 : video.likes)}
          </span>
        </button>

        {/* Comments */}
        <button className="flex flex-col items-center gap-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow">
            {formatCount(video.comments)}
          </span>
        </button>

        {/* Bookmark */}
        <button 
          onClick={() => setBookmarked(!bookmarked)}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <Bookmark 
              className={cn(
                "h-6 w-6 transition-colors",
                bookmarked ? "fill-amber-400 text-amber-400" : "text-white"
              )} 
            />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow">
            {formatCount(bookmarked ? video.bookmarks + 1 : video.bookmarks)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow">
            {formatCount(video.shares)}
          </span>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-4 right-20 z-10">
        {/* Username */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white drop-shadow">@{video.username}</span>
        </div>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-sm text-white/90 drop-shadow">
          {video.description}
        </p>
      </div>

      {/* Mute Button */}
      <button 
        onClick={toggleMute}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </button>
    </div>
  )
}
