import React from 'react';

    export const mockMatchesData = [
      { 
        id: 'user1', name: 'Claudia', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/579be2811fe4cf73dd182c8843a9fabf.png', 
        avatarText: 'Cl', lastMessage: 'Salut ! Comment ça va ? 😊', unread: 1, online: true, timestamp: '14:02', 
        liveCallCost: 5, photoPriceTiers: [{ count: 3, price: 1 }, { count: Infinity, price: 2 }], 
        photosRating: { average: 4.7, count: 15},
        availableMedia: [
            { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/22189accdf7ee44d6ac4ad304ce2082c.jpg', price: 2, id: 'claudia_media_new_1', originalPrice: 2, viewed: false, rated: false, status: 'received_unopened' },
            { url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/cf6ba74c23117c8b44aecd3f0e633f4d.jpg', price: 3, id: 'claudia_media_new_2', originalPrice: 3, viewed: false, rated: false, status: 'received_unopened' }
        ],
        messages: [
          { id: 'm1', text: 'Hey! Prêt pour notre rdv sushi demain?', sender: 'Claudia', senderName: 'Claudia', timestamp: '10:00', type: 'text' },
          { id: 'm2', text: 'Oui, trop hâte! 🍣', sender: 'user', senderName: 'user', timestamp: '10:01', type: 'text' },
          { id: 'p1_claudia_sent', photoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/e8a0992928b0584c40cb6e682184d7f7.png', sender: 'Claudia', senderName: 'Claudia', timestamp: '10:05', type: 'photo', isBlurred: true, price: 1, viewed: false, rated: false, originalPrice: 1, status: 'received_unopened'},
          { id: 'm_claudia_reply', text: 'Salut ! Comment ça va ? 😊', sender: 'Claudia', senderName: 'Claudia', timestamp: '14:02', type: 'text' }
        ]
      },
      { 
        id: 'user2', name: 'Anais', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/ae73d1862e4b7446e276d192ab15c0c0.png', 
        avatarText: 'An', lastMessage: 'On se voit quand ?', unread: 0, online: false, timestamp: 'Hier', 
        liveCallCost: 3, photoPriceTiers: [{ count: 1, price: 1.50 }], 
        photosRating: { average: 4.2, count: 8 }, 
        availableMedia: [],
        messages: [{ id: 'm_anais_1', text: 'On se voit quand ?', sender: 'Anais', senderName: 'Anais', timestamp: 'Hier', type: 'text' }]
      },
      { 
        id: 'user3', name: 'Léa', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/1b48e0573679d6084182d39952ae465f.png', 
        avatarText: 'Lé', lastMessage: 'Tu as vu mon dernier post ?', unread: 3, online: true, timestamp: '13:30', 
        liveCallCost: 4, photoPriceTiers: [{ count: 5, price: 0.50 }], 
        photosRating: { average: 4.9, count: 25 }, 
        availableMedia: [],
        messages: [{ id: 'm_lea_1', text: 'Tu as vu mon dernier post ?', sender: 'Léa', senderName: 'Léa', timestamp: '13:30', type: 'text' }]
      },
      { 
        id: 'user4', name: 'Chloé', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/2d23c13a6a1609a504ac51435783c2c0.png', 
        avatarText: 'Ch', lastMessage: 'Week-end à la plage ? 🏖️', unread: 0, online: false, timestamp: 'Avant-hier', 
        liveCallCost: 2, photoPriceTiers: [{ count: 2, price: 2 }], 
        photosRating: { average: 4.0, count: 5 }, 
        availableMedia: [],
        messages: [{ id: 'm_chloe_1', text: 'Week-end à la plage ? 🏖️', sender: 'Chloé', senderName: 'Chloé', timestamp: 'Avant-hier', type: 'text' }]
      },
      { 
        id: 'user5', name: 'Manon', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/d232d670995b55a2410c9613d32f4a0c.png', 
        avatarText: 'Ma', lastMessage: 'J\'adore ton style !', unread: 1, online: true, timestamp: '12:15', 
        liveCallCost: 6, photoPriceTiers: [{ count: 10, price: 1 }], 
        photosRating: { average: 4.6, count: 30 }, 
        availableMedia: [],
        messages: [{ id: 'm_manon_1', text: 'J\'adore ton style !', sender: 'Manon', senderName: 'Manon', timestamp: '12:15', type: 'text' }]
      },
      { 
        id: 'user6', name: 'Camille', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/6d22f03995922c9d35e417f6f3410e6d.png', 
        avatarText: 'Ca', lastMessage: 'Merci pour le Superlike 😉', unread: 0, online: true, timestamp: '11:50', 
        liveCallCost: 3, photoPriceTiers: [{ count: 3, price: 1.50 }], 
        photosRating: { average: 4.3, count: 12 }, 
        availableMedia: [],
        messages: [{ id: 'm_camille_1', text: 'Merci pour le Superlike 😉', sender: 'Camille', senderName: 'Camille', timestamp: '11:50', type: 'text' }]
      },
      { 
        id: 'user7', name: 'Emma', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/3f5b874746d049c3d2c31563597e8a6e.png', 
        avatarText: 'Em', lastMessage: 'Prête pour ce soir ?', unread: 2, online: false, timestamp: 'Hier soir', 
        liveCallCost: 5, photoPriceTiers: [{ count: 1, price: 3 }], 
        photosRating: { average: 4.8, count: 22 }, 
        availableMedia: [],
        messages: [{ id: 'm_emma_1', text: 'Prête pour ce soir ?', sender: 'Emma', senderName: 'Emma', timestamp: 'Hier soir', type: 'text' }]
      },
      { 
        id: 'user8', name: 'Jade', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/f9a5b8a0768769a62591c99b5244688c.png', 
        avatarText: 'Ja', lastMessage: 'Je suis en voyage, je te réponds bientôt.', unread: 0, online: false, timestamp: 'Il y a 3 jours', 
        liveCallCost: 4, photoPriceTiers: [{ count: 4, price: 1 }], 
        photosRating: { average: 4.1, count: 10 }, 
        availableMedia: [],
        messages: [{ id: 'm_jade_1', text: 'Je suis en voyage, je te réponds bientôt.', sender: 'Jade', senderName: 'Jade', timestamp: 'Il y a 3 jours', type: 'text' }]
      },
      { 
        id: 'user9', name: 'Louise', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/a02ac08578273d7b801db37b1a9fe1f9.png', 
        avatarText: 'Lo', lastMessage: 'Tu fais quoi de beau ?', unread: 0, online: true, timestamp: '10:05', 
        liveCallCost: 7, photoPriceTiers: [{ count: 2, price: 2.50 }], 
        photosRating: { average: 4.5, count: 18 }, 
        availableMedia: [],
        messages: [{ id: 'm_louise_1', text: 'Tu fais quoi de beau ?', sender: 'Louise', senderName: 'Louise', timestamp: '10:05', type: 'text' }]
      },
      { 
        id: 'user10', name: 'Alice', 
        avatarImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/cc8b7720e17f260e5e7308230f4a97a2.png', 
        avatarText: 'Al', lastMessage: 'Salut 👋', unread: 5, online: true, timestamp: '09:45', 
        liveCallCost: 3, photoPriceTiers: [{ count: 1, price: 1 }], 
        photosRating: { average: 4.4, count: 14 }, 
        availableMedia: [],
        messages: [{ id: 'm_alice_1', text: 'Salut 👋', sender: 'Alice', senderName: 'Alice', timestamp: '09:45', type: 'text' }]
      }
    ];