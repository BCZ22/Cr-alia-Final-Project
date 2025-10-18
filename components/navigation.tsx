"use client"

import { useState } from "react"
import { CrealiaLogo } from "@/components/crealia-logo"
import { SignupModal } from "@/components/signup-modal"
import { PricingModal } from "@/components/pricing-modal"
import { CrealiaAIInterface } from "@/components/crealia-ai-interface"
import { CrealiaStudioInterface } from "@/components/crealia-studio-interface"
import { CrealiaAnalyticsInterface } from "@/components/crealia-analytics-interface"
import { CrealiaInspirationInterface } from "@/components/crealia-inspiration-interface"
import { CrealiaFAQInterface } from "@/components/crealia-faq-interface"

const navigation = [
  { name: "Créalia AI", href: "#" },
  { name: "Créalia Studio", href: "#" },
  { name: "Créalia Analytics", href: "#" },
  { name: "Inspiration", href: "#" },
  { name: "FAQ", href: "#" },
  { name: "Pricing", href: "#" },
]

export function Navigation({
  onStartFree,
  onCrealiaAIClick,
  onPricingClick,
  onStudioClick,
  onAnalyticsClick,
  onInspirationClick,
  onFAQClick,
}) {
  const [signupModalOpen, setSignupModalOpen] = useState(false)

  const handleNavigationClick = (item) => {
    switch (item.name) {
      case "Créalia AI":
        onCrealiaAIClick()
        break
      case "Créalia Studio":
        onStudioClick()
        break
      case "Créalia Analytics":
        onAnalyticsClick()
        break
      case "Inspiration":
        onInspirationClick()
        break
      case "FAQ":
        onFAQClick()
        break
      case "Pricing":
        onPricingClick()
        break
    }
  }

  return (
    <>
      <header className="site-header" role="banner" aria-label="En-tête du site Créalia">
        <div className="header-inner">
          {/* GAUCHE : LOGO (placé en premier pour être tout à gauche) */}
          <div className="left-group">
            <a className="site-logo" href="/" aria-label="Accueil Créalia">
              <CrealiaLogo />
            </a>
          </div>

          {/* CENTRE : navigation principale (peut être centrée) */}
          <nav className="main-nav" role="navigation" aria-label="Navigation principale">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigationClick(item)
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* DROITE : boutons placés en dernier pour être tout à droite */}
          <div className="right-group">
            <a className="btn ghost login" href="/login">
              Se connecter
            </a>
            <a
              className="btn primary try"
              href="/signup"
              onClick={(e) => {
                e.preventDefault()
                onStartFree()
              }}
            >
              Essayer Gratuitement
            </a>
          </div>
        </div>
      </header>

      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
      {/* Les autres modales sont gérées par la page parente */}
    </>
  )
}
