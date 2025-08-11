import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ ok: false, missing: true })

    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key },
      cache: 'no-store',
    })
    return NextResponse.json({ ok: res.ok })
  } catch {
    return NextResponse.json({ ok: false })
  }
}