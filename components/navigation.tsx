"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CrealiaLogo } from "@/components/crealia-logo"
import { CrealiaAIInterface } from "@/components/crealia-ai-interface"
import { SignupModal } from "@/components/signup-modal"
import { cn } from "@/lib/utils"
import { PricingModal } from "@/components/pricing-modal"

const AIBrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Circuit neural moderne */}
    <circle cx="12" cy="8" r="2" fill="url(#aiGradient)" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="10" cy="16" r="1.2" fill="currentColor" opacity="0.4" />
    <circle cx="14" cy="16" r="1.2" fill="currentColor" opacity="0.4" />

    {/* Connexions élégantes */}
    <path
      d="M12 10 L8 12 M12 10 L16 12 M8 12 L10 16 M16 12 L14 16"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
      strokeDasharray="2,2"
    />

    {/* Aura moderne */}
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.2"
      strokeDasharray="4,4"
    />
  </svg>
)

const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="23 7 16 12 23 17 23 7" />
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
    />
  </svg>
)

const BarChart3Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-5 5-4-4-3 3" />
  </svg>
)

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21h6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3a6 6 0 0 0-6 6c0 1 .2 2 .6 2.8L8 15h8l1.4-3.2c.4-.8.6-1.8.6-2.8a6 6 0 0 0-6-6Z"
    />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="11" cy="11" r="8" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35" />
  </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="7" r="4" />
  </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="12" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v6m0 6v6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 12-6 0m-6 0-6 0" />
  </svg>
)

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="4" x2="20" y1="6" y2="6" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="4" x2="20" y1="12" y2="12" />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6 6 18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12" />
  </svg>
)

const HelpCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01" />
  </svg>
)

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      x="1"
      y="4"
      width="22"
      height="16"
      rx="2"
      ry="2"
    />
    <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="1" x2="23" y1="10" y2="10" />
  </svg>
)

const navigation = [
  { name: "Créalia AI", href: "#", icon: AIBrainIcon, current: true },
  { name: "Créalia Analytics", href: "#", icon: BarChart3Icon, current: false },
  { name: "Inspiration", href: "#", icon: LightbulbIcon, current: false },
  { name: "FAQ", href: "#", icon: HelpCircleIcon, current: false },
  { name: "Pricing", href: "#", icon: CreditCardIcon, current: false },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiInterfaceOpen, setAiInterfaceOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)

  const handleNavigationClick = (item: (typeof navigation)[0]) => {
    if (item.name === "Créalia AI") {
      setAiInterfaceOpen(true)
    }
    if (item.name === "Pricing") {
      setPricingModalOpen(true)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 nav-modern">
        <div className="container-modern">
          <div className="flex items-center h-20">
            {/* Left section - Logo */}
            <div className="flex-1 flex justify-start animate-fade-in">
              <CrealiaLogo />
            </div>

            {/* Center section - Navigation links */}
            <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
              {navigation.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 animate-fade-in whitespace-nowrap",
                    item.current
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name !== "Créalia AI" && <item.icon className="w-4 h-4" />}
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right section - Auth buttons */}
            <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-secondary/80 rounded-full animate-fade-in text-muted-foreground hover:text-foreground"
                style={{ animationDelay: "0.4s" }}
              >
                Se connecter
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full animate-fade-in shadow-lg px-6 py-2.5 h-auto text-sm font-medium"
                style={{ animationDelay: "0.5s" }}
                onClick={() => setSignupModalOpen(true)}
              >
                Essayer Gratuitement
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden ml-auto">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden glass-modern border-t border-border/50 animate-slide-up">
            <div className="container-modern py-6 space-y-3">
              {navigation.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigationClick(item)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 animate-slide-up whitespace-nowrap w-full text-left",
                    item.current
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name !== "Créalia AI" && <item.icon className="w-5 h-5" />}
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CrealiaAIInterface isOpen={aiInterfaceOpen} onClose={() => setAiInterfaceOpen(false)} />
      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
      <PricingModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />
    </>
  )
}
