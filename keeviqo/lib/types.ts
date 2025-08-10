export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          due_at: string | null
          status: 'open' | 'done'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          due_at?: string | null
          status?: 'open' | 'done'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}