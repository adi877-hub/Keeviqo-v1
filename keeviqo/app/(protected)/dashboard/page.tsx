import { createServerSupabase } from '../../../lib/supabaseServer'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let tasks: any[] = []
  if (user) {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_at', { ascending: true })
      .limit(5)
    tasks = data ?? []
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>משימות קרובות</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tasks.length === 0 && <li className="text-sm text-muted-foreground">אין משימות להצגה</li>}
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between border rounded-md p-3">
                <span>{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.due_at ? new Date(t.due_at).toLocaleDateString('he-IL') : 'ללא תאריך'}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>התראות</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">אין התראות חדשות</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}