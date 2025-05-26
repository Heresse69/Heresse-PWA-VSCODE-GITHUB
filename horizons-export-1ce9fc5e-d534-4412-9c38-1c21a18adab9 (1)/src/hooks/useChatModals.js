import { useState } from 'react';

    const useChatModals = () => {
      const [showPaymentModal, setShowPaymentModal] = useState(false);
      const [mediaToUnlock, setMediaToUnlock] = useState(null);
      const [showFullScreenViewer, setShowFullScreenViewer] = useState(false);
      const [fullScreenMediaUrl, setFullScreenMediaUrl] = useState(null);
      const [ratingForPhoto, setRatingForPhoto] = useState(0);
      const [showRatingModal, setShowRatingModal] = useState(false);
      const [photoToRate, setPhotoToRate] = useState(null);
      const [showSendMediaModal, setShowSendMediaModal] = useState(false);

      const openPaymentModal = (media) => {
        setMediaToUnlock(media);
        setShowPaymentModal(true);
      };

      const closePaymentModal = () => {
        setShowPaymentModal(false);
        setMediaToUnlock(null);
      };

      const openFullScreenViewer = (url) => {
        setFullScreenMediaUrl(url);
        setShowFullScreenViewer(true);
      };

      const closeFullScreenViewer = () => {
        setShowFullScreenViewer(false);
        setFullScreenMediaUrl(null);
        if (photoToRate && !photoToRate.rated && photoToRate.status === 'received_opened') {
          setShowRatingModal(true);
        }
      };
      
      const openRatingModal = (photo) => {
        setPhotoToRate(photo);
        setShowRatingModal(true);
      };

      const closeRatingModal = () => {
        setShowRatingModal(false);
        setPhotoToRate(null);
        setRatingForPhoto(0);
      };

      const openSendMediaModal = () => setShowSendMediaModal(true);
      const closeSendMediaModal = () => setShowSendMediaModal(false);

      return {
        showPaymentModal, openPaymentModal, closePaymentModal, mediaToUnlock,
        showFullScreenViewer, openFullScreenViewer, closeFullScreenViewer, fullScreenMediaUrl,
        showRatingModal, openRatingModal, closeRatingModal, photoToRate, setPhotoToRate, ratingForPhoto, setRatingForPhoto,
        showSendMediaModal, openSendMediaModal, closeSendMediaModal
      };
    };

    export { useChatModals };
    export default useChatModals;