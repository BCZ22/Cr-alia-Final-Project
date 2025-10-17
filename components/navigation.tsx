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

export function Navigation() {
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [aiInterfaceOpen, setAiInterfaceOpen] = useState(false)
  const [studioInterfaceOpen, setStudioInterfaceOpen] = useState(false)
  const [analyticsInterfaceOpen, setAnalyticsInterfaceOpen] = useState(false)
  const [inspirationInterfaceOpen, setInspirationInterfaceOpen] = useState(false)
  const [faqInterfaceOpen, setFaqInterfaceOpen] = useState(false)

  const handleNavigationClick = (item: (typeof navigation)[0]) => {
    switch (item.name) {
      case "Créalia AI":
        setAiInterfaceOpen(true)
        break
      case "Créalia Studio":
        setStudioInterfaceOpen(true)
        break
      case "Créalia Analytics":
        setAnalyticsInterfaceOpen(true)
        break
      case "Inspiration":
        setInspirationInterfaceOpen(true)
        break
      case "FAQ":
        setFaqInterfaceOpen(true)
        break
      case "Pricing":
        setPricingModalOpen(true)
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
                setSignupModalOpen(true)
              }}
            >
              Essayer Gratuitement
            </a>
          </div>
        </div>
      </header>

      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
      <PricingModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />
      <CrealiaAIInterface isOpen={aiInterfaceOpen} onClose={() => setAiInterfaceOpen(false)} />
      <CrealiaStudioInterface isOpen={studioInterfaceOpen} onClose={() => setStudioInterfaceOpen(false)} />
      <CrealiaAnalyticsInterface isOpen={analyticsInterfaceOpen} onClose={() => setAnalyticsInterfaceOpen(false)} />
      <CrealiaInspirationInterface
        isOpen={inspirationInterfaceOpen}
        onClose={() => setInspirationInterfaceOpen(false)}
      />
      <CrealiaFAQInterface isOpen={faqInterfaceOpen} onClose={() => setFaqInterfaceOpen(false)} />
    </>
  )
}
