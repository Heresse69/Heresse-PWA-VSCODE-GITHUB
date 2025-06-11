import { useState, useEffect, useCallback } from 'react'
import { profilesService } from '../services/supabase/profiles.js'
import { useToast } from '@/components/ui/use-toast'

/**
 * Hook pour gérer les profils de swipe avec Supabase
 */
export const useProfiles = () => {
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  /**
   * Charger les recommandations de profils
   */
  const loadProfiles = useCallback(async (currentUserId, limit = 10) => {
    try {
      setLoading(true)
      setError(null)
      
      const recommendations = await profilesService.getSwipeRecommendations(currentUserId, limit)
      
      setProfiles(recommendations)
      setCurrentIndex(0)
      
      console.log('✅ Profils chargés:', recommendations.length)
    } catch (err) {
      console.error('❌ Erreur chargement profils:', err)
      setError(err.message)
      toast({
        title: "Erreur",
        description: "Impossible de charger les profils",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Passer au profil suivant
   */
  const nextProfile = useCallback(() => {
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      
      // Si on arrive à la fin, recharger de nouveaux profils
      if (newIndex >= profiles.length - 2) {
        // TODO: Charger plus de profils automatiquement
        console.log('🔄 Fin des profils atteinte, rechargement nécessaire')
      }
      
      return Math.min(newIndex, profiles.length - 1)
    })
  }, [profiles.length])

  /**
   * Retourner au profil précédent (si premium)
   */
  const previousProfile = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }, [])

  /**
   * Supprimer le profil actuel (après swipe)
   */
  const removeCurrentProfile = useCallback(() => {
    setProfiles(prev => {
      const newProfiles = [...prev]
      newProfiles.splice(currentIndex, 1)
      return newProfiles
    })
    
    // Ajuster l'index si nécessaire
    setCurrentIndex(prev => {
      if (prev >= profiles.length - 1) {
        return Math.max(0, profiles.length - 2)
      }
      return prev
    })
  }, [currentIndex, profiles.length])

  /**
   * Recharger les profils
   */
  const refreshProfiles = useCallback(async (currentUserId) => {
    await loadProfiles(currentUserId)
  }, [loadProfiles])

  return {
    profiles,
    currentProfile: profiles[currentIndex] || null,
    currentIndex,
    loading,
    error,
    hasMoreProfiles: currentIndex < profiles.length - 1,
    
    // Actions
    loadProfiles,
    nextProfile,
    previousProfile,
    removeCurrentProfile,
    refreshProfiles
  }
}

export default useProfiles
