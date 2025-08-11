"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '../../../../lib/supabaseClient'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { SITE_URL } from '../../../../lib/siteUrl'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<'magic' | 'password'>('magic')

  const redirectTo = `${SITE_URL}/auth/callback`
  console.log('[AUTH] SITE_URL =', SITE_URL)
  console.log('[AUTH] redirectTo =', redirectTo)

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) setMessage(error.message)
    else setMessage('שלחנו לכם קישור התחברות למייל. בדקו את הדואר ולחצו על הקישור.')
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else if (data?.user) window.location.href = '/dashboard'
  }

  async function handlePasswordSignup(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })
    if (error) setMessage(error.message)
    else if (data?.user && !data.user.email_confirmed_at) setMessage('נשלח מייל לאימות. יש לאשר את הכתובת לפני התחברות.')
    else setMessage('נרשמתם בהצלחה!')
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">התחברות</h1>

      <div className="flex gap-2 text-sm">
        <Button variant={mode === 'magic' ? 'default' : 'outline'} onClick={() => setMode('magic')}>קישור במייל</Button>
        <Button variant={mode === 'password' ? 'default' : 'outline'} onClick={() => setMode('password')}>אימייל + סיסמה</Button>
      </div>

      {mode === 'magic' ? (
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <Button type="submit">שליחת קישור</Button>
        </form>
      ) : (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">סיסמה</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">התחברות</Button>
            <Button type="button" variant="outline" onClick={handlePasswordSignup}>הרשמה</Button>
          </div>
        </form>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <p className="text-sm">אין לכם חשבון? <a href="/auth/signup" className="underline">הרשמה</a></p>
    </div>
  )
}