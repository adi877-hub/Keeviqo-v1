'use client'

import { useEffect, useState } from 'react'
import { SITE_URL } from '../../lib/siteUrl'

export default function HealthPage() {
  const [hasUrl, setHasUrl] = useState<boolean>(false)
  const [hasAnonKey, setHasAnonKey] = useState<boolean>(false)
  const [pingOk, setPingOk] = useState<boolean>(false)

  useEffect(() => {
    setHasUrl(!!process.env.NEXT_PUBLIC_SITE_URL || typeof window !== 'undefined')
    setHasAnonKey(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    async function ping() {
      try {
        const res = await fetch('/api/health-ping', { cache: 'no-store' })
        const json = await res.json()
        setPingOk(!!json?.ok)
      } catch {
        setPingOk(false)
      }
    }
    ping()
  }, [])

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Diagnostics</h1>
      <div className="text-sm space-y-1">
        <div>hasURL: {String(hasUrl)}</div>
        <div>hasAnonKey: {String(hasAnonKey)}</div>
        <div>siteURLUsed: {SITE_URL}</div>
        <div>supabasePingOk: {String(pingOk)}</div>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        {!hasUrl && <div>Set NEXT_PUBLIC_SITE_URL in Vercel Project Settings → Environment Variables.</div>}
        {!hasAnonKey && <div>Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Project Settings.</div>}
        {!pingOk && <div>Ensure Database and public API are accessible; verify Supabase URL/key.</div>}
      </div>
    </div>
  )
}