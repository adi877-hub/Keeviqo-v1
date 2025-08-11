'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../../lib/supabaseClient'

export default function AuthCallbackPage() {
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (cancelled) return
      if (error) setError(error.message)
      else window.location.replace('/protected/dashboard')
    }
    run()
    return () => { cancelled = true }
  }, [supabase])

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">מסיימים התחברות…</h1>
      {!error ? (
        <p className="text-sm text-muted-foreground">מבצעים אימות ומפנים אתכם לדשבורד…</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-red-600">התרחשה שגיאה בהתחברות: {error}</p>
          <p className="text-sm">נסו שוב <a className="underline" href="/auth/login">להתחבר</a> או בקשו קישור חדש.</p>
        </div>
      )}
    </div>
  )
}