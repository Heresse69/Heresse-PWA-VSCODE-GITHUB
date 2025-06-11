import { supabase } from './client.js'

/**
 * Service de gestion des profils utilisateurs
 */
export const profilesService = {
  /**
   * Créer un nouveau profil utilisateur
   */
  async createProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()
      
      if (error) throw error
      console.log('✅ Profil créé:', data)
      return data
    } catch (error) {
      console.error('❌ Erreur createProfile:', error.message)
      throw error
    }
  },

  /**
   * Récupérer un profil par ID
   */
  async getProfileById(profileId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          public_photos (
            id,
            image_url,
            is_main,
            order_index,
            created_at
          )
        `)
        .eq('id', profileId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Erreur getProfileById:', error.message)
      throw error
    }
  },

  /**
   * Récupérer un profil par auth_user_id
   */
  async getProfileByAuthId(authUserId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          public_photos (
            id,
            image_url,
            is_main,
            order_index,
            created_at
          )
        `)
        .eq('auth_user_id', authUserId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Erreur getProfileByAuthId:', error.message)
      throw error
    }
  },

  /**
   * Mettre à jour un profil
   */
  async updateProfile(profileId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single()
      
      if (error) throw error
      console.log('✅ Profil mis à jour:', data)
      return data
    } catch (error) {
      console.error('❌ Erreur updateProfile:', error.message)
      throw error
    }
  },

  /**
   * Mettre à jour la dernière activité
   */
  async updateLastSeen(profileId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', profileId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Erreur updateLastSeen:', error.message)
      throw error
    }
  },

  /**
   * Récupérer les recommandations de profils pour le swipe
   */
  async getSwipeRecommendations(currentUserId, limit = 10) {
    try {
      // Pour l'instant, récupération simple sans algorithme avancé
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          public_photos!inner (
            id,
            image_url,
            is_main,
            order_index,
            created_at
          )
        `)
        .neq('id', currentUserId)
        .eq('public_photos.is_main', true) // Seulement les profils avec photo principale
        .limit(limit)
      
      if (error) throw error
      
      // Transformer les données pour correspondre au format attendu par l'UI
      const profiles = data.map(profile => ({
        id: profile.id,
        name: profile.first_name,
        age: this.calculateAge(profile.birthdate),
        bio: profile.bio || '',
        city: profile.city || 'Ville inconnue',
        distance: profile.latitude && profile.longitude ? 
          this.calculateDistance(profile.latitude, profile.longitude, 48.8566, 2.3522) : // Paris par défaut
          Math.floor(Math.random() * 50) + 1, // Distance aléatoire temporaire
        photos: profile.public_photos.map(photo => photo.image_url),
        referencePhotoIndex: 0, // Photo principale = index 0
        mediaSoldRating: profile.avg_rating || 0,
        verified: !!profile.verified_photo_url
      }))
      
      return profiles
    } catch (error) {
      console.error('❌ Erreur getSwipeRecommendations:', error.message)
      throw error
    }
  },

  /**
   * Calculer l'âge à partir de la date de naissance
   */
  calculateAge(birthdate) {
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  },

  /**
   * Calculer la distance entre deux points (formule simple)
   * TODO: Utiliser la fonction SQL calculate_distance de Supabase
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c)
  }
}

export default profilesService
