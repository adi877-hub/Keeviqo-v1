import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Keeviqo',
  description: 'מערכת חכמה לניהול אישי ובירוקרטי',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-white sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link className="text-xl font-bold" href="/dashboard">Keeviqo</Link>
              <span className="text-sm text-muted-foreground">המערכת החכמה לניהול חיים</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard">דשבורד</Link>
              <Link href="/categories">קטגוריות</Link>
              <Link href="/upload">מסמכים</Link>
              <Link href="/vision">חזון</Link>
              <Link href="/auth/login">התחברות</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto py-6">
          {children}
        </main>
      </body>
    </html>
  )
}