import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Export types pour TypeScript (si besoin plus tard)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          auth_user_id: string
          first_name: string
          birthdate: string
          bio: string | null
          avg_rating: number | null
          verified_photo_url: string | null
          last_seen: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          is_premium: boolean
          is_incognito: boolean
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          first_name: string
          birthdate: string
          bio?: string | null
          avg_rating?: number | null
          verified_photo_url?: string | null
          last_seen?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          is_premium?: boolean
          is_incognito?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          first_name?: string
          birthdate?: string
          bio?: string | null
          avg_rating?: number | null
          verified_photo_url?: string | null
          last_seen?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          is_premium?: boolean
          is_incognito?: boolean
          created_at?: string
        }
      }
      public_photos: {
        Row: {
          id: string
          user_id: string
          image_url: string
          is_main: boolean
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          is_main?: boolean
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          is_main?: boolean
          order_index?: number | null
          created_at?: string
        }
      }
    }
  }
}
