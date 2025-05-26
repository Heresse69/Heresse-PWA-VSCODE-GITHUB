// Simulation d'une base de données utilisateurs pour distinguer login vs signup
const USERS_DB_KEY = 'heresse_users_db';

// Utilisateurs existants simulés par défaut
const defaultUsers = [
  {
    id: '1',
    email: 'user@example.com',
    phone: '+33612345678',
    password: 'password123',
    kycComplete: true
  },
  {
    id: '2', 
    email: 'test@test.com',
    phone: '+33687654321',
    password: 'test123',
    kycComplete: true
  }
];

// Initialiser la base de données avec des utilisateurs par défaut
export const initializeUserDatabase = () => {
  const existingDB = localStorage.getItem(USERS_DB_KEY);
  if (!existingDB) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  const usersDB = localStorage.getItem(USERS_DB_KEY);
  return usersDB ? JSON.parse(usersDB) : [];
};

// Vérifier si un utilisateur existe par email
export const checkUserExistsByEmail = (email) => {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Vérifier si un utilisateur existe par téléphone
export const checkUserExistsByPhone = (phone) => {
  const users = getAllUsers();
  return users.find(user => user.phone === phone);
};

// Authentifier un utilisateur avec email/mot de passe
export const authenticateUser = (email, password) => {
  const user = checkUserExistsByEmail(email);
  if (user && user.password === password) {
    return { success: true, user };
  }
  return { success: false, error: 'Email ou mot de passe incorrect' };
};

// Authentifier un utilisateur avec téléphone (simulation SMS)
export const authenticateUserBySMS = (phone) => {
  const user = checkUserExistsByPhone(phone);
  if (user) {
    return { success: true, user };
  }
  return { success: false, error: 'Numéro de téléphone non reconnu' };
};

// Créer un nouvel utilisateur
export const createUser = (userData) => {
  const users = getAllUsers();
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = checkUserExistsByEmail(userData.email) || 
                      (userData.phone && checkUserExistsByPhone(userData.phone));
  
  if (existingUser) {
    return { success: false, error: 'Un compte existe déjà avec ces informations' };
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    kycComplete: false // Les nouveaux utilisateurs doivent faire le KYC
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  
  return { success: true, user: newUser };
};

// Mettre à jour le statut KYC d'un utilisateur
export const updateUserKycStatus = (userId, kycComplete = true) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].kycComplete = kycComplete;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    return { success: true, user: users[userIndex] };
  }
  
  return { success: false, error: 'Utilisateur non trouvé' };
};

// Récupérer un utilisateur par ID
export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find(user => user.id === userId);
};
