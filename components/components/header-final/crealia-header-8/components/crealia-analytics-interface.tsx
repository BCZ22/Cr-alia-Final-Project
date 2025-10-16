"use client"

import { useState } from "react"
import {
  X,
  BarChart3,
  Target,
  Zap,
  Brain,
  Download,
  RefreshCw,
  Clock,
  Plus,
  Settings,
  CheckCircle,
  Link,
  Shield,
  Users,
  Building,
  Star,
  UserCheck,
  Search,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Define the props interface
interface CrealiaAnalyticsInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

const platforms = [
  {
    name: "Instagram",
    icon: "📷",
    color: "#E4405F",
    followers: "125.4K",
    engagement: "4.2%",
    posts: 342,
    permissions: ["Posts", "Stories", "Reels", "Analytics", "Messages"],
    connected: true,
    metrics: {
      likes: "45.2K",
      comments: "3.1K",
      shares: "892",
      saves: "2.3K",
      reach: "89.5K",
      impressions: "156.8K",
      profileVisits: "1.2K",
      websiteClicks: "456",
    },
    accountTypes: ["Personal", "Business", "Creator"],
    connectionMethods: ["Graph API", "Marketing API", "Pages API"],
    growth: "+12%",
    topContent: "Reels",
    bestTime: "18:00-20:00",
    demographics: { "25-34": 40, "35-44": 30, "45-54": 20, "55+": 10 },
    description: "Plateforme de partage de photos et vidéos",
    lastSync: "2024-07-26 10:30",
    status: "active",
  },
  {
    name: "TikTok",
    icon: "🎵",
    color: "#000000",
    followers: "89.2K",
    engagement: "6.8%",
    posts: 156,
    permissions: ["Vidéos", "Analytics", "Commentaires", "Messages"],
    connected: true,
    metrics: {
      likes: "234.5K",
      comments: "12.3K",
      shares: "8.9K",
      views: "1.2M",
      completionRate: "78%",
      duets: "234",
      stitches: "89",
      profileViews: "5.6K",
      averageWatchTime: "25s",
      viralityScore: "8.5",
    },
    accountTypes: ["Personal", "Business", "Creator"],
    connectionMethods: ["TikTok API", "OAuth 2.0"],
    growth: "+28%",
    topContent: "Vidéos courtes",
    bestTime: "19:00-22:00",
    demographics: { "16-24": 55, "25-34": 30, "35-44": 10, "45+": 5 },
    description: "Plateforme de vidéos courtes et virales",
    lastSync: "2024-07-26 10:35",
    status: "active",
  },
  {
    name: "YouTube",
    icon: "📺",
    color: "#FF0000",
    followers: "45.8K",
    engagement: "5.1%",
    posts: 89,
    permissions: ["Analytics chaîne", "Gestion vidéos", "Commentaires"],
    connected: true,
    metrics: {
      likes: "89.2K",
      comments: "5.6K",
      shares: "2.1K",
      views: "2.8M",
      watchTime: "45.6K hrs",
      subscribers: "+1.2K",
      ctr: "8.9%",
      retention: "65%",
      averageViewDuration: "5min",
    },
    accountTypes: ["Personal", "Creator"],
    connectionMethods: ["YouTube Data API", "Google OAuth"],
    growth: "+18%",
    topContent: "Tutoriels",
    bestTime: "17:00-21:00",
    demographics: { "25-34": 45, "35-44": 35, "45-54": 15, "55+": 5 },
    description: "Plateforme de partage de vidéos et de streaming",
    lastSync: "2024-07-26 10:40",
    status: "active",
  },
  {
    name: "Facebook",
    icon: "👥",
    color: "#1877F2",
    followers: "45K",
    engagement: "2.1%",
    posts: 28,
    permissions: ["Gestion pages", "Analytics", "Publications", "Publicités"],
    connected: true,
    metrics: {
      likes: "45K",
      comments: "3.2K",
      shares: "890",
      reactions: {
        like: 35000,
        love: 8900,
        haha: 2400,
        wow: 1200,
        sad: 340,
        angry: 160,
      },
      pageViews: 15600,
      pageFollowers: 45000,
      pageUnfollows: 890,
      postClicks: 8900,
      linkClicks: 2400,
      otherClicks: 1200,
      photoViews: 89000,
      videoViews: 156000,
      videoRetention: 65.4,
      checkIns: 234,
    },
    growth: "+8%",
    topContent: "Articles",
    bestTime: "12:00-14:00",
    demographics: { "25-34": 30, "35-44": 35, "45-54": 25, "55+": 10 },
    description: "Réseau social pour connexions personnelles et professionnelles",
    connectionMethods: ["Graph API", "Marketing API", "Pages API"],
    accountTypes: ["Personal", "Business", "Page"],
    lastSync: "2024-07-26 10:45",
    status: "active",
  },
  {
    name: "X/Twitter",
    icon: "🐦",
    color: "#1DA1F2",
    followers: "34K",
    engagement: "3.8%",
    posts: 245,
    permissions: ["Lecture tweets", "Publication", "Analytics", "Gestion followers"],
    connected: true,
    metrics: {
      tweets: 245,
      retweets: 8900,
      likes: 34000,
      replies: 5600,
      impressions: 890000,
      mentions: 1200,
      views: 650000,
      shares: 8900,
      profileVisits: 15600,
      followersGained: 890,
      followersLost: 234,
      linkClicks: 2400,
      hashtagClicks: 1200,
      detailExpands: 8900,
      mediaViews: 156000,
      mediaEngagements: 12000,
      quoteTweets: 890,
      bookmarks: 2400,
      engagementRate: 3.8,
    },
    growth: "+15%",
    topContent: "Threads",
    bestTime: "09:00-11:00",
    demographics: { "25-34": 40, "35-44": 35, "45-54": 20, "55+": 5 },
    description: "Plateforme de microblogging et actualités en temps réel",
    connectionMethods: ["Twitter API v2", "OAuth 1.0a", "Developer Portal"],
    accountTypes: ["Personal", "Business"],
    lastSync: "2024-07-26 10:50",
    status: "active",
  },
  {
    name: "LinkedIn",
    icon: "💼",
    color: "#0A66C2",
    followers: "12K",
    engagement: "3.5%",
    posts: 15,
    permissions: ["Profil entreprise", "Analytics", "Publications", "Lead Generation"],
    connected: true,
    metrics: {
      posts: 15,
      likes: 12000,
      comments: 1800,
      shares: 450,
      connections: 2500,
      profileViews: 8900,
      views: 45000,
      reach: 35000,
      impressions: 89000,
      postClicks: 2400,
      followersGained: 340,
      followersLost: 89,
      companyPageViews: 15600,
      uniqueImpressions: 67000,
      socialActions: 890,
      engagementRate: 3.5,
      clickThroughRate: 2.7,
      videoViews: 23000,
      documentViews: 8900,
      carouselSwipes: 1200,
    },
    growth: "+22%",
    topContent: "Industry Insights",
    bestTime: "08:00-10:00",
    demographics: { "25-34": 45, "35-44": 35, "45-54": 15, "55+": 5 },
    description: "Réseau professionnel pour le networking et le business",
    connectionMethods: ["LinkedIn API", "Marketing Developer Platform", "Company Pages API"],
    accountTypes: ["Personal", "Business", "Page"],
    lastSync: "2024-07-26 10:55",
    status: "active",
  },
  {
    name: "Pinterest",
    icon: "📌",
    color: "#BD081C",
    followers: "23K",
    engagement: "4.7%",
    posts: 189,
    permissions: ["Gestion pins", "Analytics", "Boards", "Shopping features"],
    connected: true,
    metrics: {
      pins: 189,
      impressions: 450000,
      saves: 23000,
      clicks: 8900,
      boards: 45,
      followers: 23000,
      views: 380000,
      likes: 15600,
      comments: 2400,
      shares: 5200,
      outboundClicks: 12000,
      pinClicks: 8900,
      profileVisits: 2400,
      followersGained: 890,
      followersLost: 234,
      topPins: 45,
      videoViews: 89000,
      ideaPinViews: 23000,
      storyPinViews: 15600,
      closeUps: 34000,
    },
    growth: "+31%",
    topContent: "Infographics",
    bestTime: "20:00-23:00",
    demographics: { "25-34": 35, "35-44": 40, "45-54": 20, "55+": 5 },
    description: "Plateforme de découverte visuelle et inspiration",
    connectionMethods: ["Pinterest API", "Business Hub", "Ads Manager"],
    accountTypes: ["Personal", "Business"],
    lastSync: "2024-07-26 11:00",
    status: "active",
  },
  {
    name: "Snapchat",
    icon: "👻",
    color: "#F7D917",
    followers: "18K",
    engagement: "7.2%",
    posts: 67,
    permissions: ["Stories", "Analytics", "Lenses", "Bitmoji integration"],
    connected: true,
    metrics: {
      snaps: 67,
      views: 180000,
      screenshots: 2400,
      shares: 1200,
      stories: 34,
      spotlight: 12,
      storyShares: 890,
      reach: 150000,
      impressions: 280000,
      storyViews: 156000,
      storyCompletionRate: 72.5,
      snapViews: 89000,
      chatMessages: 5600,
      friendsAdded: 340,
      friendsLost: 89,
      lensViews: 23000,
      filterUses: 8900,
      bitmojisShared: 1200,
      mapViews: 2400,
      discoverViews: 15600,
    },
    growth: "+25%",
    topContent: "Stories",
    bestTime: "16:00-19:00",
    demographics: { "16-24": 60, "25-34": 25, "35-44": 12, "45+": 3 },
    description: "Plateforme de contenu éphémère et réalité augmentée",
    connectionMethods: ["Snap Kit", "Creative Kit", "Bitmoji Kit"],
    accountTypes: ["Personal", "Creator"],
    lastSync: "2024-07-26 11:05",
    status: "active",
  },
]

const realTimeData = [
  {
    time: "14:00",
    engagement: 1250,
    reach: 8500,
    interactions: 340,
    instagram: 450,
    tiktok: 320,
    youtube: 180,
    facebook: 150,
    twitter: 100,
    linkedin: 50,
    pinterest: 80,
    snapchat: 120,
  },
  {
    time: "14:05",
    engagement: 1380,
    reach: 9200,
    interactions: 385,
    instagram: 480,
    tiktok: 350,
    youtube: 200,
    facebook: 160,
    twitter: 110,
    linkedin: 55,
    pinterest: 85,
    snapchat: 140,
  },
  {
    time: "14:10",
    engagement: 1520,
    reach: 10100,
    interactions: 420,
    instagram: 520,
    tiktok: 380,
    youtube: 220,
    facebook: 170,
    twitter: 120,
    linkedin: 60,
    pinterest: 90,
    snapchat: 160,
  },
  {
    time: "14:15",
    engagement: 1680,
    reach: 11200,
    interactions: 465,
    instagram: 560,
    tiktok: 420,
    youtube: 240,
    facebook: 180,
    twitter: 130,
    linkedin: 65,
    pinterest: 95,
    snapchat: 180,
  },
  {
    time: "14:20",
    engagement: 1420,
    reach: 9800,
    interactions: 395,
    instagram: 490,
    tiktok: 340,
    youtube: 190,
    facebook: 155,
    twitter: 105,
    linkedin: 52,
    pinterest: 82,
    snapchat: 145,
  },
  {
    time: "14:25",
    engagement: 1750,
    reach: 12500,
    interactions: 510,
    instagram: 600,
    tiktok: 450,
    youtube: 260,
    facebook: 190,
    twitter: 140,
    linkedin: 70,
    pinterest: 100,
    snapchat: 200,
  },
]

const performanceComparison = [
  { platform: "Instagram", followers: 125000, engagement: 4.2, reach: 450000, growth: 12 },
  { platform: "TikTok", followers: 89000, engagement: 6.8, reach: 2100000, growth: 28 },
  { platform: "YouTube", followers: 67000, engagement: 5.1, reach: 1500000, growth: 18 },
  { platform: "Facebook", followers: 45000, engagement: 2.1, reach: 350000, growth: 8 },
  { platform: "X/Twitter", followers: 34000, engagement: 3.8, reach: 890000, growth: 15 },
  { platform: "LinkedIn", followers: 12000, engagement: 3.5, reach: 89000, growth: 22 },
  { platform: "Pinterest", followers: 23000, engagement: 4.7, reach: 450000, growth: 31 },
  { platform: "Snapchat", followers: 18000, engagement: 7.2, reach: 180000, growth: 25 },
]

const demographicData = [
  {
    ageGroup: "16-24",
    instagram: 35,
    tiktok: 55,
    youtube: 25,
    facebook: 15,
    twitter: 20,
    linkedin: 10,
    pinterest: 25,
    snapchat: 60,
  },
  {
    ageGroup: "25-34",
    instagram: 40,
    tiktok: 30,
    youtube: 45,
    facebook: 30,
    twitter: 40,
    linkedin: 45,
    pinterest: 35,
    snapchat: 25,
  },
  {
    ageGroup: "35-44",
    instagram: 20,
    tiktok: 12,
    youtube: 25,
    facebook: 35,
    twitter: 35,
    linkedin: 35,
    pinterest: 40,
    snapchat: 12,
  },
  {
    ageGroup: "45+",
    instagram: 5,
    tiktok: 3,
    youtube: 5,
    facebook: 20,
    twitter: 5,
    linkedin: 10,
    pinterest: 0,
    snapchat: 3,
  },
]

const trendingHashtags = [
  {
    tag: "#CrealiaAI",
    mentions: 15420,
    growth: "+45%",
    platforms: ["Instagram", "TikTok", "Twitter"],
    niche: "intelligence artificielle",
  },
  {
    tag: "#DigitalMarketing",
    mentions: 12890,
    growth: "+32%",
    platforms: ["LinkedIn", "Twitter", "Facebook"],
    niche: "marketing digital",
  },
  {
    tag: "#ContentCreator",
    mentions: 9870,
    growth: "+28%",
    platforms: ["YouTube", "Instagram", "TikTok"],
    niche: "création de contenu",
  },
  { tag: "#SocialMedia", mentions: 8650, growth: "+22%", platforms: ["All Platforms"], niche: "réseaux sociaux" },
  { tag: "#Innovation", mentions: 7420, growth: "+18%", platforms: ["LinkedIn", "Twitter"], niche: "innovation" },
  { tag: "#Fitness", mentions: 25600, growth: "+55%", platforms: ["Instagram", "TikTok", "YouTube"], niche: "fitness" },
  {
    tag: "#Cooking",
    mentions: 18900,
    growth: "+42%",
    platforms: ["Instagram", "Pinterest", "TikTok"],
    niche: "cuisine",
  },
  {
    tag: "#Travel",
    mentions: 22100,
    growth: "+38%",
    platforms: ["Instagram", "Pinterest", "YouTube"],
    niche: "voyage",
  },
  { tag: "#Fashion", mentions: 31200, growth: "+48%", platforms: ["Instagram", "Pinterest", "TikTok"], niche: "mode" },
  {
    tag: "#Tech",
    mentions: 19800,
    growth: "+35%",
    platforms: ["LinkedIn", "Twitter", "YouTube"],
    niche: "technologie",
  },
  { tag: "#Beauty", mentions: 28400, growth: "+52%", platforms: ["Instagram", "TikTok", "YouTube"], niche: "beauté" },
  { tag: "#Gaming", mentions: 16700, growth: "+29%", platforms: ["YouTube", "TikTok", "Twitter"], niche: "gaming" },
  { tag: "#Music", mentions: 21300, growth: "+41%", platforms: ["TikTok", "Instagram", "YouTube"], niche: "musique" },
  { tag: "#Art", mentions: 14500, growth: "+33%", platforms: ["Instagram", "Pinterest", "TikTok"], niche: "art" },
  {
    tag: "#Photography",
    mentions: 17200,
    growth: "+36%",
    platforms: ["Instagram", "Pinterest", "Flickr"],
    niche: "photographie",
  },
]

const competitorData = [
  {
    name: "Concurrent A",
    followers: 89000,
    engagement: 3.2,
    growth: "+8%",
    strongPlatforms: ["Instagram", "Facebook"],
  },
  {
    name: "Concurrent B",
    followers: 156000,
    engagement: 2.8,
    growth: "+12%",
    strongPlatforms: ["YouTube", "LinkedIn"],
  },
  { name: "Concurrent C", followers: 67000, engagement: 4.1, growth: "+15%", strongPlatforms: ["TikTok", "Snapchat"] },
  { name: "Leader Marché", followers: 340000, engagement: 5.2, growth: "+25%", strongPlatforms: ["All Platforms"] },
]

const aiPredictions = [
  { metric: "Followers", current: 413000, predicted: 520000, confidence: 87, timeframe: "3 mois" },
  { metric: "Engagement", current: 4.2, predicted: 5.8, confidence: 92, timeframe: "2 mois" },
  { metric: "Reach", current: 5950000, predicted: 8200000, confidence: 85, timeframe: "4 mois" },
]

// Dummy data for charts
const followersData = [
  { month: "Jan", instagram: 110000, tiktok: 75000, youtube: 55000, facebook: 40000 },
  { month: "Feb", instagram: 115000, tiktok: 78000, youtube: 58000, facebook: 41000 },
  { month: "Mar", instagram: 120000, tiktok: 82000, youtube: 60000, facebook: 42000 },
  { month: "Apr", instagram: 122000, tiktok: 85000, youtube: 63000, facebook: 43000 },
  { month: "May", instagram: 125000, tiktok: 89000, youtube: 67000, facebook: 45000 },
]

const engagementData = [
  { platform: "Instagram", engagement: 4.2 },
  { platform: "TikTok", engagement: 6.8 },
  { platform: "YouTube", engagement: 5.1 },
  { platform: "Facebook", engagement: 2.1 },
  { platform: "X/Twitter", engagement: 3.8 },
  { platform: "LinkedIn", engagement: 3.5 },
  { platform: "Pinterest", engagement: 4.7 },
  { platform: "Snapchat", engagement: 7.2 },
]

const nicheSuggestions = [
  "fitness",
  "cuisine",
  "voyage",
  "mode",
  "technologie",
  "beauté",
  "gaming",
  "musique",
  "art",
  "photographie",
  "marketing digital",
  "intelligence artificielle",
  "création de contenu",
  "réseaux sociaux",
  "innovation",
  "lifestyle",
  "business",
  "éducation",
  "santé",
  "sport",
  "décoration",
  "diy",
  "nature",
  "animaux",
  "voiture",
]

const contentTypeData = {
  stories: [
    {
      id: 1,
      platform: "Instagram",
      title: "Morning Routine",
      date: "2024-01-15",
      views: 15420,
      likes: 892,
      shares: 156,
      comments: 45,
      reach: 12500,
      impressions: 18900,
    },
    {
      id: 2,
      platform: "Snapchat",
      title: "Behind the Scenes",
      date: "2024-01-14",
      views: 8900,
      likes: 0,
      shares: 234,
      comments: 0,
      reach: 7800,
      impressions: 11200,
    },
    {
      id: 3,
      platform: "Instagram",
      title: "Product Launch",
      date: "2024-01-13",
      views: 22100,
      likes: 1340,
      shares: 289,
      comments: 78,
      reach: 18900,
      impressions: 28500,
    },
    {
      id: 4,
      platform: "Facebook",
      title: "Company Update",
      date: "2024-01-12",
      views: 5600,
      likes: 234,
      shares: 67,
      comments: 23,
      reach: 4500,
      impressions: 7800,
    },
  ],
  posts: [
    {
      id: 1,
      platform: "Instagram",
      title: "New Collection Drop",
      date: "2024-01-15",
      views: 45600,
      likes: 2890,
      shares: 456,
      comments: 189,
      reach: 38900,
      impressions: 67800,
    },
    {
      id: 2,
      platform: "Facebook",
      title: "Customer Testimonial",
      date: "2024-01-14",
      views: 12300,
      likes: 567,
      shares: 123,
      comments: 45,
      reach: 9800,
      impressions: 15600,
    },
    {
      id: 3,
      platform: "LinkedIn",
      title: "Industry Insights",
      date: "2024-01-13",
      views: 8900,
      likes: 234,
      shares: 89,
      comments: 34,
      reach: 7200,
      impressions: 12100,
    },
    {
      id: 4,
      platform: "X/Twitter",
      title: "Quick Update",
      date: "2024-01-12",
      views: 15600,
      likes: 890,
      shares: 234,
      comments: 67,
      reach: 12800,
      impressions: 19400,
    },
  ],
  videos: [
    {
      id: 1,
      platform: "YouTube",
      title: "Tutorial: Getting Started",
      date: "2024-01-15",
      views: 89000,
      likes: 4560,
      shares: 890,
      comments: 234,
      reach: 78900,
      impressions: 125000,
      watchTime: 1250,
    },
    {
      id: 2,
      platform: "Facebook",
      title: "Product Demo",
      date: "2024-01-14",
      views: 23400,
      likes: 1200,
      shares: 345,
      comments: 89,
      reach: 19800,
      impressions: 34500,
      watchTime: 450,
    },
    {
      id: 3,
      platform: "LinkedIn",
      title: "Company Culture",
      date: "2024-01-13",
      views: 12800,
      likes: 567,
      shares: 123,
      comments: 45,
      reach: 10200,
      impressions: 18900,
      watchTime: 280,
    },
  ],
  reels: [
    {
      id: 1,
      platform: "Instagram",
      title: "Quick Tips",
      date: "2024-01-15",
      views: 156000,
      likes: 8900,
      shares: 1200,
      comments: 456,
      reach: 134000,
      impressions: 189000,
    },
    {
      id: 2,
      platform: "Instagram",
      title: "Before & After",
      date: "2024-01-14",
      views: 89000,
      likes: 5600,
      shares: 890,
      comments: 234,
      reach: 76800,
      impressions: 112000,
    },
    {
      id: 3,
      platform: "Facebook",
      title: "Trending Challenge",
      date: "2024-01-13",
      views: 67800,
      likes: 3400,
      shares: 567,
      comments: 189,
      reach: 58900,
      impressions: 89000,
    },
  ],
  shorts: [
    {
      id: 1,
      platform: "YouTube",
      title: "60 Second Tutorial",
      date: "2024-01-15",
      views: 234000,
      likes: 12800,
      shares: 2100,
      comments: 567,
      reach: 198000,
      impressions: 289000,
    },
    {
      id: 2,
      platform: "YouTube",
      title: "Quick Hack",
      date: "2024-01-14",
      views: 145000,
      likes: 8900,
      shares: 1450,
      comments: 345,
      reach: 123000,
      impressions: 178000,
    },
    {
      id: 3,
      platform: "TikTok",
      title: "Viral Trend",
      date: "2024-01-13",
      views: 567000,
      likes: 34500,
      shares: 5600,
      comments: 1200,
      reach: 489000,
      impressions: 678000,
    },
  ],
  carousels: [
    {
      id: 1,
      platform: "Instagram",
      title: "Step by Step Guide",
      date: "2024-01-15",
      views: 34500,
      likes: 1890,
      shares: 234,
      comments: 89,
      reach: 28900,
      impressions: 45600,
    },
    {
      id: 2,
      platform: "LinkedIn",
      title: "Industry Statistics",
      date: "2024-01-14",
      views: 12300,
      likes: 567,
      shares: 123,
      comments: 34,
      reach: 9800,
      impressions: 15600,
    },
    {
      id: 3,
      platform: "Pinterest",
      title: "Design Inspiration",
      date: "2024-01-13",
      views: 23400,
      likes: 890,
      shares: 456,
      comments: 67,
      reach: 19800,
      impressions: 34500,
    },
  ],
}

export function CrealiaAnalyticsInterface({ isOpen, onClose }: CrealiaAnalyticsInterfaceProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [showConnectionInterface, setShowConnectionInterface] = useState(false)
  const [selectedPlatformForConnection, setSelectedPlatformForConnection] = useState<(typeof platforms)[0] | null>(null)
  const [connectionStep, setConnectionStep] = useState(1)
  const [selectedAccountType, setSelectedAccountType] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredHashtags, setFilteredHashtags] = useState(trendingHashtags)

  const [activeContentType, setActiveContentType] = useState("stories")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7days")
  const [selectedContentPlatform, setSelectedContentPlatform] = useState("all")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setFilteredHashtags(trendingHashtags)
    } else {
      const filtered = trendingHashtags.filter(
        (hashtag) =>
          hashtag.niche.toLowerCase().includes(query.toLowerCase()) ||
          hashtag.tag.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredHashtags(filtered)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  if (!isOpen) return null

  const handlePlatformConnection = (platform: (typeof platforms)[0]) => {
    setSelectedPlatformForConnection(platform)
    setShowConnectionInterface(true)
    setConnectionStep(1)
    setSelectedAccountType("")
  }

  const getOAuthUrl = (platformName: string, accountType: string) => {
    const baseUrls = {
      Instagram: "https://api.instagram.com/oauth/authorize",
      Facebook: "https://www.facebook.com/v18.0/dialog/oauth",
      "X/Twitter": "https://twitter.com/i/oauth2/authorize",
      LinkedIn: "https://www.linkedin.com/oauth/v2/authorization",
      YouTube: "https://accounts.google.com/oauth2/auth",
      TikTok: "https://www.tiktok.com/auth/authorize/",
      Pinterest: "https://www.pinterest.com/oauth/",
      Snapchat: "https://accounts.snapchat.com/login/oauth2/authorize",
    }

    const clientIds = {
      Instagram: "your_instagram_client_id",
      Facebook: "your_facebook_app_id",
      "X/Twitter": "your_twitter_client_id",
      LinkedIn: "your_linkedin_client_id",
      YouTube: "your_google_client_id",
      TikTok: "your_tiktok_client_key",
      Pinterest: "your_pinterest_app_id",
      Snapchat: "your_snapchat_client_id",
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
    const baseUrl = baseUrls[platformName as keyof typeof baseUrls]
    const clientId = clientIds[platformName as keyof typeof clientIds]

    // Platform-specific OAuth parameters
    switch (platformName) {
      case "Instagram":
        return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`
      case "Facebook":
        return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights&response_type=code`
      case "X/Twitter":
        return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.read%20users.read%20follows.read%20like.read&state=state&code_challenge=challenge&code_challenge_method=plain`
      case "LinkedIn":
        return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=r_liteprofile%20r_emailaddress%20w_member_social%20r_organization_social`
      case "YouTube":
        return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/youtube.readonly&response_type=code&access_type=offline`
      case "TikTok":
        return `${baseUrl}?client_key=${clientId}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${redirectUri}&state=state`
      case "Pinterest":
        return `${baseUrl}?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&scope=read_public,write_public`
      case "Snapchat":
        return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=snapchat-marketing-api`
      default:
        return baseUrl
    }
  }

  const handleDirectConnection = (platform: (typeof platforms)[0], accountType: string) => {
    const oauthUrl = getOAuthUrl(platform.name, accountType)

    // Open OAuth URL in a popup window
    const popup = window.open(oauthUrl, `${platform.name}_oauth`, "width=600,height=700,scrollbars=yes,resizable=yes")

    // Listen for the popup to close (user completed or cancelled auth)
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        // Simulate successful connection and move to step 3
        setConnectionStep(3)
        // Update platform connection status
        const updatedPlatforms = platforms.map((p) => (p.name === platform.name ? { ...p, connected: true } : p))
        // You could also refresh the platform data here
      }
    }, 1000)
  }

  const renderConnectionInterface = () => {
    if (!selectedPlatformForConnection) return null

    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-2xl mx-4 bg-background border border-border rounded-2xl shadow-2xl">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${selectedPlatformForConnection.color}20` }}
                >
                  {selectedPlatformForConnection.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Connexion {selectedPlatformForConnection.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlatformForConnection.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConnectionInterface(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            {connectionStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Étape 1: Type de Compte</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sélectionnez le type de compte que vous souhaitez connecter
                  </p>
                </div>

                <div className="grid gap-3">
                  {selectedPlatformForConnection.accountTypes.map((type) => (
                    <Card
                      key={type}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedAccountType === type ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedAccountType(type)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            {type === "Personal" && <Users className="w-5 h-5" />}
                            {type === "Business" && <Building className="w-5 h-5" />}
                            {type === "Creator" && <Star className="w-5 h-5" />}
                            {type === "Géré" && <UserCheck className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{type}</div>
                            <div className="text-sm text-muted-foreground">
                              {type === "Personal" && "Compte personnel pour usage privé"}
                              {type === "Business" && "Compte professionnel avec analytics avancés"}
                              {type === "Creator" && "Compte créateur avec outils de monétisation"}
                              {type === "Géré" && "Compte géré par une agence ou équipe"}
                            </div>
                          </div>
                          {selectedAccountType === type && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowConnectionInterface(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setConnectionStep(2)} disabled={!selectedAccountType}>
                    Continuer
                  </Button>
                </div>
              </div>
            )}

            {connectionStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Étape 2: Méthode de Connexion</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choisissez la méthode de connexion pour votre compte {selectedAccountType}
                  </p>
                </div>

                <div className="grid gap-3">
                  {selectedPlatformForConnection.connectionMethods.map((method, index) => (
                    <Card
                      key={method}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => handleDirectConnection(selectedPlatformForConnection, selectedAccountType)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Link className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{method}</div>
                            <div className="text-sm text-muted-foreground">
                              Connexion directe sécurisée via {selectedPlatformForConnection.name}
                            </div>
                          </div>
                          <Badge variant="outline">Connexion Directe</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Connexion Sécurisée OAuth</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vous serez redirigé vers {selectedPlatformForConnection.name} pour vous connecter en toute
                          sécurité. Nous ne stockons jamais vos identifiants.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setConnectionStep(1)}>
                    Retour
                  </Button>
                  <Button
                    onClick={() => handleDirectConnection(selectedPlatformForConnection, selectedAccountType)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Se Connecter à {selectedPlatformForConnection.name}
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced connection handler with better OAuth flow and success feedback */}
            {connectionStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Étape 3: Connexion Réussie</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Votre compte {selectedPlatformForConnection.name} ({selectedAccountType}) est maintenant connecté
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedPlatformForConnection.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">{permission}</div>
                          <div className="text-xs text-muted-foreground">Permission accordée avec succès</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Activé
                      </Badge>
                    </div>
                  ))}
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-green-800">Connexion Établie!</div>
                        <div className="text-xs text-green-600 mt-1">
                          Votre compte {selectedPlatformForConnection.name} est maintenant synchronisé avec Créalia
                          Analytics. Les données seront mises à jour automatiquement.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedPlatformForConnection.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers Synchronisés</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedPlatformForConnection.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts Analysés</div>
                  </Card>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setConnectionStep(2)}>
                    Retour
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowConnectionInterface(false)
                        // Optionally switch to analytics tab to show new data
                      }}
                    >
                      Voir les Analytics
                    </Button>
                    <Button
                      onClick={() => setShowConnectionInterface(false)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Terminer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-[98vw] h-[98vh] mx-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-border/20 bg-background">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <BarChart3 className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary">Créalia Analytics Pro</h2>
                <p className="text-sm text-muted-foreground">
                  Plateforme d'analyse multi-réseaux sociaux avancée avec IA - 8 Plateformes Connectées
                </p>
              </div>
              <div className="flex items-center gap-6 ml-8">
                <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                  <div className="text-2xl font-bold text-foreground">413K</div>
                  <div className="text-xs text-muted-foreground">Total Followers</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                  <div className="text-2xl font-bold text-foreground">4.8%</div>
                  <div className="text-xs text-muted-foreground">Avg Engagement</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">+19%</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                  <div className="text-2xl font-bold text-foreground">5.95M</div>
                  <div className="text-xs text-muted-foreground">Total Reach</div>
                </div>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex border-b border-border/20 bg-background px-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "connections", label: "Connections", icon: Zap },
              { id: "realtime", label: "Realtime", icon: Clock },
              { id: "analytics", label: "Analytics", icon: Brain },
              { id: "content-analysis", label: "Analyse Contenu", icon: Target }, // Updated trends tab to content analysis
              { id: "trends", label: "Trends", icon: TrendingUp }, // Added new trends tab
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-6">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Platform Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {platforms.slice(0, 4).map((platform) => (
                      <Card key={platform.name} className="border border-border/20 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform.icon}</span>
                              <span className="font-medium text-sm text-foreground">{platform.name}</span>
                            </div>
                            <div
                              className={`w-2 h-2 rounded-full ${platform.connected ? "bg-green-500" : "bg-red-500"}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Followers</span>
                              <span className="font-medium text-foreground">{platform.followers}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Engagement</span>
                              <span className="font-medium text-foreground">{platform.engagement}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Posts</span>
                              <span className="font-medium text-foreground">{platform.posts}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {platforms.slice(4, 8).map((platform) => (
                      <Card key={platform.name} className="border border-border/20 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform.icon}</span>
                              <span className="font-medium text-sm text-foreground">{platform.name}</span>
                            </div>
                            <div
                              className={`w-2 h-2 rounded-full ${platform.connected ? "bg-green-500" : "bg-red-500"}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Followers</span>
                              <span className="font-medium text-foreground">{platform.followers}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Engagement</span>
                              <span className="font-medium text-foreground">{platform.engagement}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Posts</span>
                              <span className="font-medium text-foreground">{platform.posts}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                      <div className="text-2xl font-bold text-foreground">8</div>
                      <div className="text-xs text-muted-foreground">Plateformes</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                      <div className="text-2xl font-bold text-foreground">1.2M</div>
                      <div className="text-xs text-muted-foreground">Total Followers</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                      <div className="text-2xl font-bold text-foreground">4.8%</div>
                      <div className="text-xs text-muted-foreground">Avg Engagement</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                      <div className="text-2xl font-bold text-foreground">892</div>
                      <div className="text-xs text-muted-foreground">Total Posts</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance par Plateforme</CardTitle>
                        <CardDescription>Comparaison des métriques clés</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={performanceComparison}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="platform" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="engagement" fill="#8884d8" name="Engagement %" />
                            <Bar dataKey="growth" fill="#82ca9d" name="Croissance %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Répartition de l'Audience</CardTitle>
                        <CardDescription>Distribution des followers par plateforme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={performanceComparison}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="followers"
                              label={({ platform, followers }) => `${platform}: ${followers.toLocaleString()}`}
                            >
                              {performanceComparison.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={platforms.find((p) => p.name === entry.platform)?.color || "#8884d8"}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "connections" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Gestion des Plateformes</h3>
                      <p className="text-muted-foreground">Connectez et gérez vos comptes sur 8 plateformes sociales</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une Plateforme
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {platforms.map((platform) => (
                      <Card key={platform.name} className="border border-border/20 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{platform.icon}</span>
                              <div>
                                <h3 className="font-semibold text-foreground">{platform.name}</h3>
                                <p className="text-sm text-muted-foreground">{platform.followers} followers</p>
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                platform.connected
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {platform.connected ? "Connecté" : "Déconnecté"}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Engagement</span>
                              <span className="text-sm font-medium text-foreground">{platform.engagement}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Posts totaux</span>
                              <span className="text-sm font-medium text-foreground">{platform.posts}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Gérer la connexion</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handlePlatformConnection(platform)}>
                              {platform.connected ? "Gérer" : "Connecter"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "realtime" && (
                <div className="space-y-6 mt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Monitoring Temps Réel</h3>
                      <p className="text-muted-foreground">
                        Surveillance en direct de vos performances sur toutes les 8 plateformes
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
                        <span className="text-sm">Temps réel</span>
                      </div>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualiser
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {platforms.map((platform) => (
                      <Card key={platform.name} className="relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 w-full h-1"
                          style={{ backgroundColor: platform.color }}
                        ></div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{platform.icon}</span>
                            <span className="font-medium text-sm">{platform.name}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Engagement</span>
                              <span className="font-medium text-green-600">{platform.engagement}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Croissance</span>
                              <span className="font-medium text-blue-600">{platform.growth}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Status</span>
                              <Badge variant="outline" className="text-xs h-4">
                                {platform.status === "active" ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activité en Temps Réel - Toutes Plateformes</CardTitle>
                      <CardDescription>Dernières 30 minutes - 8 plateformes connectées</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="instagram" stroke="#E4405F" name="Instagram" />
                          <Line type="monotone" dataKey="tiktok" stroke="#000000" name="TikTok" />
                          <Line type="monotone" dataKey="youtube" stroke="#FF0000" name="YouTube" />
                          <Line type="monotone" dataKey="facebook" stroke="#1877F2" name="Facebook" />
                          <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" name="X/Twitter" />
                          <Line type="monotone" dataKey="linkedin" stroke="#0A66C2" name="LinkedIn" />
                          <Line type="monotone" dataKey="pinterest" stroke="#BD081C" name="Pinterest" />
                          <Line type="monotone" dataKey="snapchat" stroke="#F7D917" name="Snapchat" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-background to-slate-50/30 border border-slate-200/50">
                    <CardHeader className="bg-gradient-to-r from-primary/8 to-primary/5 border-b border-primary/15">
                      <CardTitle className="text-primary">Métriques Détaillées par Plateforme</CardTitle>
                      <CardDescription className="text-slate-600">
                        Vue d'ensemble des performances en temps réel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 hover:from-slate-100 hover:to-slate-50 border-b border-slate-200/60">
                            <TableHead className="font-semibold text-slate-700 py-4">Plateforme</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Followers</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Engagement</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Croissance</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Dernière Sync</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {platforms.map((platform, index) => (
                            <TableRow
                              key={platform.name}
                              className={`
                                ${index % 2 === 0 ? "bg-white/80" : "bg-slate-50/50"}
                                hover:bg-primary/3 transition-all duration-200 border-b border-slate-100/80
                              `}
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                                    style={{
                                      backgroundColor: `${platform.color}20`,
                                      border: `1px solid ${platform.color}30`,
                                    }}
                                  >
                                    {platform.icon}
                                  </div>
                                  <span className="font-medium text-slate-800">{platform.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold text-slate-800 py-4">{platform.followers}</TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80 shadow-sm"
                                >
                                  {platform.engagement}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50/80 text-blue-700 border-blue-200/80 hover:bg-blue-100/80 shadow-sm"
                                >
                                  {platform.growth}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-600 py-4 font-medium">{platform.lastSync}</TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant={platform.connected ? "default" : "secondary"}
                                  className={
                                    platform.connected
                                      ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }
                                >
                                  {platform.connected ? "Connecté" : "Déconnecté"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-2xl font-bold">Analytics Avancés</h3>
                    <p className="text-muted-foreground">Analyses approfondies et insights IA pour les 8 plateformes</p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {platforms.map((platform) => (
                      <Card key={platform.name} className="relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 w-full h-1"
                          style={{ backgroundColor: platform.color }}
                        ></div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{platform.icon}</span>
                            <CardTitle className="text-sm">{platform.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Followers:</span>
                              <span className="font-medium">{platform.followers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Engagement:</span>
                              <span className="font-medium text-green-600">{platform.engagement}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Croissance:</span>
                              <span className="font-medium text-blue-600">{platform.growth}</span>
                            </div>

                            {/* Platform-specific detailed metrics */}
                            {platform.name === "Instagram" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Reach:</span>
                                  <span className="font-medium">{(platform.metrics.reach / 1000).toFixed(0)}K</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Saves:</span>
                                  <span className="font-medium">{platform.metrics.saves?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Profile Visits:</span>
                                  <span className="font-medium">
                                    {platform.metrics.profileVisits?.toLocaleString()}
                                  </span>
                                </div>
                              </>
                            )}

                            {platform.name === "TikTok" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Completion Rate:</span>
                                  <span className="font-medium">{platform.metrics.completionRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg Watch Time:</span>
                                  <span className="font-medium">{platform.metrics.averageWatchTime}s</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Virality Score:</span>
                                  <span className="font-medium">{platform.metrics.viralityScore}/10</span>
                                </div>
                              </>
                            )}

                            {platform.name === "YouTube" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">CTR:</span>
                                  <span className="font-medium">{platform.metrics.ctr}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Retention:</span>
                                  <span className="font-medium">{platform.metrics.retention}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg Duration:</span>
                                  <span className="font-medium">{platform.metrics.averageViewDuration}min</span>
                                </div>
                              </>
                            )}

                            {platform.name === "Facebook" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Page Views:</span>
                                  <span className="font-medium">{platform.metrics.pageViews?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Link Clicks:</span>
                                  <span className="font-medium">{platform.metrics.linkClicks?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Video Retention:</span>
                                  <span className="font-medium">{platform.metrics.videoRetention}%</span>
                                </div>
                              </>
                            )}

                            {platform.name === "X/Twitter" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Profile Visits:</span>
                                  <span className="font-medium">
                                    {platform.metrics.profileVisits?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Link Clicks:</span>
                                  <span className="font-medium">{platform.metrics.linkClicks?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Quote Tweets:</span>
                                  <span className="font-medium">{platform.metrics.quoteTweets?.toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            {platform.name === "LinkedIn" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">CTR:</span>
                                  <span className="font-medium">{platform.metrics.clickThroughRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Social Actions:</span>
                                  <span className="font-medium">
                                    {platform.metrics.socialActions?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Video Views:</span>
                                  <span className="font-medium">{platform.metrics.videoViews?.toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            {platform.name === "Pinterest" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Outbound Clicks:</span>
                                  <span className="font-medium">
                                    {platform.metrics.outboundClicks?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Close-ups:</span>
                                  <span className="font-medium">{platform.metrics.closeUps?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Video Views:</span>
                                  <span className="font-medium">{platform.metrics.videoViews?.toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            {platform.name === "Snapchat" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Story Completion:</span>
                                  <span className="font-medium">{platform.metrics.storyCompletionRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Lens Views:</span>
                                  <span className="font-medium">{platform.metrics.lensViews?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Screenshots:</span>
                                  <span className="font-medium">{platform.metrics.screenshots?.toLocaleString()}</span>
                                </div>
                              </>
                            )}

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Meilleur contenu:</span>
                              <span className="font-medium text-xs">{platform.topContent}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-br from-background to-slate-50/30 border border-slate-200/50">
                    <CardHeader className="bg-gradient-to-r from-primary/8 to-primary/5 border-b border-primary/15">
                      <CardTitle className="text-primary">Métriques Détaillées par Plateforme</CardTitle>
                      <CardDescription className="text-slate-600">
                        Vue complète des performances avec métriques spécifiques à chaque plateforme
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 hover:from-slate-100 hover:to-slate-50 border-b border-slate-200/60">
                            <TableHead className="font-semibold text-slate-700 py-4">Plateforme</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Engagement</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Reach/Impressions</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Interactions</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Métriques Avancées</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Performance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {platforms.map((platform, index) => (
                            <TableRow
                              key={platform.name}
                              className={`
                                ${index % 2 === 0 ? "bg-white/80" : "bg-slate-50/50"}
                                hover:bg-primary/3 transition-all duration-200 border-b border-slate-100/80
                              `}
                            >
                              <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                                    style={{
                                      backgroundColor: `${platform.color}20`,
                                      border: `1px solid ${platform.color}30`,
                                    }}
                                  >
                                    {platform.icon}
                                  </div>
                                  <span className="font-medium text-slate-800">{platform.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-slate-800">{platform.engagement}</div>
                                  <div className="text-xs text-slate-600">
                                    {platform.metrics.likes?.toLocaleString()} likes
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-slate-800">
                                    {platform.metrics.reach
                                      ? `${(platform.metrics.reach / 1000).toFixed(0)}K reach`
                                      : `${(platform.metrics.impressions / 1000).toFixed(0)}K imp.`}
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    {platform.metrics.views
                                      ? `${(platform.metrics.views / 1000).toFixed(0)}K vues`
                                      : "N/A"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-slate-800">
                                    {platform.metrics.comments?.toLocaleString()} commentaires
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    {platform.metrics.shares?.toLocaleString() ||
                                      platform.metrics.retweets?.toLocaleString() ||
                                      platform.metrics.saves?.toLocaleString() ||
                                      "0"}{" "}
                                    partages
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex flex-wrap gap-1">
                                  {platform.name === "Instagram" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-pink-50/80 text-pink-700 border-pink-200/80 text-xs"
                                      >
                                        Saves: {platform.metrics.saves?.toLocaleString()}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-50/80 text-purple-700 border-purple-200/80 text-xs"
                                      >
                                        Profile: {platform.metrics.profileVisits?.toLocaleString()}
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "TikTok" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-50/80 text-purple-700 border-purple-200/80 text-xs"
                                      >
                                        Completion: {platform.metrics.completionRate}%
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-indigo-50/80 text-indigo-700 border-indigo-200/80 text-xs"
                                      >
                                        Virality: {platform.metrics.viralityScore}/10
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "YouTube" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-red-50/80 text-red-700 border-red-200/80 text-xs"
                                      >
                                        CTR: {platform.metrics.ctr}%
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-orange-50/80 text-orange-700 border-orange-200/80 text-xs"
                                      >
                                        Retention: {platform.metrics.retention}%
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "Facebook" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50/80 text-blue-700 border-blue-200/80 text-xs"
                                      >
                                        Page Views: {platform.metrics.pageViews?.toLocaleString()}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-cyan-50/80 text-cyan-700 border-cyan-200/80 text-xs"
                                      >
                                        Video Ret.: {platform.metrics.videoRetention}%
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "X/Twitter" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-sky-50/80 text-sky-700 border-sky-200/80 text-xs"
                                      >
                                        Profile: {platform.metrics.profileVisits?.toLocaleString()}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50/80 text-blue-700 border-blue-200/80 text-xs"
                                      >
                                        Quotes: {platform.metrics.quoteTweets?.toLocaleString()}
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "LinkedIn" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-indigo-50/80 text-indigo-700 border-indigo-200/80 text-xs"
                                      >
                                        CTR: {platform.metrics.clickThroughRate}%
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50/80 text-blue-700 border-blue-200/80 text-xs"
                                      >
                                        Video: {platform.metrics.videoViews?.toLocaleString()}
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "Pinterest" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-rose-50/80 text-rose-700 border-rose-200/80 text-xs"
                                      >
                                        Outbound: {platform.metrics.outboundClicks?.toLocaleString()}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-pink-50/80 text-pink-700 border-pink-200/80 text-xs"
                                      >
                                        Close-ups: {platform.metrics.closeUps?.toLocaleString()}
                                      </Badge>
                                    </>
                                  )}
                                  {platform.name === "Snapchat" && (
                                    <>
                                      <Badge
                                        variant="outline"
                                        className="bg-yellow-50/80 text-yellow-700 border-yellow-200/80 text-xs"
                                      >
                                        Story Comp.: {platform.metrics.storyCompletionRate}%
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-50/80 text-amber-700 border-amber-200/80 text-xs"
                                      >
                                        Lens: {platform.metrics.lensViews?.toLocaleString()}
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      platform.growth &&
                                      Number.parseFloat(platform.growth.replace("%", "").replace("+", "")) > 20
                                        ? "bg-green-100 text-green-700"
                                        : platform.growth &&
                                            Number.parseFloat(platform.growth.replace("%", "").replace("+", "")) > 10
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {platform.growth || "N/A"}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Analyse Démographique - Toutes Plateformes</CardTitle>
                        <CardDescription>Répartition par âge sur les 8 plateformes connectées</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={demographicData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                              dataKey="ageGroup"
                              tick={{ fill: "#64748b", fontSize: 12 }}
                              axisLine={{ stroke: "#e2e8f0" }}
                            />
                            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#e2e8f0" }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
                            <Bar dataKey="instagram" fill="#E4405F" name="Instagram" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="tiktok" fill="#25F4EE" name="TikTok" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="youtube" fill="#FF0000" name="YouTube" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="facebook" fill="#1877F2" name="Facebook" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="twitter" fill="#1DA1F2" name="X/Twitter" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="linkedin" fill="#0A66C2" name="LinkedIn" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="pinterest" fill="#BD081C" name="Pinterest" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="snapchat" fill="#F7D917" name="Snapchat" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Prédictions IA</CardTitle>
                        <CardDescription>Projections basées sur l'intelligence artificielle</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiPredictions.map((prediction) => (
                            <div key={prediction.metric} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{prediction.metric}</span>
                                <Badge variant="outline">{prediction.confidence}% confiance</Badge>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Actuel: {prediction.current.toLocaleString()}</span>
                                <span>Prévu: {prediction.predicted.toLocaleString()}</span>
                              </div>
                              <Progress value={prediction.confidence} className="h-2" />
                              <div className="text-xs text-muted-foreground">Échéance: {prediction.timeframe}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "content-analysis" && (
                <div className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-2xl font-bold">Analyse par Type de Contenu</h3>
                    <p className="text-muted-foreground">
                      Analyse détaillée des performances par type de contenu sur toutes les plateformes
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Période:</span>
                        <select
                          value={selectedTimeRange}
                          onChange={(e) => setSelectedTimeRange(e.target.value)}
                          className="px-3 py-1 border border-border rounded-lg text-sm bg-background"
                        >
                          <option value="7days">7 derniers jours</option>
                          <option value="30days">30 derniers jours</option>
                          <option value="90days">3 derniers mois</option>
                          <option value="custom">Période personnalisée</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Plateforme:</span>
                        <select
                          value={selectedContentPlatform}
                          onChange={(e) => setSelectedContentPlatform(e.target.value)}
                          className="px-3 py-1 border border-border rounded-lg text-sm bg-background"
                        >
                          <option value="all">Toutes les plateformes</option>
                          {platforms.map((platform) => (
                            <option key={platform.name} value={platform.name}>
                              {platform.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Analyse
                    </Button>
                  </div>

                  <div className="flex border-b border-border/20 bg-background">
                    {[
                      { id: "stories", label: "Stories", count: contentTypeData.stories.length },
                      { id: "posts", label: "Posts", count: contentTypeData.posts.length },
                      { id: "videos", label: "Vidéos", count: contentTypeData.videos.length },
                      { id: "reels", label: "Reels", count: contentTypeData.reels.length },
                      { id: "shorts", label: "Shorts", count: contentTypeData.shorts.length },
                      { id: "carousels", label: "Carrousels", count: contentTypeData.carousels.length },
                    ].map((contentTab) => (
                      <button
                        key={contentTab.id}
                        onClick={() => setActiveContentType(contentTab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                          activeContentType === contentTab.id
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{contentTab.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            {contentTab.count}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {(() => {
                      const currentData = contentTypeData[activeContentType as keyof typeof contentTypeData]
                      const totalViews = currentData.reduce((sum, item) => sum + item.views, 0)
                      const totalLikes = currentData.reduce((sum, item) => sum + item.likes, 0)
                      const totalShares = currentData.reduce((sum, item) => sum + item.shares, 0)
                      const totalComments = currentData.reduce((sum, item) => sum + item.comments, 0)
                      const avgEngagement =
                        currentData.length > 0
                          ? (((totalLikes + totalShares + totalComments) / totalViews) * 100).toFixed(2)
                          : "0"

                      return (
                        <>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-primary">{totalViews.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Total Vues</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-green-600">{totalLikes.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Total Likes</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-blue-600">{totalShares.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Total Partages</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-2xl font-bold text-purple-600">{avgEngagement}%</div>
                              <div className="text-sm text-muted-foreground">Engagement Moyen</div>
                            </CardContent>
                          </Card>
                        </>
                      )
                    })()}
                  </div>

                  <Card className="bg-gradient-to-br from-background to-slate-50/30 border border-slate-200/50">
                    <CardHeader className="bg-gradient-to-r from-primary/8 to-primary/5 border-b border-primary/15">
                      <CardTitle className="text-primary capitalize">Analyse Détaillée - {activeContentType}</CardTitle>
                      <CardDescription className="text-slate-600">
                        Performances individuelles avec métriques complètes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 hover:from-slate-100 hover:to-slate-50 border-b border-slate-200/60">
                            <TableHead className="font-semibold text-slate-700 py-4">Contenu</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Plateforme</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Vues</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Likes</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Partages</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Commentaires</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Engagement</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contentTypeData[activeContentType as keyof typeof contentTypeData]
                            .filter(
                              (item) => selectedContentPlatform === "all" || item.platform === selectedContentPlatform,
                            )
                            .map((item, index) => {
                              const engagement = (
                                ((item.likes + item.shares + item.comments) / item.views) *
                                100
                              ).toFixed(2)
                              const platform = platforms.find((p) => p.name === item.platform)

                              return (
                                <TableRow
                                  key={item.id}
                                  className={`
                                    ${index % 2 === 0 ? "bg-white/80" : "bg-slate-50/50"}
                                    hover:bg-primary/3 transition-all duration-200 border-b border-slate-100/80
                                  `}
                                >
                                  <TableCell className="py-4">
                                    <div className="font-medium text-slate-800 max-w-[200px] truncate">
                                      {item.title}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                                        style={{
                                          backgroundColor: `${platform?.color}20`,
                                          border: `1px solid ${platform?.color}30`,
                                        }}
                                      >
                                        {platform?.icon}
                                      </div>
                                      <span className="text-sm font-medium">{item.platform}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-slate-600 py-4 text-sm">
                                    {new Date(item.date).toLocaleDateString("fr-FR")}
                                  </TableCell>
                                  <TableCell className="font-semibold text-slate-800 py-4">
                                    {item.views.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="font-semibold text-slate-800 py-4">
                                    {item.likes.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="font-semibold text-slate-800 py-4">
                                    {item.shares.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="font-semibold text-slate-800 py-4">
                                    {item.comments.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <Badge
                                      variant="outline"
                                      className={`
                                        ${
                                          Number.parseFloat(engagement) > 5
                                            ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/80"
                                            : Number.parseFloat(engagement) > 2
                                              ? "bg-yellow-50/80 text-yellow-700 border-yellow-200/80"
                                              : "bg-red-50/80 text-red-700 border-red-200/80"
                                        } shadow-sm
                                      `}
                                    >
                                      {engagement}%
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance par Plateforme - {activeContentType}</CardTitle>
                        <CardDescription>Comparaison des métriques moyennes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={(() => {
                              const currentData = contentTypeData[activeContentType as keyof typeof contentTypeData]
                              const platformStats = platforms
                                .map((platform) => {
                                  const platformContent = currentData.filter((item) => item.platform === platform.name)
                                  const avgViews =
                                    platformContent.length > 0
                                      ? Math.round(
                                          platformContent.reduce((sum, item) => sum + item.views, 0) /
                                            platformContent.length,
                                        )
                                      : 0
                                  const avgEngagement =
                                    platformContent.length > 0
                                      ? Number.parseFloat(
                                          (
                                            (platformContent.reduce(
                                              (sum, item) => sum + item.likes + item.shares + item.comments,
                                              0,
                                            ) /
                                              platformContent.reduce((sum, item) => sum + item.views, 0)) *
                                            100
                                          ).toFixed(2),
                                        )
                                      : 0

                                  return {
                                    platform: platform.name,
                                    avgViews,
                                    avgEngagement,
                                    count: platformContent.length,
                                  }
                                })
                                .filter((stat) => stat.count > 0)

                              return platformStats
                            })()}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                              dataKey="platform"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="avgEngagement" fill="#8884d8" name="Engagement Moyen (%)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Évolution Temporelle</CardTitle>
                        <CardDescription>Performance dans le temps</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={(() => {
                              const currentData = contentTypeData[activeContentType as keyof typeof contentTypeData]
                              return currentData
                                .map((item) => ({
                                  date: new Date(item.date).toLocaleDateString("fr-FR", {
                                    month: "short",
                                    day: "numeric",
                                  }),
                                  views: item.views,
                                  engagement: (((item.likes + item.shares + item.comments) / item.views) * 100).toFixed(
                                    2,
                                  ),
                                }))
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            })()}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="views" stroke="#8884d8" name="Vues" />
                            <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement (%)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "trends" && (
                <div className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-2xl font-bold">Tendances et Hashtags</h3>
                    <p className="text-muted-foreground">Analyse des tendances et hashtags populaires par niche</p>
                  </div>

                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Search className="w-5 h-5" />
                        Recherche de Hashtags par Niche
                      </CardTitle>
                      <CardDescription>Trouvez les hashtags tendance dans votre domaine d'activité</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Rechercher une niche (ex: fitness, cuisine, mode...)"
                            value={searchQuery}
                            onChange={(e) => {
                              handleSearch(e.target.value)
                              setShowSuggestions(e.target.value.length > 0)
                            }}
                            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="pl-10 pr-4 py-3 text-base border-2 border-primary/20 focus:border-primary/40 rounded-xl bg-white/80 backdrop-blur-sm"
                          />
                          <TrendingUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                        </div>

                        {showSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                            <div className="p-2">
                              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                Suggestions populaires
                              </div>
                              {nicheSuggestions
                                .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
                                .slice(0, 8)
                                .map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 rounded-lg transition-colors capitalize"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={searchQuery === "" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSearchQuery("")
                            setFilteredHashtags(trendingHashtags)
                          }}
                          className="rounded-full"
                        >
                          Tous
                        </Button>
                        {["fitness", "cuisine", "mode", "technologie", "beauté"].map((niche) => (
                          <Button
                            key={niche}
                            variant={searchQuery === niche ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSuggestionClick(niche)}
                            className="rounded-full capitalize"
                          >
                            {niche}
                          </Button>
                        ))}
                      </div>

                      {searchQuery && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Search className="w-4 h-4" />
                          <span>
                            {filteredHashtags.length} hashtag{filteredHashtags.length > 1 ? "s" : ""} trouvé
                            {filteredHashtags.length > 1 ? "s" : ""} pour "{searchQuery}"
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-background to-slate-50/30 border border-slate-200/50">
                    <CardHeader className="bg-gradient-to-r from-primary/8 to-primary/5 border-b border-primary/15">
                      <CardTitle className="text-primary">
                        {searchQuery ? `Hashtags Tendance - ${searchQuery}` : "Hashtags Tendance"}
                      </CardTitle>
                      <CardDescription className="text-slate-600">
                        {searchQuery ? `Résultats filtrés par niche` : "Top hashtags avec croissance"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 hover:from-slate-100 hover:to-slate-50 border-b border-slate-200/60">
                            <TableHead className="font-semibold text-slate-700 py-4">Hashtag</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Niche</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Mentions</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Croissance</TableHead>
                            <TableHead className="font-semibold text-slate-700 py-4">Plateformes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredHashtags.length > 0 ? (
                            filteredHashtags.map((hashtag, index) => (
                              <TableRow
                                key={hashtag.tag}
                                className={`
                                  ${index % 2 === 0 ? "bg-white/80" : "bg-slate-50/50"}
                                  hover:bg-primary/3 transition-all duration-200 border-b border-slate-100/80
                                `}
                              >
                                <TableCell className="font-semibold text-primary py-4 text-base">
                                  {hashtag.tag}
                                </TableCell>
                                <TableCell className="py-4">
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50/80 text-purple-700 border-purple-200/80 hover:bg-purple-100/80 shadow-sm capitalize"
                                  >
                                    {hashtag.niche}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-slate-800 py-4">
                                  {hashtag.mentions.toLocaleString()}
                                </TableCell>
                                <TableCell className="py-4">
                                  <Badge
                                    variant="outline"
                                    className="bg-emerald-50/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80 shadow-sm"
                                  >
                                    {hashtag.growth}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex gap-1 flex-wrap">
                                    {hashtag.platforms.slice(0, 3).map((platform) => (
                                      <Badge
                                        key={platform}
                                        variant="secondary"
                                        className="text-xs bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border border-slate-200/50 shadow-sm"
                                      >
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                  <Search className="w-8 h-8 text-muted-foreground/50" />
                                  <span>Aucun hashtag trouvé pour "{searchQuery}"</span>
                                  <span className="text-sm">Essayez avec d'autres termes de recherche</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-border/20 bg-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-primary">
                  Créalia Analytics Pro - Système d'Analyse IA Révolutionnaire
                </p>
                <p className="text-sm text-muted-foreground">
                  Plateforme la plus avancée du marché avec prédictions IA, analyse comportementale et monitoring temps
                  réel
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Exporter Données
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Clock className="w-4 h-4" />
                  Programmer Rapport
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-lg">
                  <Zap className="w-4 h-4" />
                  Analyse Complète IA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConnectionInterface && renderConnectionInterface()}
    </>
  )
}
