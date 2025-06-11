import { supabase } from './client.js'

/**
 * Service d'authentification Supabase
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // métadonnées utilisateur
        }
      })
      
      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('❌ Erreur signup:', error.message)
      throw error
    }
  },

  /**
   * Connexion utilisateur
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('❌ Erreur signin:', error.message)
      throw error
    }
  },

  /**
   * Déconnexion
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Erreur signout:', error.message)
      throw error
    }
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('❌ Erreur getCurrentUser:', error.message)
      return null
    }
  },

  /**
   * Récupérer la session actuelle
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('❌ Erreur getCurrentSession:', error.message)
      return null
    }
  },

  /**
   * Écouter les changements d'authentification
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  /**
   * Mise à jour du profil utilisateur (métadonnées)
   */
  async updateUserMetadata(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('❌ Erreur updateUserMetadata:', error.message)
      throw error
    }
  }
}

export default authService
