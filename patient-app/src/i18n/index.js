import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      doctors: 'My Doctors',
      feedback: 'Feedback',
      profile: 'Profile',
      logout: 'Logout',
      
      // Login
      login: 'Login',
      email: 'Email',
      password: 'Password',
      loginButton: 'Sign In',
      loginError: 'Invalid credentials. Please try again.',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      invalidEmail: 'Please enter a valid email address',
      
      // Dashboard
      welcomeBack: 'Welcome back',
      quickSummary: 'Quick Summary',
      appointmentsToday: 'Appointments Today',
      unreadMessages: 'Unread Messages',
      pendingTests: 'Pending Tests',
      myDoctors: 'My Doctors',
      totalAssigned: 'Total Assigned',
      noDoctorsAssigned: 'No doctors assigned yet',
      generalPractice: 'General Practice',
      profileStatus: 'Profile Status',
      completion: 'Completion',
      nameCompleted: 'Name completed',
      nameMissing: 'Name missing',
      phoneVerified: 'Phone verified',
      phoneMissing: 'Phone missing',
      feedbackStatus: 'Feedback Status',
      recentSubmissions: 'Recent Submissions',
      lastRating: 'Last Rating',
      pendingRequests: 'Pending Requests',
      lastFeedback: 'Last feedback',
      voiceMessageSubmitted: 'Voice message submitted',
      noFeedbackYet: 'No feedback submitted yet',
      healthOverviewToday: 'Here\'s your health overview for today',
      
      // Doctors
      searchDoctors: 'Search doctors...',
      filterBySpecialty: 'Filter by specialty',
      allSpecialties: 'All Specialties',
      contactDoctor: 'Contact',
      noDoctorsFound: 'No doctors found matching your criteria',
      
      // Profile
      personalInformation: 'Personal Information',
      name: 'Full Name',
      preferences: 'Preferences',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      saveChanges: 'Save Changes',
      profileUpdated: 'Profile updated successfully!',
      nameRequired: 'Name is required',
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      notificationPreferences: 'Notification Preferences',
      chooseNotificationMethod: 'Choose how you want to receive notifications',
      choosePreferredTheme: 'Choose your preferred theme',
      selectPreferredLanguage: 'Select your preferred language',
      manageAccountSettings: 'Manage your account settings and preferences',
      enterFirstName: 'Enter your first name',
      enterLastName: 'Enter your last name',
      enterEmailAddress: 'Enter your email address',
      enterPhoneNumber: 'Enter your phone number',
      enterAddress: 'Enter your address',
      enterNewPassword: 'Enter new password',
      confirmNewPassword: 'Confirm new password',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      invalidPhoneNumber: 'Please enter a valid phone number',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      profileUpdateFailed: 'Failed to update profile',
      saving: 'Saving...',
      optional: 'Optional',
      sms: 'SMS',
      voice: 'Voice',
      
      // Feedback
      feedbackTitle: 'Share Your Feedback',
      feedbackDescription: 'Help us improve our services by sharing your experience',
      writtenFeedback: 'Written Feedback',
      voiceRecording: 'Voice Recording',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      playRecording: 'Play Recording',
      cancelRecording: 'Cancel Recording',
      recordingTime: 'Recording Time',
      rating: 'Rating',
      howDoYouFeel: 'How do you feel?',
      feedbackRequired: 'Please provide at least one type of feedback',
      feedbackSubmitted: 'Feedback submitted successfully!',
      feedbackError: 'Failed to submit feedback',
      submitting: 'Submitting...',
      submitFeedback: 'Submit Feedback',
      characterCount: 'characters',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      
      // Error pages
      pageNotFound: 'Page Not Found',
      pageNotFoundDesc: 'The page you are looking for does not exist.',
      backToDashboard: 'Back to Dashboard',
      somethingWentWrong: 'Something went wrong',
      tryAgain: 'Try Again',
      offline: 'You are offline',
      offlineDesc: 'Please check your internet connection.',
      
      // Logout
      logoutConfirm: 'Are you sure you want to logout?',
      logoutConfirmDesc: 'You will be redirected to the login page.',
      
      // Departments
      outpatient: 'Outpatient',
      cardiology: 'Cardiology',
      emergency: 'Emergency',
      radiology: 'Radiology',
      pediatrics: 'Pediatrics',
      oncology: 'Oncology'
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      doctors: 'Mes Médecins',
      feedback: 'Commentaires',
      profile: 'Profil',
      logout: 'Déconnexion',
      
      // Login
      login: 'Connexion',
      email: 'E-mail',
      password: 'Mot de passe',
      loginButton: 'Se connecter',
      loginError: 'Identifiants invalides. Veuillez réessayer.',
      emailRequired: 'L\'e-mail est requis',
      passwordRequired: 'Le mot de passe est requis',
      invalidEmail: 'Veuillez saisir une adresse e-mail valide',
      
      // Dashboard
      welcomeBack: 'Bon retour',
      quickSummary: 'Résumé rapide',
      appointmentsToday: 'Rendez-vous aujourd\'hui',
      unreadMessages: 'Messages non lus',
      pendingTests: 'Tests en attente',
      myDoctors: 'Mes Médecins',
      totalAssigned: 'Total Assigné',
      noDoctorsAssigned: 'Aucun médecin assigné pour le moment',
      generalPractice: 'Médecine Générale',
      profileStatus: 'Statut du Profil',
      completion: 'Achèvement',
      nameCompleted: 'Nom complété',
      nameMissing: 'Nom manquant',
      phoneVerified: 'Téléphone vérifié',
      phoneMissing: 'Téléphone manquant',
      feedbackStatus: 'Statut des Commentaires',
      recentSubmissions: 'Soumissions Récentes',
      lastRating: 'Dernière Évaluation',
      pendingRequests: 'Demandes en Attente',
      lastFeedback: 'Dernier commentaire',
      voiceMessageSubmitted: 'Message vocal soumis',
      noFeedbackYet: 'Aucun commentaire soumis pour le moment',
      healthOverviewToday: 'Voici votre aperçu de santé pour aujourd\'hui',
      
      // Doctors
      searchDoctors: 'Rechercher des médecins...',
      filterBySpecialty: 'Filtrer par spécialité',
      allSpecialties: 'Toutes les spécialités',
      contactDoctor: 'Contacter',
      noDoctorsFound: 'Aucun médecin trouvé correspondant à vos critères',
      
      // Profile
      personalInformation: 'Informations personnelles',
      name: 'Nom complet',
      preferences: 'Préférences',
      theme: 'Thème',
      language: 'Langue',
      light: 'Clair',
      dark: 'Sombre',
      saveChanges: 'Sauvegarder les modifications',
      profileUpdated: 'Profil mis à jour avec succès !',
      nameRequired: 'Le nom est requis',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      phoneNumber: 'Numéro de téléphone',
      address: 'Adresse',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      notificationPreferences: 'Préférences de notification',
      chooseNotificationMethod: 'Choisissez comment vous souhaitez recevoir les notifications',
      choosePreferredTheme: 'Choisissez votre thème préféré',
      selectPreferredLanguage: 'Sélectionnez votre langue préférée',
      manageAccountSettings: 'Gérez les paramètres et préférences de votre compte',
      enterFirstName: 'Entrez votre prénom',
      enterLastName: 'Entrez votre nom de famille',
      enterEmailAddress: 'Entrez votre adresse e-mail',
      enterPhoneNumber: 'Entrez votre numéro de téléphone',
      enterAddress: 'Entrez votre adresse',
      enterNewPassword: 'Entrez le nouveau mot de passe',
      confirmNewPassword: 'Confirmez le nouveau mot de passe',
      firstNameRequired: 'Le prénom est requis',
      lastNameRequired: 'Le nom de famille est requis',
      invalidPhoneNumber: 'Veuillez entrer un numéro de téléphone valide',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      profileUpdateFailed: 'Échec de la mise à jour du profil',
      saving: 'Sauvegarde...',
      optional: 'Optionnel',
      sms: 'SMS',
      voice: 'Voix',
      
      // Feedback
      feedbackTitle: 'Partagez vos commentaires',
      feedbackDescription: 'Aidez-nous à améliorer nos services en partageant votre expérience',
      writtenFeedback: 'Commentaires écrits',
      voiceRecording: 'Enregistrement vocal',
      startRecording: 'Commencer l\'enregistrement',
      stopRecording: 'Arrêter l\'enregistrement',
      playRecording: 'Lire l\'enregistrement',
      cancelRecording: 'Annuler l\'enregistrement',
      recordingTime: 'Temps d\'enregistrement',
      rating: 'Évaluation',
      howDoYouFeel: 'Comment vous sentez-vous ?',
      feedbackRequired: 'Veuillez fournir au moins un type de commentaire',
      feedbackSubmitted: 'Commentaires soumis avec succès !',
      feedbackError: 'Échec de la soumission des commentaires',
      submitting: 'Soumission en cours...',
      submitFeedback: 'Soumettre les commentaires',
      characterCount: 'caractères',
      
      // Common
      loading: 'Chargement...',
      error: 'Erreur',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      close: 'Fermer',
      search: 'Rechercher',
      filter: 'Filtrer',
      
      // Error pages
      pageNotFound: 'Page non trouvée',
      pageNotFoundDesc: 'La page que vous recherchez n\'existe pas.',
      backToDashboard: 'Retour au tableau de bord',
      somethingWentWrong: 'Quelque chose s\'est mal passé',
      tryAgain: 'Réessayer',
      offline: 'Vous êtes hors ligne',
      offlineDesc: 'Veuillez vérifier votre connexion Internet.',
      
      // Logout
      logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      logoutConfirmDesc: 'Vous serez redirigé vers la page de connexion.',
      
      // Departments
      outpatient: 'Consultation externe',
      cardiology: 'Cardiologie',
      emergency: 'Urgences',
      radiology: 'Radiologie',
      pediatrics: 'Pédiatrie',
      oncology: 'Oncologie'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
