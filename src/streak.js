/**
 * PhysiX — Daily Login Streak Engine & Firebase Email Tracking
 * Manages daily calendar streaks, broken streak detection, milestone celebrations,
 * and dual Firebase Firestore / Express / LocalStorage persistence.
 */

import { db, doc, getDoc, setDoc } from "./firebase.js";
import { api } from "./api.js";
import {
  showStreakLostAnimation,
  showStreakMilestoneAnimation
} from "./celebrations.js";
import { isCloudOperationAllowed } from "./user-data-service.js";

// Helper: Format date to local YYYY-MM-DD using user's local timezone (IST, etc.)
export function getLocalDateString(date = new Date()) {
  const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: Robustly parse and normalize any date input (ISO string, YYYY-MM-DD, timestamp, Date) to local YYYY-MM-DD
export function normalizeToLocalDateString(input) {
  if (!input) return getLocalDateString();
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? getLocalDateString() : getLocalDateString(input);
  }
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? getLocalDateString() : getLocalDateString(d);
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    // Check if it's already pure YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    // Parse as Date object to accurately extract local calendar components in the user's timezone
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return getLocalDateString(d);
    }
    // Fallback: match leading YYYY-MM-DD
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  return getLocalDateString();
}

// Helper: Calculate calendar day difference between two dates safely across all timezones
export function getDayDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return 0;
  const d1Str = normalizeToLocalDateString(dateStr1);
  const d2Str = normalizeToLocalDateString(dateStr2);
  if (d1Str === d2Str) return 0;

  const [y1, m1, day1] = d1Str.split("-").map(Number);
  const [y2, m2, day2] = d2Str.split("-").map(Number);

  // Set both to noon (12:00:00) in local time to avoid DST and midnight edge cases
  const t1 = new Date(y1, m1 - 1, day1, 12, 0, 0).getTime();
  const t2 = new Date(y2, m2 - 1, day2, 12, 0, 0).getTime();

  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

// Helper: Check if streak day count matches milestone criteria (10, 50, 100, 200, 300, 400, etc.)
export function isStreakMilestone(streak) {
  if (!streak || streak < 10) return false;
  if (streak === 10 || streak === 50) return true;
  if (streak >= 100 && streak % 100 === 0) return true;
  return false;
}

// Helper: Compute next milestone target
export function getNextStreakMilestone(currentStreak = 1) {
  if (currentStreak < 10) return 10;
  if (currentStreak < 50) return 50;
  if (currentStreak < 100) return 100;
  return Math.ceil((currentStreak + 1) / 100) * 100;
}

// Local Storage Fallback Key
function getStreakStorageKey(userId = "guest") {
  return `physix_user_streak_${userId}`;
}

// Read Streak data locally
export function getStoredUserStreak(userId = "guest") {
  try {
    const raw = localStorage.getItem(getStreakStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          currentStreak: Number(parsed.currentStreak) || 0,
          highestStreak: Number(parsed.highestStreak) || Number(parsed.currentStreak) || 0,
          lastLoginDate: parsed.lastLoginDate ? normalizeToLocalDateString(parsed.lastLoginDate) : null,
          lastBrokenStreak: Number(parsed.lastBrokenStreak) || 0,
          lastBrokenDate: parsed.lastBrokenDate ? normalizeToLocalDateString(parsed.lastBrokenDate) : null
        };
      }
    }
  } catch (e) {
    console.warn("[Streak] Error reading local streak:", e);
  }
  return {
    currentStreak: 0,
    highestStreak: 0,
    lastLoginDate: null,
    lastBrokenStreak: 0,
    lastBrokenDate: null
  };
}

// Save Streak data locally
export function saveStoredUserStreak(userId = "guest", streakData) {
  try {
    const safeData = {
      currentStreak: Number(streakData.currentStreak) || 0,
      highestStreak: Number(streakData.highestStreak) || Number(streakData.currentStreak) || 0,
      lastLoginDate: streakData.lastLoginDate ? normalizeToLocalDateString(streakData.lastLoginDate) : getLocalDateString(),
      lastBrokenStreak: Number(streakData.lastBrokenStreak) || 0,
      lastBrokenDate: streakData.lastBrokenDate ? normalizeToLocalDateString(streakData.lastBrokenDate) : null
    };
    localStorage.setItem(getStreakStorageKey(userId), JSON.stringify(safeData));
  } catch (e) {
    console.warn("[Streak] Error saving local streak:", e);
  }
}

// Sync Streak with Firebase Firestore & track user email
export async function syncStreakWithFirebase(user, streakData) {
  if (!user || !user.uid) return;

  // Guard: Skip cloud sync when offline
  if (!navigator.onLine || !isCloudOperationAllowed()) {
    console.log("[Streak] Offline mode: Skipping Firebase/Express streak sync");
    return;
  }

  const cleanLastLogin = normalizeToLocalDateString(streakData.lastLoginDate || new Date());
  const payload = {
    email: user.email || "",
    uid: user.uid,
    streak: Number(streakData.currentStreak) || 0,
    highestStreak: Number(streakData.highestStreak) || Number(streakData.currentStreak) || 0,
    lastLoginDate: cleanLastLogin,
    lastSeenAt: new Date().toISOString(),
    authProvider: user.providerData?.[0]?.providerId || "password",
    updatedAt: new Date().toISOString()
  };

  // 1. Sync to Firebase Firestore (persist both streak, highestStreak, and lastLoginDate)
  if (db) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        streak: payload.streak,
        highestStreak: payload.highestStreak,
        lastLoginDate: payload.lastLoginDate,
        lastActiveDate: payload.lastSeenAt,
        updatedAt: payload.updatedAt
      }, { merge: true });
    } catch (err) {
      console.warn("[Firebase] Firestore streak sync notice:", err.message);
    }
  }

  // 2. Sync to Express Backend
  try {
    await api.saveProfile(user.uid, {
      email: user.email,
      streak: payload.streak,
      highestStreak: payload.highestStreak,
      lastLoginDate: payload.lastLoginDate
    });
  } catch (err) {}
}

// Fetch Streak from Firebase Firestore / Express Backend on login
export async function fetchStreakFromFirebase(user) {
  if (!user || !user.uid) return null;
  
  // Guard: Skip cloud fetch when offline
  if (!navigator.onLine || !isCloudOperationAllowed()) {
    console.log("[Streak] Offline mode: Skipping Firebase streak fetch");
    return null;
  }
  
  // 1. Try Firebase Firestore
  if (db) {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && (data.streak !== undefined || data.lastActiveDate || data.lastLoginDate)) {
          const rawDate = data.lastLoginDate || data.lastActiveDate || null;
          return {
            currentStreak: Number(data.streak) || 0,
            highestStreak: Number(data.highestStreak) || Number(data.streak) || 0,
            lastLoginDate: rawDate ? normalizeToLocalDateString(rawDate) : null
          };
        }
      }
    } catch (err) {
      console.warn("[Firebase] Could not fetch Firestore streak:", err.message);
    }
  }

  // 2. Express Backend Fallback
  try {
    const res = await api.getProfile(user.uid);
    if (res && res.profile && (res.profile.streak !== undefined || res.profile.lastLoginDate)) {
      const rawDate = res.profile.lastLoginDate || res.profile.updatedAt || null;
      return {
        currentStreak: Number(res.profile.streak) || 0,
        highestStreak: Number(res.profile.highestStreak) || Number(res.profile.streak) || 0,
        lastLoginDate: rawDate ? normalizeToLocalDateString(rawDate) : null
      };
    }
  } catch (err) {}

  return null;
}

/**
 * Process Daily User Streak on Login / Auth Transition / Daily Activity
 * Handles daily increments, broken streaks, and milestone animations.
 */
export async function processUserDailyStreak(user) {
  const userId = user ? user.uid : "guest";
  const userEmail = user ? (user.email || user.displayName || "PhysiX Scholar") : "Guest User";
  const todayStr = getLocalDateString();

  // Read local stored data
  let stored = getStoredUserStreak(userId);
  if (stored && stored.lastLoginDate) {
    stored.lastLoginDate = normalizeToLocalDateString(stored.lastLoginDate);
  }

  // In offline mode: Do NOT increment, break, or save streaks
  if (!navigator.onLine || !isCloudOperationAllowed()) {
    console.log("[Streak] Offline mode: Preserving existing streak without modification");
    return { ...stored, status: "offline_preserved", changed: false };
  }

  // Fetch remote Firestore streak if authenticated
  if (user && db) {
    try {
      const remoteData = await fetchStreakFromFirebase(user);
      if (remoteData && remoteData.lastLoginDate) {
        const remoteDate = normalizeToLocalDateString(remoteData.lastLoginDate);
        const storedDate = stored.lastLoginDate ? normalizeToLocalDateString(stored.lastLoginDate) : null;
        
        // Merge highest streak seen
        const bestStreak = Math.max(Number(remoteData.currentStreak) || 0, Number(stored.currentStreak) || 0);
        const bestHighest = Math.max(
          Number(remoteData.highestStreak) || 0,
          Number(stored.highestStreak) || 0,
          bestStreak
        );

        // Pick the most recent login date
        let latestDate = storedDate || remoteDate;
        if (storedDate && remoteDate) {
          const diffBetweenSources = getDayDifference(storedDate, remoteDate);
          if (diffBetweenSources > 0) {
            latestDate = remoteDate; // remote is more recent
          } else {
            latestDate = storedDate; // stored is more recent or same
          }
        }

        stored = {
          ...stored,
          currentStreak: bestStreak,
          highestStreak: bestHighest,
          lastLoginDate: latestDate
        };
      }
    } catch (e) {
      console.warn("[Streak] Error merging remote streak:", e);
    }
  }

  const { lastLoginDate, currentStreak = 0, highestStreak = 0 } = stored;

  // Case 1: First ever activity or uninitialized streak
  if (!lastLoginDate || currentStreak === 0) {
    const newStreakData = {
      currentStreak: 1,
      highestStreak: Math.max(highestStreak, 1),
      lastLoginDate: todayStr,
      lastBrokenStreak: 0,
      lastBrokenDate: null
    };
    saveStoredUserStreak(userId, newStreakData);
    syncStreakWithFirebase(user, newStreakData);
    return { ...newStreakData, status: "initial", changed: true };
  }

  // Calculate day difference using robust calendar normalization
  const diffDays = getDayDifference(lastLoginDate, todayStr);

  // Case 2: Same calendar day activity (streak preserved, idempotent)
  if (diffDays === 0) {
    const newStreakData = {
      ...stored,
      currentStreak: Math.max(1, currentStreak),
      highestStreak: Math.max(highestStreak, currentStreak, 1),
      lastLoginDate: todayStr
    };
    saveStoredUserStreak(userId, newStreakData);
    syncStreakWithFirebase(user, newStreakData);
    return { ...newStreakData, status: "same_day", changed: false };
  }

  // Case 3: Exactly 1 calendar day passed (Streak Maintained & Incremented!)
  if (diffDays === 1) {
    const nextStreak = currentStreak + 1;
    const nextHighest = Math.max(highestStreak, nextStreak);
    const newStreakData = {
      currentStreak: nextStreak,
      highestStreak: nextHighest,
      lastLoginDate: todayStr,
      lastBrokenStreak: 0,
      lastBrokenDate: null
    };

    saveStoredUserStreak(userId, newStreakData);
    syncStreakWithFirebase(user, newStreakData);

    // Check if user reached a milestone (10, 50, 100, 200, 300, 400, etc.)
    if (isStreakMilestone(nextStreak)) {
      setTimeout(() => {
        showStreakMilestoneAnimation({
          streakDays: nextStreak,
          highestStreak: nextHighest,
          email: userEmail
        });
      }, 500);
    }

    return { ...newStreakData, status: "incremented", changed: true };
  }

  // Case 4: Missed one or more days (diffDays > 1) -> Streak Lost!
  if (diffDays > 1) {
    const lostStreakCount = currentStreak;
    const newStreakData = {
      currentStreak: 1,
      highestStreak: Math.max(highestStreak, 1),
      lastLoginDate: todayStr,
      lastBrokenStreak: lostStreakCount,
      lastBrokenDate: todayStr
    };

    saveStoredUserStreak(userId, newStreakData);
    syncStreakWithFirebase(user, newStreakData);

    // Trigger Streak Lost Animation if previous streak was 1 or higher
    if (lostStreakCount >= 1) {
      setTimeout(() => {
        showStreakLostAnimation({
          lostStreak: lostStreakCount,
          newStreak: 1,
          email: userEmail
        });
      }, 500);
    }

    return { ...newStreakData, status: "broken", lostStreak: lostStreakCount, changed: true };
  }

  // Fallback for clock skew (diffDays < 0): preserve streak and update date to today if today is newer
  return { ...stored, status: "unchanged", changed: false };
}

