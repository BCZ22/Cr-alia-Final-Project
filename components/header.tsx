"use client"

import { CrealiaLogo } from "@/components/crealia-logo"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="site-header border-b" role="banner" aria-label="En-tête du site Créalia">
      <div className="header-inner">
        <div className="left-group">
          <a className="site-logo" href="/" aria-label="Accueil Créalia">
            <CrealiaLogo />
          </a>
        </div>

        <div className="right-group">
          <Button variant="ghost" asChild>
            <a href="/login">Se connecter</a>
          </Button>
          <Button asChild>
            <a href="/signup">Essayer Gratuitement</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
