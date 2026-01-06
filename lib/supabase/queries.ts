import { supabase } from "./client"
import type {
  BonsaiSpecimen,
  BonsaiPost,
  BonsaiSpecimenWithOwner,
  BonsaiPostWithDetails,
  Profile,
  HealthStatus,
} from "./types"

// =====================================================
// PROFILE QUERIES
// =====================================================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

// =====================================================
// BONSAI SPECIMEN QUERIES
// =====================================================

export async function getAllSpecimens(): Promise<BonsaiSpecimenWithOwner[]> {
  const { data, error } = await supabase
    .from("bonsai_specimens")
    .select(`
      *,
      owner:profiles(*)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as BonsaiSpecimenWithOwner[]
}

export async function getSpecimenById(id: string): Promise<BonsaiSpecimenWithOwner> {
  const { data, error } = await supabase
    .from("bonsai_specimens")
    .select(`
      *,
      owner:profiles(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data as BonsaiSpecimenWithOwner
}

export async function getSpecimensByUser(userId: string): Promise<BonsaiSpecimen[]> {
  const { data, error } = await supabase
    .from("bonsai_specimens")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as BonsaiSpecimen[]
}

export async function searchSpecimens(query: string): Promise<BonsaiSpecimenWithOwner[]> {
  const { data, error } = await supabase
    .from("bonsai_specimens")
    .select(`
      *,
      owner:profiles(*)
    `)
    .or(`name.ilike.%${query}%,species.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as BonsaiSpecimenWithOwner[]
}

export async function createSpecimen(specimen: {
  name: string
  species: string
  age: number
  health: HealthStatus
  image_url: string
  care_notes?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("bonsai_specimens")
    .insert([
      {
        ...specimen,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as BonsaiSpecimen
}

export async function updateSpecimen(
  id: string,
  updates: Partial<Omit<BonsaiSpecimen, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("bonsai_specimens")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as BonsaiSpecimen
}

export async function deleteSpecimen(id: string) {
  const { error } = await supabase.from("bonsai_specimens").delete().eq("id", id)

  if (error) throw error
}

// =====================================================
// BONSAI POST QUERIES
// =====================================================

export async function getAllPosts(): Promise<BonsaiPostWithDetails[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("bonsai_posts")
    .select(`
      *,
      specimen:bonsai_specimens(*),
      owner:profiles(*)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Check if current user has liked each post
  if (user) {
    const postsWithLikes = await Promise.all(
      (data as any[]).map(async (post) => {
        const { data: like } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .single()

        return {
          ...post,
          is_liked: !!like,
        }
      })
    )
    return postsWithLikes as BonsaiPostWithDetails[]
  }

  return data.map((post) => ({ ...post, is_liked: false })) as BonsaiPostWithDetails[]
}

export async function getPostsBySpecimen(specimenId: string): Promise<BonsaiPostWithDetails[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("bonsai_posts")
    .select(`
      *,
      specimen:bonsai_specimens(*),
      owner:profiles(*)
    `)
    .eq("specimen_id", specimenId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Check if current user has liked each post
  if (user) {
    const postsWithLikes = await Promise.all(
      (data as any[]).map(async (post) => {
        const { data: like } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .single()

        return {
          ...post,
          is_liked: !!like,
        }
      })
    )
    return postsWithLikes as BonsaiPostWithDetails[]
  }

  return data.map((post) => ({ ...post, is_liked: false })) as BonsaiPostWithDetails[]
}

export async function getPostsByUser(userId: string): Promise<BonsaiPost[]> {
  const { data, error } = await supabase
    .from("bonsai_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as BonsaiPost[]
}

export async function createPost(post: {
  specimen_id: string
  image_url: string
  caption?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("bonsai_posts")
    .insert([
      {
        ...post,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as BonsaiPost
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("bonsai_posts").delete().eq("id", id)

  if (error) throw error
}

// =====================================================
// POST LIKES QUERIES
// =====================================================

export async function likePost(postId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("post_likes")
    .insert([{ post_id: postId, user_id: user.id }])

  if (error) throw error
}

export async function unlikePost(postId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id)

  if (error) throw error
}

export async function isPostLikedByUser(postId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  return !!data && !error
}

// =====================================================
// SPECIMEN SUBSCRIPTIONS QUERIES
// =====================================================

export async function subscribeToSpecimen(specimenId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("specimen_subscriptions")
    .insert([{ specimen_id: specimenId, user_id: user.id }])

  if (error) throw error
}

export async function unsubscribeFromSpecimen(specimenId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("specimen_subscriptions")
    .delete()
    .eq("specimen_id", specimenId)
    .eq("user_id", user.id)

  if (error) throw error
}

export async function isSubscribedToSpecimen(specimenId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from("specimen_subscriptions")
    .select("id")
    .eq("specimen_id", specimenId)
    .eq("user_id", user.id)
    .single()

  return !!data && !error
}

export async function getSubscriberCount(specimenId: string): Promise<number> {
  const { count, error } = await supabase
    .from("specimen_subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("specimen_id", specimenId)

  if (error) throw error
  return count || 0
}

// =====================================================
// USER PREFERENCES QUERIES
// =====================================================

export async function updateUserTheme(userId: string, theme: 'light' | 'dark') {
  const { error } = await supabase
    .from('profiles')
    .update({ theme })
    .eq('id', userId)

  if (error) throw error
}

export async function updateEmailPreferences(userId: string, preferences: any) {
  const { error } = await supabase
    .from('profiles')
    .update({ email_preferences: preferences })
    .eq('id', userId)

  if (error) throw error
}

export async function updateNotificationSettings(userId: string, settings: any) {
  const { error } = await supabase
    .from('profiles')
    .update({ notification_settings: settings })
    .eq('id', userId)

  if (error) throw error
}

export async function updateAccountPrivacy(userId: string, isPrivate: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_private: isPrivate })
    .eq('id', userId)

  if (error) throw error
}

export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('theme, email_preferences, notification_settings, is_private')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
