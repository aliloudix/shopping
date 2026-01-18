import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getUserRole } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // On demande à NOTRE backend quel est le rôle de cet utilisateur
        let userRole = 'client';
        
        // FAIL-SAFE: Si c'est l'email de l'admin, on force le rôle 'admin'
        // Cela garantit que l'admin fonctionne même si la base de données a un problème
        if (currentUser.email === 'admin@devmob.com') {
          userRole = 'admin';
        } else {
          try {
            const roleData = await getUserRole(currentUser.email);
            if (roleData && roleData.success) {
              userRole = roleData.role;
            }
          } catch (e) {
            console.error("Erreur récupération rôle", e);
          }
        }

        setUser({
          ...currentUser,
          name: currentUser.displayName || currentUser.email.split('@')[0],
          isLoggedIn: true,
          role: userRole, // On stocke le rôle ici (admin ou client)
        });
      } else {
        setUser({ isLoggedIn: false });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Récupérer le rôle immédiatement pour la redirection
      let role = 'client';
      try {
        const roleData = await getUserRole(email);
        if (roleData && roleData.success) {
          role = roleData.role;
        }
      } catch (e) {
        console.log("Erreur fetch role login", e);
      }

      // Si c'est l'admin en dur (au cas où la DB échoue)
      if (email === 'admin@devmob.com') role = 'admin';

      return { success: true, role: role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // 1. Création dans Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // 2. Synchronisation immédiate avec MySQL (Création de l'entrée dans la table users)
      try {
        const syncResult = await getUserRole(email); // Cette fonction crée l'utilisateur s'il n'existe pas
        console.log("Résultat synchro MySQL:", syncResult);
        
        if (!syncResult) {
           throw new Error("Pas de réponse du serveur MySQL");
        }
      } catch (dbError) {
        console.error("Erreur CRITIQUE de synchronisation MySQL:", dbError);
        // On renvoie cette erreur pour l'afficher à l'utilisateur
        return { success: true, warning: "Compte créé sur Firebase, mais échec liaison MySQL: " + dbError.message };
      }

      // Mise à jour locale
      setUser(prev => ({ ...prev, name }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

