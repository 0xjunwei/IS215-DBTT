"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Trophy, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizModalProps {
  language: "bahasa" | "chinese"
  theme: string
  onComplete: (xpEarned: number) => void
  onClose: () => void
}

const bahasaQuizzes: Record<string, QuizQuestion[]> = {
  food: [
    { id: "1", question: "What is 'Bawang goreng'?", options: ["Shallot", "Indomie", "Garlic", "Onion"], correctAnswer: 0, explanation: "'Bawang goreng' is the Indonesian word for 'Shallot'" },
    { id: "2", question: "What is 'Teman'?", options: ["Hello", "Friend", "Ok", "Thank You"], correctAnswer: 1, explanation: "'Teman' means Friend in Indonesian" },
    { id: "3", question: "What is 'Ganteng'?", options: ["Potato", "Handsome", "Fried chicken", "Egg"], correctAnswer: 1, explanation: "'Ganteng' literally means Handsome" },
    { id: "4", question: "What is 'Lihat'?", options: ["Fish", "Insight", "See", "Set"], correctAnswer: 2, explanation: "'Lihat' means 'Look/See'" },
  ],
  travel: [
    { id: "1", question: "What does 'Di mana' mean?", options: ["What time", "Where", "How much", "Why"], correctAnswer: 1, explanation: "'Di mana' is used to ask 'Where' in Indonesian" },
    { id: "2", question: "How do you say 'airport' in Bahasa?", options: ["Stasiun", "Bandara", "Terminal", "Pelabuhan"], correctAnswer: 1, explanation: "'Bandara' is the Indonesian word for airport" },
    { id: "3", question: "What is 'Saya mau pergi ke...'?", options: ["I want to eat at...", "I want to go to...", "I want to buy...", "I want to see..."], correctAnswer: 1, explanation: "'Saya mau pergi ke' means 'I want to go to'" },
    { id: "4", question: "How do you ask for directions?", options: ["Berapa harga?", "Jam berapa?", "Bagaimana caranya ke...?", "Apa ini?"], correctAnswer: 2, explanation: "'Bagaimana caranya ke...?' means 'How do I get to...?'" },
  ],
  comedy: [
    { id: "1", question: "What does 'Lucu sekali!' mean?", options: ["Very sad!", "Very funny!", "Very angry!", "Very tired!"], correctAnswer: 1, explanation: "'Lucu sekali' means 'Very funny!'" },
    { id: "2", question: "How do you say 'joke' in Bahasa?", options: ["Cerita", "Lelucon", "Lagu", "Film"], correctAnswer: 1, explanation: "'Lelucon' means joke in Indonesian" },
    { id: "3", question: "What is 'Saya tidak mengerti'?", options: ["I don't like it", "I don't understand", "I don't want it", "I don't have it"], correctAnswer: 1, explanation: "'Saya tidak mengerti' means 'I don't understand'" },
    { id: "4", question: "How do you express laughter in Indonesian text?", options: ["Haha", "Wkwk", "Lol", "Hihi"], correctAnswer: 1, explanation: "'Wkwk' is the common way Indonesians express laughter in text" },
  ],
  movies: [
    { id: "1", question: "What does 'Film' mean in Bahasa?", options: ["Book", "Movie", "Song", "Show"], correctAnswer: 1, explanation: "'Film' means the same in Indonesian - movie" },
    { id: "2", question: "How do you say 'actor' in Bahasa?", options: ["Penyanyi", "Penulis", "Aktor", "Penari"], correctAnswer: 2, explanation: "'Aktor' is borrowed from English and means actor" },
    { id: "3", question: "What is 'Saya suka film ini'?", options: ["I hate this movie", "I like this movie", "I saw this movie", "I made this movie"], correctAnswer: 1, explanation: "'Saya suka film ini' means 'I like this movie'" },
    { id: "4", question: "How do you say 'subtitle' in Indonesian?", options: ["Teks", "Judul", "Terjemahan", "Subjudul"], correctAnswer: 3, explanation: "'Subjudul' or 'subtitle' is used for movie subtitles" },
  ],
}

const chineseQuizzes: Record<string, QuizQuestion[]> = {
  food: [
    { id: "1", question: "What does '好吃' (hǎo chī) mean?", options: ["Expensive", "Delicious", "Spicy", "Sweet"], correctAnswer: 1, explanation: "'好吃' means delicious in Chinese" },
    { id: "2", question: "How do you say 'I want to eat' in Chinese?", options: ["我要喝", "我要买", "我要吃", "我要看"], correctAnswer: 2, explanation: "'我要吃' (wǒ yào chī) means 'I want to eat'" },
    { id: "3", question: "What is '饺子' (jiǎozi)?", options: ["Noodles", "Dumplings", "Rice", "Soup"], correctAnswer: 1, explanation: "'饺子' are Chinese dumplings" },
    { id: "4", question: "How do you order tea in Chinese?", options: ["我要咖啡", "我要水", "我要茶", "我要酒"], correctAnswer: 2, explanation: "'我要茶' (wǒ yào chá) means 'I want tea'" },
  ],
  travel: [
    { id: "1", question: "What does '在哪里' (zài nǎ lǐ) mean?", options: ["What time", "Where", "How much", "Why"], correctAnswer: 1, explanation: "'在哪里' is used to ask 'Where' in Chinese" },
    { id: "2", question: "How do you say 'train station' in Chinese?", options: ["机场", "火车站", "公交站", "码头"], correctAnswer: 1, explanation: "'火车站' (huǒchē zhàn) means train station" },
    { id: "3", question: "What is '多少钱'?", options: ["What time is it?", "Where is it?", "How much money?", "How far?"], correctAnswer: 2, explanation: "'多少钱' (duōshao qián) means 'How much money?'" },
    { id: "4", question: "How do you say 'hotel' in Chinese?", options: ["餐厅", "酒店", "商店", "银行"], correctAnswer: 1, explanation: "'酒店' (jiǔdiàn) means hotel" },
  ],
  comedy: [
    { id: "1", question: "What does '太好笑了' mean?", options: ["Too sad", "Too funny", "Too scary", "Too boring"], correctAnswer: 1, explanation: "'太好笑了' means 'Too funny!'" },
    { id: "2", question: "How do you say 'joke' in Chinese?", options: ["故事", "笑话", "歌曲", "电影"], correctAnswer: 1, explanation: "'笑话' (xiàohua) means joke" },
    { id: "3", question: "What is '我不明白'?", options: ["I don't like it", "I don't understand", "I don't want it", "I don't have it"], correctAnswer: 1, explanation: "'我不明白' means 'I don't understand'" },
    { id: "4", question: "How do Chinese people express laughter online?", options: ["Haha", "哈哈哈", "Lol", "Keke"], correctAnswer: 1, explanation: "'哈哈哈' is the common way to express laughter in Chinese" },
  ],
  movies: [
    { id: "1", question: "What does '电影' (diànyǐng) mean?", options: ["TV show", "Movie", "Music", "Book"], correctAnswer: 1, explanation: "'电影' means movie in Chinese" },
    { id: "2", question: "How do you say 'actor' in Chinese?", options: ["歌手", "作家", "演员", "导演"], correctAnswer: 2, explanation: "'演员' (yǎnyuán) means actor" },
    { id: "3", question: "What is '我喜欢这部电影'?", options: ["I hate this movie", "I like this movie", "I saw this movie", "I made this movie"], correctAnswer: 1, explanation: "'我喜欢这部电影' means 'I like this movie'" },
    { id: "4", question: "How do you say 'director' in Chinese?", options: ["演员", "导演", "编剧", "制片人"], correctAnswer: 1, explanation: "'导演' (dǎoyǎn) means director" },
  ],
}

export function QuizModal({ language, theme, onComplete, onClose }: QuizModalProps) {
  const quizzes = language === "bahasa" ? bahasaQuizzes : chineseQuizzes
  const questions = quizzes[theme] || quizzes.food

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [celebrationPulse, setCelebrationPulse] = useState(0)

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === questions[currentQuestion].correctAnswer) {
      setCorrectCount(prev => prev + 1)
      setCelebrationPulse(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsComplete(true)
    }
  }

  const xpEarned = correctCount * 25
  const isCorrectSelection =
    selectedAnswer !== null &&
    selectedAnswer === questions[currentQuestion].correctAnswer

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-md animate-in zoom-in-95 rounded-3xl bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <Image
                src="/duo-owl.svg"
                alt="Duolingo owl"
                width={76}
                height={76}
                className="duo-victory z-10"
                priority
              />
              <Sparkles className="quiz-celebration-sparkle-left h-5 w-5 text-amber-400" />
              <Sparkles className="quiz-celebration-sparkle-right h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-black text-foreground">Quiz Complete!</h2>
            <p className="mb-6 text-muted-foreground">
              You got {correctCount} out of {questions.length} correct
            </p>

            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-500/15 px-6 py-4 ring-1 ring-amber-300/35">
              <Star className="h-8 w-8 fill-amber-500 text-amber-500" />
              <div className="text-left">
                <p className="text-sm text-amber-200">XP Earned</p>
                <p className="text-2xl font-black text-amber-200">+{xpEarned}</p>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">Duo says: Nice work. Keep the streak alive.</span>
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="flex-1 rounded-xl bg-primary font-bold"
                onClick={() => onComplete(xpEarned)}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg animate-in zoom-in-95 rounded-3xl bg-card p-6 shadow-2xl">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                i < currentQuestion ? "bg-primary" :
                  i === currentQuestion ? "bg-primary/50" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Question Badge */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="relative">
            <Image
              src="/duo-owl.svg"
              alt="Duolingo owl coach"
              width={56}
              height={56}
              className={cn(
                "drop-shadow-md",
                showResult && isCorrectSelection ? "duo-celebrate" : "duo-idle"
              )}
              priority
            />
            {showResult && isCorrectSelection && (
              <Sparkles key={celebrationPulse} className="quiz-celebration-sparkle-right h-5 w-5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Question */}
        <h3 className="mb-6 text-xl font-bold text-foreground">
          {questions[currentQuestion].question}
        </h3>

        {/* Options */}
        <div className="mb-6 space-y-3">
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === questions[currentQuestion].correctAnswer

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cn(
                  "relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-left font-medium transition-all",
                  !showResult && "hover:border-primary hover:bg-primary/5",
                  showResult && isCorrect && "border-primary bg-primary/10 text-primary",
                  showResult && isCorrectSelection && isCorrect && "quiz-correct-answer",
                  showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                  !showResult && "border-border"
                )}
              >
                {showResult && isCorrectSelection && isCorrect && (
                  <>
                    <span className="quiz-xp-pop">+25 XP</span>
                    <Sparkles className="quiz-answer-sparkle-left h-4 w-4 text-amber-400" />
                    <Sparkles className="quiz-answer-sparkle-right h-5 w-5 text-primary" />
                  </>
                )}
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  showResult && isCorrect && "border-primary bg-primary text-primary-foreground",
                  showResult && isSelected && !isCorrect && "border-destructive bg-destructive text-destructive-foreground",
                  !showResult && "border-muted-foreground/30"
                )}>
                  {showResult && isCorrect ? <CheckCircle2 className="h-5 w-5" /> :
                    showResult && isSelected ? <XCircle className="h-5 w-5" /> :
                      String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={cn(
            "mb-6 rounded-xl p-4",
            selectedAnswer === questions[currentQuestion].correctAnswer
              ? "bg-primary/10 text-primary"
              : "bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/35"
          )}>
            <p className="text-sm font-medium">
              {questions[currentQuestion].explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button
            className="w-full rounded-xl bg-primary py-6 text-lg font-bold"
            onClick={handleNext}
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </div>
    </div>
  )
}
