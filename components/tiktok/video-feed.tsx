"use client"

import { useState, useRef, useEffect } from "react"
import { VideoCard } from "./video-card"
import { QuizModal } from "./quiz-modal"
import { FileText } from "lucide-react"

export interface VideoData {
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
  theme: string
  transcript: {
    timestamp: string
    original: string
    translation: string
  }[]
}

export type ThemeType = "food" | "travel" | "comedy" | "movies"

const bahasaVideos: Record<ThemeType, VideoData[]> = {
  food: [
    {
      id: "b-food-2",
      username: "sam",
      displayName: "sam",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Sam talks",
      soundName: "Original Sound",
      likes: 32100,
      comments: 890,
      bookmarks: 5670,
      shares: 1200,
      videoUrl: "https://storage.googleapis.com/dbtt-duolingo/IMG_8866.MOV",
      isFollowing: true,
      language: "bahasa",
      level: "A2",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "Hi guys hari ini gua bakal review indomie gua..", translation: "Hi guys, today I will review my Indomie.." },
        { timestamp: "0:03", original: "eh salah mi sedap gua..", translation: "eh, my delicious noodles are wrong.." },
        { timestamp: "0:05", original: "dan ini mi sedap favoritnya gua ya guys karena ini rasa original dan", translation: "and this is my favorite delicious noodle, guys, because it has an original taste and" },
        { timestamp: "0:07", original: "original itu enak banget karena banyak bawang gorengnya", translation: "The original is really delicious because it has lots of fried onions." },
      ],
    },
    {
      id: "b-food-1",
      username: "masak_indonesia",
      displayName: "Masak Indonesia",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      description: "Just Ranting",
      soundName: "Indonesian Rants",
      likes: 45200,
      comments: 1230,
      bookmarks: 8920,
      shares: 2300,
      videoUrl: "https://storage.googleapis.com/dbtt-duolingo/bahasa_1.MP4",
      isFollowing: false,
      language: "bahasa",
      level: "A1",
      theme: "rant",
      transcript: [
        { timestamp: "0:00", original: "Lu pada tahu ga cewe cewe yang sering ngomong", translation: "Do you know that you are the one who often talks?" },
        { timestamp: "0:02", original: "avoidant final boss", translation: "avoidant final boss" },
        { timestamp: "0:04", original: " Dia udah ganteng gini gini tapi avoidant.. Kerja", translation: "He's already handsome like this but avoidant... Work" },
      ],
    },
    {
      id: "b-food-3",
      username: "chef_bali",
      displayName: "Bali",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Friendship",
      soundName: "Original Sound",
      likes: 28500,
      comments: 720,
      bookmarks: 4200,
      shares: 980,
      videoUrl: "https://storage.googleapis.com/dbtt-duolingo/IMG_8876.MP4",
      isFollowing: false,
      language: "bahasa",
      level: "B1",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "Lihat siapa yang beneran temen lu", translation: "See who is really your friend" },
        { timestamp: "0:03", original: "karena banyak teman di saat lu senang.", translation: "because you have lots of friends when you're happy." },
        { timestamp: "0:05", original: "Tapi di saat nanti lu susah, lu akan lihat siapa", translation: "But when you're in trouble, you'll see who" },
        { timestamp: "0:07", original: "teman-teman yang mau ngulurin tangannya ke lu.", translation: "Friends who want to lend a hand to you." },
      ],
    },
    {
      id: "b-food-4",
      username: "kuliner_nusantara",
      displayName: "Kuliner Nusantara",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      description: "Menjelajahi makanan jalanan Indonesia - percakapan tingkat lanjut.",
      soundName: "Street Food Vibes",
      likes: 52300,
      comments: 1890,
      bookmarks: 9800,
      shares: 3200,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B2",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "Mari kita coba makanan ini.", translation: "Let's try this food." },
        { timestamp: "0:03", original: "Rasanya luar biasa!", translation: "The taste is extraordinary!" },
        { timestamp: "0:05", original: "Bumbu rahasia keluarga.", translation: "Family secret spices." },
        { timestamp: "0:07", original: "Sudah turun temurun.", translation: "It's been passed down for generations." },
      ],
    },
  ],
  travel: [
    {
      id: "b-travel-1",
      username: "jalan_jalan",
      displayName: "Jalan Jalan",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Frasa dasar untuk perjalanan di Indonesia!",
      soundName: "Travel Music",
      likes: 38900,
      comments: 1100,
      bookmarks: 7200,
      shares: 1800,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "A1",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "Di mana stasiun?", translation: "Where is the station?" },
        { timestamp: "0:02", original: "Saya mau ke Bandara.", translation: "I want to go to the airport." },
        { timestamp: "0:04", original: "Berapa lama?", translation: "How long?" },
        { timestamp: "0:06", original: "Terima kasih banyak.", translation: "Thank you very much." },
      ],
    },
    {
      id: "b-travel-2",
      username: "explore_indo",
      displayName: "Explore Indo",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      description: "Naik transportasi umum di Jakarta.",
      soundName: "City Sounds",
      likes: 29400,
      comments: 830,
      bookmarks: 5100,
      shares: 1100,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "bahasa",
      level: "A2",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "Naik MRT ke mana?", translation: "Where does this MRT go?" },
        { timestamp: "0:03", original: "Turun di sini.", translation: "Get off here." },
        { timestamp: "0:05", original: "Hati-hati!", translation: "Be careful!" },
        { timestamp: "0:07", original: "Jangan lupa tiketnya.", translation: "Don't forget your ticket." },
      ],
    },
    {
      id: "b-travel-3",
      username: "backpacker_id",
      displayName: "Backpacker ID",
      userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      description: "Tips hotel dan akomodasi di Indonesia.",
      soundName: "Hotel Lobby Music",
      likes: 41200,
      comments: 1340,
      bookmarks: 8100,
      shares: 2100,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B1",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "Ada kamar kosong?", translation: "Is there a vacant room?" },
        { timestamp: "0:03", original: "Untuk berapa malam?", translation: "For how many nights?" },
        { timestamp: "0:05", original: "Termasuk sarapan?", translation: "Does it include breakfast?" },
        { timestamp: "0:07", original: "Boleh lihat kamarnya?", translation: "Can I see the room?" },
      ],
    },
    {
      id: "b-travel-4",
      username: "wisata_alam",
      displayName: "Wisata Alam",
      userAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      description: "Menjelajahi keindahan alam Indonesia - percakapan lanjutan.",
      soundName: "Nature Sounds",
      likes: 67800,
      comments: 2100,
      bookmarks: 12300,
      shares: 4500,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B2",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "Pemandangan yang menakjubkan!", translation: "What an amazing view!" },
        { timestamp: "0:03", original: "Kita mendaki gunung ini.", translation: "We're hiking this mountain." },
        { timestamp: "0:05", original: "Udara di sini sangat segar.", translation: "The air here is very fresh." },
        { timestamp: "0:07", original: "Jangan buang sampah sembarangan.", translation: "Don't litter." },
      ],
    },
  ],
  comedy: [
    {
      id: "b-comedy-1",
      username: "lucu_indo",
      displayName: "Lucu Indo",
      userAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
      description: "Lelucon sehari-hari dalam Bahasa Indonesia!",
      soundName: "Laugh Track",
      likes: 89200,
      comments: 3450,
      bookmarks: 15600,
      shares: 7890,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "A1",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "Kenapa ayam menyeberang jalan?", translation: "Why did the chicken cross the road?" },
        { timestamp: "0:03", original: "Karena mau ke seberang!", translation: "Because it wanted to get to the other side!" },
        { timestamp: "0:05", original: "Wkwkwk!", translation: "Hahaha!" },
        { timestamp: "0:07", original: "Lucu sekali!", translation: "So funny!" },
      ],
    },
    {
      id: "b-comedy-2",
      username: "stand_up_id",
      displayName: "Stand Up ID",
      userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      description: "Stand up comedy untuk belajar bahasa sehari-hari.",
      soundName: "Comedy Club",
      likes: 72100,
      comments: 2890,
      bookmarks: 11200,
      shares: 5600,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "bahasa",
      level: "A2",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "Halo semuanya!", translation: "Hello everyone!" },
        { timestamp: "0:02", original: "Aku baru belajar bahasa.", translation: "I just started learning the language." },
        { timestamp: "0:04", original: "Susah banget ya!", translation: "It's so hard!" },
        { timestamp: "0:06", original: "Tapi kita tetap semangat!", translation: "But we stay motivated!" },
      ],
    },
    {
      id: "b-comedy-3",
      username: "meme_indo",
      displayName: "Meme Indo",
      userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
      description: "Meme Indonesia dan humor internet!",
      soundName: "Viral Sound",
      likes: 156000,
      comments: 5600,
      bookmarks: 28900,
      shares: 12300,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B1",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "Kamu tau gak?", translation: "Do you know?" },
        { timestamp: "0:02", original: "Ini lagi viral banget!", translation: "This is going super viral!" },
        { timestamp: "0:04", original: "Semua orang ngomongin ini.", translation: "Everyone is talking about this." },
        { timestamp: "0:06", original: "Ngakak abis!", translation: "Laughing so hard!" },
      ],
    },
    {
      id: "b-comedy-4",
      username: "komedi_situasi",
      displayName: "Komedi Situasi",
      userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      description: "Situasi lucu dalam kehidupan sehari-hari Indonesia.",
      soundName: "Sitcom Theme",
      likes: 98700,
      comments: 4200,
      bookmarks: 18900,
      shares: 8900,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B2",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "Aduh, aku telat lagi!", translation: "Oh no, I'm late again!" },
        { timestamp: "0:03", original: "Macet di mana-mana.", translation: "Traffic jam everywhere." },
        { timestamp: "0:05", original: "Bos pasti marah.", translation: "The boss will definitely be angry." },
        { timestamp: "0:07", original: "Yasudahlah, santai aja.", translation: "Oh well, just relax." },
      ],
    },
  ],
  movies: [
    {
      id: "b-movies-1",
      username: "film_indonesia",
      displayName: "Film Indonesia",
      userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      description: "Kosakata dasar untuk membahas film!",
      soundName: "Cinema Music",
      likes: 34500,
      comments: 980,
      bookmarks: 6200,
      shares: 1500,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "A1",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "Ayo nonton film!", translation: "Let's watch a movie!" },
        { timestamp: "0:02", original: "Film apa yang bagus?", translation: "What movie is good?" },
        { timestamp: "0:04", original: "Saya suka film action.", translation: "I like action movies." },
        { timestamp: "0:06", original: "Beli tiket di sini.", translation: "Buy tickets here." },
      ],
    },
    {
      id: "b-movies-2",
      username: "bioskop_review",
      displayName: "Bioskop Review",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      description: "Review film Indonesia terbaru.",
      soundName: "Movie Trailer",
      likes: 45600,
      comments: 1450,
      bookmarks: 8900,
      shares: 2300,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "bahasa",
      level: "A2",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "Film ini sangat bagus!", translation: "This movie is very good!" },
        { timestamp: "0:03", original: "Aktingnya luar biasa.", translation: "The acting is extraordinary." },
        { timestamp: "0:05", original: "Ceritanya menarik.", translation: "The story is interesting." },
        { timestamp: "0:07", original: "Wajib ditonton!", translation: "Must watch!" },
      ],
    },
    {
      id: "b-movies-3",
      username: "sinema_indo",
      displayName: "Sinema Indo",
      userAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      description: "Analisis mendalam film klasik Indonesia.",
      soundName: "Classic Film Score",
      likes: 28900,
      comments: 890,
      bookmarks: 5400,
      shares: 1200,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B1",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "Film ini dirilis tahun 1990.", translation: "This film was released in 1990." },
        { timestamp: "0:03", original: "Sutradaranya sangat terkenal.", translation: "The director is very famous." },
        { timestamp: "0:05", original: "Ini adalah karya masterpiece.", translation: "This is a masterpiece." },
        { timestamp: "0:07", original: "Pesannya masih relevan.", translation: "The message is still relevant." },
      ],
    },
    {
      id: "b-movies-4",
      username: "hollywood_indo",
      displayName: "Hollywood Indo",
      userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
      description: "Membahas film Hollywood dengan subtitle Indonesia.",
      soundName: "Hollywood Theme",
      likes: 67800,
      comments: 2340,
      bookmarks: 12300,
      shares: 4500,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "bahasa",
      level: "B2",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "Film blockbuster terbaru!", translation: "The latest blockbuster movie!" },
        { timestamp: "0:03", original: "Efek visualnya menakjubkan.", translation: "The visual effects are amazing." },
        { timestamp: "0:05", original: "Soundtrack-nya epic banget.", translation: "The soundtrack is super epic." },
        { timestamp: "0:07", original: "Pasti ada sekuelnya.", translation: "There will definitely be a sequel." },
      ],
    },
  ],
}

const chineseVideos: Record<ThemeType, VideoData[]> = {
  food: [
    {
      id: "c-chinese-1",
      username: "zhonghua_meishi",
      displayName: "Chongqing tours",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Chongqing re-creation",
      soundName: "Chinese Songs",
      likes: 67800,
      comments: 2340,
      bookmarks: 12300,
      shares: 4500,
      videoUrl: "https://storage.googleapis.com/dbtt-duolingo/chinese%201.MOV",
      isFollowing: false,
      language: "chinese",
      level: "A1",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "愛我的話 給我回答", translation: "If you love me, give me an answer." },
        { timestamp: "0:03", original: "我的愛ㄚ愛ㄚ沒時差", translation: "My love, my love has no time difference." },
        { timestamp: "0:05", original: "等待是我為你付出的代價 Oh~", translation: "Waiting is the price I paid for you. Oh~" },
      ],
    },
    {
      id: "c-chinese-2",
      username: "game_play",
      displayName: "CNPlays",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      description: "Chinese gameplay",
      soundName: "Original Sound",
      likes: 89200,
      comments: 3450,
      bookmarks: 23400,
      shares: 7890,
      videoUrl: "https://storage.googleapis.com/dbtt-duolingo/chinese2.mp4",
      isFollowing: false,
      language: "chinese",
      level: "A2",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "give me a little", translation: "give me a little" },
        { timestamp: "0:03", original: "one minute, 我调整一下", translation: "One minute, let me adjust" },
        { timestamp: "0:05", original: "I have my translator", translation: "I have my translator." },
        { timestamp: "0:07", original: "豆包", translation: "bean bao" },
      ],
    },
    {
      id: "c-food-3",
      username: "cooking_chinese",
      displayName: "Cooking Chinese",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      description: "Learn to cook Chinese dishes - kitchen vocabulary!",
      soundName: "Cooking Sounds",
      likes: 56700,
      comments: 1890,
      bookmarks: 9800,
      shares: 3400,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: true,
      language: "chinese",
      level: "B1",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "首先，切葱姜蒜。", translation: "First, cut the scallions, ginger, and garlic." },
        { timestamp: "0:03", original: "然后热油。", translation: "Then heat the oil." },
        { timestamp: "0:05", original: "加入酱油。", translation: "Add soy sauce." },
        { timestamp: "0:07", original: "翻炒两分钟。", translation: "Stir-fry for two minutes." },
      ],
    },
    {
      id: "c-food-4",
      username: "food_culture_cn",
      displayName: "Food Culture CN",
      userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      description: "The culture behind Chinese food - advanced discussions.",
      soundName: "Documentary Style",
      likes: 78900,
      comments: 2670,
      bookmarks: 15600,
      shares: 5600,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B2",
      theme: "food",
      transcript: [
        { timestamp: "0:00", original: "中国饮食文化博大精深。", translation: "Chinese food culture is profound and extensive." },
        { timestamp: "0:03", original: "每个地区都有特色。", translation: "Every region has its specialties." },
        { timestamp: "0:05", original: "八大菜系各有千秋。", translation: "The eight cuisines each have their merits." },
        { timestamp: "0:07", original: "美食承载着历史。", translation: "Food carries history." },
      ],
    },
  ],
  travel: [
    {
      id: "c-travel-1",
      username: "china_travel",
      displayName: "China Travel",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Essential travel phrases for visiting China!",
      soundName: "Travel Vibes",
      likes: 45600,
      comments: 1340,
      bookmarks: 8900,
      shares: 2300,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "chinese",
      level: "A1",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "请问，火车站在哪里？", translation: "Excuse me, where is the train station?" },
        { timestamp: "0:03", original: "往前走。", translation: "Go straight ahead." },
        { timestamp: "0:05", original: "然后左转。", translation: "Then turn left." },
        { timestamp: "0:07", original: "谢谢您！", translation: "Thank you!" },
      ],
    },
    {
      id: "c-travel-2",
      username: "beijing_guide",
      displayName: "Beijing Guide",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      description: "Exploring Beijing - transportation and directions!",
      soundName: "City Ambience",
      likes: 52300,
      comments: 1670,
      bookmarks: 10200,
      shares: 3100,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "chinese",
      level: "A2",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "坐地铁很方便。", translation: "Taking the subway is very convenient." },
        { timestamp: "0:03", original: "两站就到了。", translation: "It's just two stops." },
        { timestamp: "0:05", original: "买一张单程票。", translation: "Buy a one-way ticket." },
        { timestamp: "0:07", original: "下一站是故宫。", translation: "The next stop is the Forbidden City." },
      ],
    },
    {
      id: "c-travel-3",
      username: "hotel_chinese",
      displayName: "Hotel Chinese",
      userAvatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      description: "Booking hotels and accommodations in Chinese.",
      soundName: "Hotel Lobby",
      likes: 38900,
      comments: 1230,
      bookmarks: 7600,
      shares: 1900,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B1",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "我预订了一个房间。", translation: "I booked a room." },
        { timestamp: "0:03", original: "住三个晚上。", translation: "Staying for three nights." },
        { timestamp: "0:05", original: "包含早餐吗？", translation: "Does it include breakfast?" },
        { timestamp: "0:07", original: "可以延迟退房吗？", translation: "Can I have a late checkout?" },
      ],
    },
    {
      id: "c-travel-4",
      username: "adventure_cn",
      displayName: "Adventure CN",
      userAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
      description: "Advanced travel conversations and cultural insights.",
      soundName: "Adventure Music",
      likes: 67800,
      comments: 2340,
      bookmarks: 12300,
      shares: 4500,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B2",
      theme: "travel",
      transcript: [
        { timestamp: "0:00", original: "这次旅行让我大开眼界。", translation: "This trip was eye-opening." },
        { timestamp: "0:03", original: "中国的自然风光太美了。", translation: "China's natural scenery is so beautiful." },
        { timestamp: "0:05", original: "历史古迹保存完好。", translation: "The historical sites are well preserved." },
        { timestamp: "0:07", original: "下次还要再来！", translation: "I'll come back again!" },
      ],
    },
  ],
  comedy: [
    {
      id: "c-comedy-1",
      username: "xiaohua_daily",
      displayName: "Daily Jokes CN",
      userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      description: "Learn Chinese through funny jokes!",
      soundName: "Laugh Track",
      likes: 98700,
      comments: 4200,
      bookmarks: 18900,
      shares: 8900,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "chinese",
      level: "A1",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "你听说了吗？", translation: "Did you hear?" },
        { timestamp: "0:02", original: "什么？", translation: "What?" },
        { timestamp: "0:04", original: "今天是星期一！", translation: "Today is Monday!" },
        { timestamp: "0:06", original: "哈哈哈！", translation: "Hahaha!" },
      ],
    },
    {
      id: "c-comedy-2",
      username: "xiangsheng_cn",
      displayName: "Crosstalk CN",
      userAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
      description: "Traditional Chinese crosstalk comedy!",
      soundName: "Comedy Club",
      likes: 87600,
      comments: 3890,
      bookmarks: 16700,
      shares: 7200,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "chinese",
      level: "A2",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "说学逗唱。", translation: "Speaking, imitating, teasing, singing." },
        { timestamp: "0:03", original: "这是相声的四门功课。", translation: "These are the four skills of crosstalk." },
        { timestamp: "0:05", original: "我来表演一个。", translation: "Let me perform one." },
        { timestamp: "0:07", original: "大家鼓掌！", translation: "Everyone applaud!" },
      ],
    },
    {
      id: "c-comedy-3",
      username: "funny_cn",
      displayName: "Funny Chinese",
      userAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
      description: "Internet humor and memes in Chinese!",
      soundName: "Viral Sound",
      likes: 156000,
      comments: 6700,
      bookmarks: 32100,
      shares: 15600,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B1",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "这个梗太火了！", translation: "This meme is so popular!" },
        { timestamp: "0:03", original: "笑死我了！", translation: "I'm dying of laughter!" },
        { timestamp: "0:05", original: "太真实了。", translation: "So relatable." },
        { timestamp: "0:07", original: "转发给朋友！", translation: "Share with friends!" },
      ],
    },
    {
      id: "c-comedy-4",
      username: "satire_cn",
      displayName: "Chinese Satire",
      userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
      description: "Advanced humor and wordplay in Chinese.",
      soundName: "Smart Humor",
      likes: 78900,
      comments: 3450,
      bookmarks: 14500,
      shares: 6700,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B2",
      theme: "comedy",
      transcript: [
        { timestamp: "0:00", original: "中文谐音梗很有意思。", translation: "Chinese puns are very interesting." },
        { timestamp: "0:03", original: "一语双关。", translation: "Double meaning." },
        { timestamp: "0:05", original: "文字游戏的魅力。", translation: "The charm of wordplay." },
        { timestamp: "0:07", original: "需要文化背景才能理解。", translation: "You need cultural context to understand." },
      ],
    },
  ],
  movies: [
    {
      id: "c-movies-1",
      username: "dianying_basics",
      displayName: "Movie Basics CN",
      userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      description: "Basic movie vocabulary in Chinese!",
      soundName: "Cinema Theme",
      likes: 34500,
      comments: 1120,
      bookmarks: 6800,
      shares: 1700,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isFollowing: false,
      language: "chinese",
      level: "A1",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "我们去看电影吧！", translation: "Let's go watch a movie!" },
        { timestamp: "0:03", original: "今天有什么电影？", translation: "What movies are showing today?" },
        { timestamp: "0:05", original: "买两张票。", translation: "Buy two tickets." },
        { timestamp: "0:07", original: "座位在哪里？", translation: "Where are the seats?" },
      ],
    },
    {
      id: "c-movies-2",
      username: "movie_review_cn",
      displayName: "Movie Reviews CN",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      description: "Reviewing Chinese movies - learn opinions vocabulary!",
      soundName: "Review Music",
      likes: 45600,
      comments: 1560,
      bookmarks: 8900,
      shares: 2400,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      isFollowing: true,
      language: "chinese",
      level: "A2",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "这部电影很感人。", translation: "This movie is very touching." },
        { timestamp: "0:03", original: "演员演得太好了。", translation: "The actors performed excellently." },
        { timestamp: "0:05", original: "剧情很精彩。", translation: "The plot is exciting." },
        { timestamp: "0:07", original: "强烈推荐！", translation: "Highly recommended!" },
      ],
    },
    {
      id: "c-movies-3",
      username: "classic_chinese_films",
      displayName: "Classic Films CN",
      userAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      description: "Analyzing classic Chinese cinema.",
      soundName: "Classic Score",
      likes: 38900,
      comments: 1340,
      bookmarks: 7200,
      shares: 2100,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B1",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "这是一部经典之作。", translation: "This is a classic work." },
        { timestamp: "0:03", original: "导演的手法很独特。", translation: "The director's technique is unique." },
        { timestamp: "0:05", original: "影响了整个行业。", translation: "It influenced the entire industry." },
        { timestamp: "0:07", original: "至今仍被人称赞。", translation: "It's still praised today." },
      ],
    },
    {
      id: "c-movies-4",
      username: "film_analysis_cn",
      displayName: "Film Analysis CN",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      description: "Advanced film analysis and industry vocabulary.",
      soundName: "Documentary Theme",
      likes: 56700,
      comments: 2100,
      bookmarks: 11200,
      shares: 3900,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      isFollowing: false,
      language: "chinese",
      level: "B2",
      theme: "movies",
      transcript: [
        { timestamp: "0:00", original: "从摄影角度来分析。", translation: "Analyzing from a cinematography perspective." },
        { timestamp: "0:03", original: "灯光运用很讲究。", translation: "The lighting is very deliberate." },
        { timestamp: "0:05", original: "配乐渲染了气氛。", translation: "The soundtrack sets the mood." },
        { timestamp: "0:07", original: "是一部值得研究的作品。", translation: "It's a work worth studying." },
      ],
    },
  ],
}

interface VideoFeedProps {
  language: "bahasa" | "chinese"
  theme: ThemeType
  onVideoChange: (video: VideoData) => void
  onAllVideosWatched: () => void
  showQuiz?: boolean
  onQuizComplete?: (xp: number) => void
  onShowTranscript?: () => void
}

const TIKTOK_ASPECT_RATIO = 9 / 16

export function VideoFeed({ language, theme, onVideoChange, onAllVideosWatched, showQuiz, onQuizComplete, onShowTranscript }: VideoFeedProps) {
  const allVideos = language === "bahasa" ? bahasaVideos : chineseVideos
  const videos = allVideos[theme] || allVideos.food
  const [activeIndex, setActiveIndex] = useState(0)
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set())
  const [hasTriggeredQuiz, setHasTriggeredQuiz] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const effectiveMuted = isMuted || !!showQuiz

  useEffect(() => {
    setActiveIndex(0)
    setWatchedVideos(new Set())
    setHasTriggeredQuiz(false)
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
    if (onVideoChange && videos[0]) {
      onVideoChange(videos[0])
    }
  }, [language, theme, onVideoChange, videos])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const videoHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / videoHeight)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < videos.length) {
        setActiveIndex(newIndex)
        if (onVideoChange) {
          onVideoChange(videos[newIndex])
        }

        // Mark current video as watched
        setWatchedVideos(prev => {
          const updated = new Set(prev)
          updated.add(videos[newIndex].id)
          return updated
        })

        // Trigger quiz only when reaching the LAST video and haven't triggered yet
        if (newIndex === videos.length - 1 && !hasTriggeredQuiz) {
          setHasTriggeredQuiz(true)
          setTimeout(() => onAllVideosWatched(), 500)
        }
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [activeIndex, videos, onVideoChange, onAllVideosWatched, hasTriggeredQuiz])

  // Mark first video as watched on mount
  useEffect(() => {
    if (videos[0]) {
      setWatchedVideos(prev => {
        const updated = new Set(prev)
        updated.add(videos[0].id)
        return updated
      })
    }
  }, [videos])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const updateFrameSize = () => {
      const stageWidth = stage.clientWidth
      const stageHeight = stage.clientHeight

      if (stageWidth === 0 || stageHeight === 0) return

      let nextWidth = stageWidth
      let nextHeight = nextWidth / TIKTOK_ASPECT_RATIO

      if (nextHeight > stageHeight) {
        nextHeight = stageHeight
        nextWidth = nextHeight * TIKTOK_ASPECT_RATIO
      }

      setFrameSize(prev => {
        const widthChanged = Math.abs(prev.width - nextWidth) > 0.5
        const heightChanged = Math.abs(prev.height - nextHeight) > 0.5
        return widthChanged || heightChanged ? { width: nextWidth, height: nextHeight } : prev
      })
    }

    updateFrameSize()

    const observer = new ResizeObserver(updateFrameSize)
    observer.observe(stage)

    return () => observer.disconnect()
  }, [])

  const hasMeasuredFrame = frameSize.width > 0 && frameSize.height > 0

  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_top,_#2f4360_0%,_#233449_38%,_#162231_100%)]">
      <div className="absolute inset-0 p-1 sm:p-2 md:p-4">
        <div ref={stageRef} className="flex h-full w-full items-center justify-center">
          <div
            className="relative h-full w-full overflow-hidden bg-black sm:rounded-2xl"
            style={
              hasMeasuredFrame
                ? {
                  width: `${frameSize.width}px`,
                  height: `${frameSize.height}px`,
                }
                : undefined
            }
          >
            {/* Progress indicator */}
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-semibold text-foreground">
                {activeIndex + 1}/{videos.length}
              </span>
              <div className="flex gap-1">
                {videos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-4 rounded-full transition-colors md:w-6 ${index === activeIndex ? "bg-primary" : "bg-muted"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Transcript Button */}
            {onShowTranscript && (
              <button
                onClick={onShowTranscript}
                className="absolute bottom-6 right-4 z-20 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg lg:hidden"
              >
                <FileText className="h-4 w-4" />
                Transcript
              </button>
            )}

            <div
              ref={containerRef}
              className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
            >
              {videos.map((video, index) => (
                <div key={video.id} className="h-full w-full snap-start">
                  <VideoCard
                    video={video}
                    isActive={index === activeIndex}
                    muted={effectiveMuted}
                    onMuteChange={setIsMuted}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && onQuizComplete && (
        <QuizModal
          theme={theme}
          language={language}
          onComplete={onQuizComplete}
          onClose={() => onQuizComplete(0)}
        />
      )}
    </div>
  )
}
