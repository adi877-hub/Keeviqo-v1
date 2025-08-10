import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ברוכים הבאים ל-Keeviqo</h1>
      <p className="text-muted-foreground">מערכת חכמה לניהול אישי, רפואי, פיננסי ובירוקרטי – במקום אחד.</p>
      <div className="flex gap-3">
        <Link href="/auth/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">התחברות</Link>
        <Link href="/auth/signup" className="px-4 py-2 border rounded-md">הרשמה</Link>
      </div>
    </div>
  )
}