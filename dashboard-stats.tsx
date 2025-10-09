import { Card } from "@/components/ui/card"

const VideoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const ZapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const stats = [
  {
    name: "Reels créés",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: VideoIcon,
  },
  {
    name: "Vues totales",
    value: "1.2M",
    change: "+18%",
    changeType: "positive",
    icon: TrendingUpIcon,
  },
  {
    name: "Abonnés gagnés",
    value: "12,847",
    change: "+8%",
    changeType: "positive",
    icon: UsersIcon,
  },
  {
    name: "Score IA",
    value: "94/100",
    change: "+5%",
    changeType: "positive",
    icon: ZapIcon,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className="p-6 glass border-border/50 hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-sm text-accent font-medium mt-1">{stat.change}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <stat.icon />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
