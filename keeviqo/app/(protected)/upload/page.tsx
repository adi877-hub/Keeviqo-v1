'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '../../../lib/supabaseClient'
import { Button } from '../../../components/ui/button'

export default function UploadPage() {
  const supabase = useMemo(() => createClient(), [])
  const [files, setFiles] = useState<{ name: string; path: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      if (data.user?.id) loadFiles(data.user.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadFiles(uid: string) {
    setLoading(true)
    const { data, error } = await supabase.storage.from('documents').list(`${uid}`, { limit: 100, sortBy: { column: 'name', order: 'asc' } })
    if (!error && data) setFiles(data.map((f) => ({ name: f.name, path: `${uid}/${f.name}` })))
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setLoading(true)
    const filePath = `${userId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('documents').upload(filePath, file, { upsert: false })
    if (!error) await loadFiles(userId)
    setLoading(false)
  }

  async function handleDelete(path: string) {
    setLoading(true)
    await supabase.storage.from('documents').remove([path])
    if (userId) await loadFiles(userId)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">העלאת מסמכים</h1>
      <input type="file" onChange={handleUpload} />
      {loading && <p className="text-sm text-muted-foreground">טוען...</p>}
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.path} className="flex items-center justify-between border rounded-md p-3">
            <span className="truncate">{f.name}</span>
            <div className="flex items-center gap-2">
              <a className="underline text-sm" href={`#`} onClick={async (e) => {
                e.preventDefault()
                const { data } = await supabase.storage.from('documents').createSignedUrl(f.path, 60)
                if (data?.signedUrl) window.open(data.signedUrl, '_blank')
              }}>הורדה</a>
              <Button variant="outline" onClick={() => handleDelete(f.path)}>מחיקה</Button>
            </div>
          </li>
        ))}
        {files.length === 0 && <li className="text-sm text-muted-foreground">אין מסמכים להצגה</li>}
      </ul>
      <p className="text-xs text-muted-foreground">יש ליצור בבסיס הנתונים שלכם bucket בשם "documents" עם מדיניות גישה מתאימה.</p>
    </div>
  )
}