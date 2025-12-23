// Database types for Supabase tables
// These match the schema defined in supabase/migrations/001_initial_schema.sql

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'needs-attention'

export interface Profile {
  id: string
  name: string
  email: string
  avatar?: string | null
  created_at: string
  updated_at: string
}

export interface BonsaiSpecimen {
  id: string
  user_id: string
  name: string
  species: string
  age: number
  health: HealthStatus
  image_url: string
  care_notes?: string | null
  created_at: string
  updated_at: string
}

export interface BonsaiPost {
  id: string
  specimen_id: string
  user_id: string
  image_url: string
  caption?: string | null
  likes: number
  created_at: string
  updated_at: string
}

export interface PostLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface SpecimenSubscription {
  id: string
  specimen_id: string
  user_id: string
  created_at: string
}

// Extended types with joined data (for queries)
export interface BonsaiSpecimenWithOwner extends BonsaiSpecimen {
  owner?: Profile
}

export interface BonsaiPostWithDetails extends BonsaiPost {
  specimen?: BonsaiSpecimen
  owner?: Profile
  is_liked?: boolean
  comments?: number
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      bonsai_specimens: {
        Row: BonsaiSpecimen
        Insert: Omit<BonsaiSpecimen, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BonsaiSpecimen, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      bonsai_posts: {
        Row: BonsaiPost
        Insert: Omit<BonsaiPost, 'id' | 'likes' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BonsaiPost, 'id' | 'user_id' | 'specimen_id' | 'created_at' | 'updated_at'>>
      }
      post_likes: {
        Row: PostLike
        Insert: Omit<PostLike, 'id' | 'created_at'>
        Update: never
      }
      specimen_subscriptions: {
        Row: SpecimenSubscription
        Insert: Omit<SpecimenSubscription, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}
