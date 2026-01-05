import Link from "next/link"
import { BonsaiLogo } from "@/components/ui/bonsai-logo"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BonsaiLogo className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Bonsai Buddy</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">© 2025 Bonsai Buddy. Growing together.</p>
        </div>
      </div>
    </footer>
  )
}
