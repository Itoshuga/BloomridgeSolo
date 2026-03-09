import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type PlayerRole = 0 | 1 | 2 | 3;

export type RegisterPlayerInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginPlayerInput = {
  email: string;
  password: string;
};

export type PlayerProfile = {
  uid: string;
  username: string;
  email: string;
  mail: string;
  role: PlayerRole;
  level: number;
  experience: number;
  coins: number;
  energy: number;
  farm?: {
    name?: string;
    tier?: number;
    tilesUnlocked?: number;
  };
  flags?: {
    tutorialCompleted?: boolean;
    emailVerified?: boolean;
    newsletterOptIn?: boolean;
  };
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();
const normalizeUsername = (username: string): string => username.trim().replace(/\s+/g, ' ');

export const registerPlayer = async ({ username, email, password }: RegisterPlayerInput) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedUsername = normalizeUsername(username);

  const credentials = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  await updateProfile(credentials.user, { displayName: normalizedUsername });

  const role: PlayerRole = 0;
  const now = serverTimestamp();

  await setDoc(doc(db, 'players', credentials.user.uid), {
    uid: credentials.user.uid,
    username: normalizedUsername,
    email: normalizedEmail,
    mail: normalizedEmail,
    role,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    level: 1,
    experience: 0,
    coins: 0,
    energy: 100,
    farm: {
      name: `${normalizedUsername}'s Farm`,
      tier: 1,
      tilesUnlocked: 12,
    },
    inventory: {
      seeds: 5,
      toolsUnlocked: ['starter_hoe', 'starter_watering_can'],
    },
    settings: {
      locale: 'fr',
      musicEnabled: true,
      sfxEnabled: true,
    },
    flags: {
      tutorialCompleted: false,
      emailVerified: credentials.user.emailVerified,
      newsletterOptIn: false,
    },
  });

  return credentials.user;
};

export const loginPlayer = async ({ email, password }: LoginPlayerInput) => {
  const normalizedEmail = normalizeEmail(email);
  const credentials = await signInWithEmailAndPassword(auth, normalizedEmail, password);

  await setDoc(
    doc(db, 'players', credentials.user.uid),
    {
      email: normalizedEmail,
      mail: normalizedEmail,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      flags: {
        emailVerified: credentials.user.emailVerified,
      },
    },
    { merge: true },
  );

  return credentials.user;
};

export const getPlayerProfile = async (uid: string): Promise<PlayerProfile | null> => {
  const playerSnapshot = await getDoc(doc(db, 'players', uid));
  if (!playerSnapshot.exists()) {
    return null;
  }
  return playerSnapshot.data() as PlayerProfile;
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Cet email est deja utilise.',
  'auth/invalid-email': 'L adresse email est invalide.',
  'auth/weak-password': 'Le mot de passe est trop faible (6 caracteres minimum).',
  'auth/user-not-found': 'Aucun compte ne correspond a cet email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Email ou mot de passe invalide.',
  'auth/too-many-requests': 'Trop de tentatives. Reessaie dans quelques minutes.',
  'auth/network-request-failed': 'Erreur reseau. Verifie ta connexion.',
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? 'Une erreur est survenue pendant l authentification.';
  }
  return 'Une erreur est survenue pendant l authentification.';
};
