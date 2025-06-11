import { supabase } from './client.js'

/**
 * Service de gestion des photos publiques
 */
export const photosService = {
  /**
   * Uploader une photo dans le bucket profile.photos
   */
  async uploadPhoto(file, userId, options = {}) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('profile.photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('profile.photos')
        .getPublicUrl(fileName)
      
      return {
        fileName: fileName,
        url: publicUrl,
        path: data.path
      }
    } catch (error) {
      console.error('❌ Erreur uploadPhoto:', error.message)
      throw error
    }
  },

  /**
   * Ajouter une photo au profil utilisateur
   */
  async addPhotoToProfile(userId, imageUrl, options = {}) {
    try {
      const { isMain = false, orderIndex = 0 } = options
      
      // Si c'est la photo principale, désactiver les autres photos principales
      if (isMain) {
        await this.unsetMainPhotos(userId)
      }
      
      const { data, error } = await supabase
        .from('public_photos')
        .insert([{
          user_id: userId,
          image_url: imageUrl,
          is_main: isMain,
          order_index: orderIndex
        }])
        .select()
        .single()
      
      if (error) throw error
      console.log('✅ Photo ajoutée au profil:', data)
      return data
    } catch (error) {
      console.error('❌ Erreur addPhotoToProfile:', error.message)
      throw error
    }
  },

  /**
   * Récupérer toutes les photos d'un utilisateur
   */
  async getUserPhotos(userId) {
    try {
      const { data, error } = await supabase
        .from('public_photos')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Erreur getUserPhotos:', error.message)
      throw error
    }
  },

  /**
   * Définir une photo comme photo principale
   */
  async setMainPhoto(photoId, userId) {
    try {
      // Désactiver toutes les photos principales
      await this.unsetMainPhotos(userId)
      
      // Activer la photo sélectionnée
      const { data, error } = await supabase
        .from('public_photos')
        .update({ is_main: true })
        .eq('id', photoId)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      console.log('✅ Photo principale définie:', data)
      return data
    } catch (error) {
      console.error('❌ Erreur setMainPhoto:', error.message)
      throw error
    }
  },

  /**
   * Désactiver toutes les photos principales d'un utilisateur
   */
  async unsetMainPhotos(userId) {
    try {
      const { error } = await supabase
        .from('public_photos')
        .update({ is_main: false })
        .eq('user_id', userId)
        .eq('is_main', true)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Erreur unsetMainPhotos:', error.message)
      throw error
    }
  },

  /**
   * Supprimer une photo
   */
  async deletePhoto(photoId, userId) {
    try {
      // Récupérer les infos de la photo
      const { data: photo, error: fetchError } = await supabase
        .from('public_photos')
        .select('*')
        .eq('id', photoId)
        .eq('user_id', userId)
        .single()
      
      if (fetchError) throw fetchError
      
      // Supprimer de la base de données
      const { error: deleteError } = await supabase
        .from('public_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', userId)
      
      if (deleteError) throw deleteError
      
      // Supprimer du storage (optionnel, peut être fait en batch)
      if (photo.image_url.includes('profile.photos')) {
        const filePath = photo.image_url.split('/').pop()
        await supabase.storage
          .from('profile.photos')
          .remove([`${userId}/${filePath}`])
      }
      
      console.log('✅ Photo supprimée:', photoId)
      return true
    } catch (error) {
      console.error('❌ Erreur deletePhoto:', error.message)
      throw error
    }
  },

  /**
   * Réorganiser l'ordre des photos
   */
  async reorderPhotos(userId, photoOrders) {
    try {
      const updates = photoOrders.map(({ photoId, orderIndex }) => 
        supabase
          .from('public_photos')
          .update({ order_index: orderIndex })
          .eq('id', photoId)
          .eq('user_id', userId)
      )
      
      await Promise.all(updates)
      console.log('✅ Photos réorganisées')
      return true
    } catch (error) {
      console.error('❌ Erreur reorderPhotos:', error.message)
      throw error
    }
  }
}

export default photosService
