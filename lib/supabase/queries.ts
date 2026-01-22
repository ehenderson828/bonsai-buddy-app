import { supabase } from "./client"
import type {
  BonsaiSpecimen,
  BonsaiPost,
  BonsaiSpecimenWithOwner,
  BonsaiPostWithDetails,
  Profile,
  HealthStatus,
  Comment,
  CommentWithDetails,
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

export async function searchUsers(query: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_private", false)
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })
    .limit(20)

  if (error) throw error
  return data as Profile[]
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Delete all posts for this specimen first
  const { error: postsError } = await supabase
    .from("bonsai_posts")
    .delete()
    .eq("specimen_id", id)

  if (postsError) throw postsError

  // Delete all subscriptions for this specimen
  const { error: subsError } = await supabase
    .from("specimen_subscriptions")
    .delete()
    .eq("specimen_id", id)

  if (subsError) throw subsError

  // Finally delete the specimen itself
  const { error } = await supabase
    .from("bonsai_specimens")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id) // Security: only owner can delete

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

  if (error) throw error

  // Filter posts based on privacy settings
  const filteredData = (data as any[]).filter((post) => {
    // Always show user's own posts
    if (user && post.user_id === user.id) {
      return true
    }

    // For other users' posts, check both post and account privacy
    // Show only if: post is public AND account is not private
    return post.is_public && !post.owner?.is_private
  })

  // Sort by most recent activity (edited_at if available, otherwise created_at)
  const sortedData = filteredData.sort((a, b) => {
    const aTime = a.edited_at || a.created_at
    const bTime = b.edited_at || b.created_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  // Check if current user has liked each post
  if (user) {
    const postsWithLikes = await Promise.all(
      sortedData.map(async (post) => {
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

  return sortedData.map((post) => ({ ...post, is_liked: false })) as BonsaiPostWithDetails[]
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

  // Filter posts based on privacy - show all own posts, only public posts from others
  const filteredData = (data as any[]).filter((post) => {
    if (user && post.user_id === user.id) return true
    return post.is_public
  })

  // Check if current user has liked each post
  if (user) {
    const postsWithLikes = await Promise.all(
      filteredData.map(async (post) => {
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

  return filteredData.map((post) => ({ ...post, is_liked: false })) as BonsaiPostWithDetails[]
}

export async function getPostsByUser(userId: string): Promise<BonsaiPost[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("bonsai_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // If viewing own profile, show all posts
  // If viewing someone else's profile, show only public posts
  if (user && user.id === userId) {
    return data as BonsaiPost[]
  }

  return (data as BonsaiPost[]).filter((post) => post.is_public)
}

export async function createPost(post: {
  specimen_id: string
  image_url: string
  caption?: string
  is_public?: boolean
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
        is_public: post.is_public ?? true, // Default to public if not specified
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as BonsaiPost
}

export async function updatePost(
  postId: string,
  updates: {
    image_url?: string
    caption?: string
    is_public?: boolean
  }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("bonsai_posts")
    .update({
      ...updates,
      edited_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("user_id", user.id) // Security: only owner can update
    .select()
    .single()

  if (error) throw error
  return data as BonsaiPost
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("bonsai_posts").delete().eq("id", id)

  if (error) throw error
}

export async function updatePostPrivacy(postId: string, isPublic: boolean) {
  const { error } = await supabase
    .from("bonsai_posts")
    .update({ is_public: isPublic })
    .eq("id", postId)

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

// =====================================================
// COMMENT QUERIES
// =====================================================

export async function getCommentsByPost(postId: string): Promise<CommentWithDetails[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all comments for the post
  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles(*)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (commentsError) throw commentsError

  // Get like counts for all comments
  const { data: likeCounts, error: likeCountsError } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .in(
      "comment_id",
      commentsData.map((c: any) => c.id)
    )

  if (likeCountsError) throw likeCountsError

  // Build like count map
  const likeCountMap = (likeCounts || []).reduce((acc: any, like: any) => {
    acc[like.comment_id] = (acc[like.comment_id] || 0) + 1
    return acc
  }, {})

  // Check which comments user has liked
  let userLikes: any[] = []
  if (user) {
    const { data: userLikesData } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", user.id)
      .in(
        "comment_id",
        commentsData.map((c: any) => c.id)
      )
    userLikes = userLikesData || []
  }

  const userLikeSet = new Set(userLikes.map((l: any) => l.comment_id))

  // Build threaded structure
  const commentsMap = new Map<string, CommentWithDetails>()
  const rootComments: CommentWithDetails[] = []

  // First pass: create all comment objects
  commentsData.forEach((comment: any) => {
    const commentWithDetails: CommentWithDetails = {
      ...comment,
      likes: likeCountMap[comment.id] || 0,
      is_liked: userLikeSet.has(comment.id),
      replies: [],
    }
    commentsMap.set(comment.id, commentWithDetails)
  })

  // Second pass: build tree structure
  commentsData.forEach((comment: any) => {
    const commentWithDetails = commentsMap.get(comment.id)!
    if (comment.parent_comment_id) {
      const parent = commentsMap.get(comment.parent_comment_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(commentWithDetails)
      }
    } else {
      rootComments.push(commentWithDetails)
    }
  })

  return rootComments
}

export async function createComment(comment: {
  post_id: string
  content: string
  parent_comment_id?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        ...comment,
        user_id: user.id,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

export async function updateComment(commentId: string, content: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      edited_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

export async function deleteComment(commentId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Soft delete: mark as deleted
  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true, content: "" })
    .eq("id", commentId)

  if (error) throw error
}

export async function likeComment(commentId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("comment_likes")
    .insert([{ comment_id: commentId, user_id: user.id }])

  if (error) throw error
}

export async function unlikeComment(commentId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", user.id)

  if (error) throw error
}

export async function getCommentCountByPost(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("is_deleted", false)

  if (error) throw error
  return count || 0
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
    .select('avatar, theme, email_preferences, notification_settings, is_private')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
