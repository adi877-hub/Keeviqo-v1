'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '../../../../lib/supabaseClient'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'

export default function SignupPage() {
  const supabase = createClient()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
    if (error) setMessage(error.message)
    else {
      setMessage('קוד נשלח למייל. בדקו את תיבת הדואר והזינו את הקוד להשלמת ההרשמה.')
      setStep('otp')
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' })
    if (error) setMessage(error.message)
    else window.location.href = '/dashboard'
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">הרשמה</h1>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <Button type="submit">שליחת קוד</Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">קוד אימות</Label>
            <Input id="otp" inputMode="numeric" pattern="[0-9]*" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="הזינו את הקוד מהמייל" />
          </div>
          <Button type="submit">אימות והמשך</Button>
        </form>
      )}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <p className="text-sm">
        כבר יש לכם חשבון? <a href="/auth/login" className="underline">התחברות</a>
      </p>
    </div>
  )
}