/**
 * PhysiX — Comprehensive Firestore User & Subcollections Data Service
 * 
 * Database Schema:
 * users
 *  └── {uid}
 *       ├── name
 *       ├── email
 *       ├── totalXP
 *       ├── level
 *       ├── streak
 *       ├── lastActiveDate
 *       ├── experimentsPerformed
 *       ├── quizzesAttempted
 *       ├── quizzesCompleted
 *       ├── totalQuizScore
 *       ├── bestQuizScore
 *       ├── createdAt
 *       └── updatedAt
 * 
 *       experiments (subcollection)
 *        └── {experimentId}
 *             ├── experimentName
 *             ├── attempts
 *             ├── completed
 *             ├── bestScore
 *             ├── xpEarned
 *             └── lastPerformed
 * 
 *       quizAttempts (subcollection)
 *        └── {attemptId}
 *             ├── quizId
 *             ├── score
 *             ├── totalQuestions
 *             ├── percentage
 *             ├── xpEarned
 *             └── attemptedAt
 */

import {
  db,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit
} from "./firebase.js";

/**
 * Initialize or update the user document in Firestore users/{uid}
 */
export async function syncUserToFirestore(user, customData = {}) {
  if (!user || !user.uid || !db) return null;

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();

    const name = customData.name || user.displayName || (user.email ? user.email.split("@")[0] : "PhysiX Scholar");
    const email = user.email || "";

    if (!snap.exists()) {
      // Create initial document matching schema
      const initialDoc = {
        name,
        email,
        totalXP: customData.totalXP || 0,
        level: customData.level || 1,
        streak: customData.streak || 1,
        lastActiveDate: now,
        experimentsPerformed: customData.experimentsPerformed || 0,
        quizzesAttempted: customData.quizzesAttempted || 0,
        quizzesCompleted: customData.quizzesCompleted || 0,
        totalQuizScore: customData.totalQuizScore || 0,
        bestQuizScore: customData.bestQuizScore || 0,
        createdAt: now,
        updatedAt: now,
        ...(customData.extra || {})
      };

      await setDoc(userRef, initialDoc);
      console.log(`%c[Firestore] ✓ Successfully created new user document: users/${user.uid}`, "color: #10b981; font-weight: bold;");
      return initialDoc;
    } else {
      // Update existing document
      const current = snap.data();
      const updates = {
        name: customData.name || current.name || name,
        email: email || current.email,
        lastActiveDate: now,
        updatedAt: now
      };

      if (typeof customData.totalXP === "number") updates.totalXP = Math.max(current.totalXP || 0, customData.totalXP);
      if (typeof customData.level === "number") updates.level = Math.max(current.level || 1, customData.level);
      if (typeof customData.streak === "number") updates.streak = customData.streak;
      if (typeof customData.experimentsPerformed === "number") updates.experimentsPerformed = customData.experimentsPerformed;
      if (typeof customData.quizzesAttempted === "number") updates.quizzesAttempted = customData.quizzesAttempted;
      if (typeof customData.quizzesCompleted === "number") updates.quizzesCompleted = customData.quizzesCompleted;
      if (typeof customData.totalQuizScore === "number") updates.totalQuizScore = customData.totalQuizScore;
      if (typeof customData.bestQuizScore === "number") updates.bestQuizScore = Math.max(current.bestQuizScore || 0, customData.bestQuizScore);

      await setDoc(userRef, updates, { merge: true });
      console.log(`%c[Firestore] ✓ Successfully synced user document: users/${user.uid}`, "color: #10b981; font-weight: bold;");
      return { ...current, ...updates };
    }
  } catch (err) {
    console.error("[Firestore] syncUserToFirestore error:", err);
    return null;
  }
}

/**
 * Record experiment activity in users/{uid}/experiments/{experimentId}
 */
export async function recordExperimentInFirestore(uid, experimentId, expData = {}) {
  if (!uid || !db || uid === "guest") return null;

  try {
    const expDocRef = doc(db, "users", uid, "experiments", experimentId);
    const expSnap = await getDoc(expDocRef);
    const now = new Date().toISOString();

    let attempts = 1;
    let completed = Boolean(expData.completed);
    let bestScore = expData.score || expData.accuracy || 100;
    let xpEarned = expData.xpEarned || 0;

    if (expSnap.exists()) {
      const prev = expSnap.data();
      attempts = (prev.attempts || 0) + 1;
      completed = completed || Boolean(prev.completed);
      bestScore = Math.max(prev.bestScore || 0, bestScore);
      xpEarned = (prev.xpEarned || 0) + (expData.xpEarned || 0);
    }

    const payload = {
      experimentName: expData.experimentName || getExperimentNameById(experimentId),
      attempts,
      completed,
      bestScore,
      xpEarned,
      lastPerformed: now
    };

    await setDoc(expDocRef, payload, { merge: true });
    console.log(`%c[Firestore] ✓ Recorded experiment in users/${uid}/experiments/${experimentId}`, "color: #06b6d4; font-weight: bold;");

    // Also update parent user document counter
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const uData = userSnap.data();
      const newTotalXp = (uData.totalXP || 0) + (expData.xpEarned || 0);
      await setDoc(userRef, {
        experimentsPerformed: (uData.experimentsPerformed || 0) + 1,
        totalXP: newTotalXp,
        lastActiveDate: now,
        updatedAt: now
      }, { merge: true });
    }

    return payload;
  } catch (err) {
    console.error("[Firestore] recordExperimentInFirestore error:", err);
    return null;
  }
}

/**
 * Record a completed or attempted quiz in users/{uid}/quizAttempts/{attemptId}
 */
export async function recordQuizAttemptInFirestore(uid, attemptData) {
  if (!uid || !db || uid === "guest") return null;

  try {
    const attemptsColl = collection(db, "users", uid, "quizAttempts");
    const now = new Date().toISOString();
    const score = Number(attemptData.score || 0);
    const totalQuestions = Number(attemptData.totalQuestions || 10);
    const percentage = Number(attemptData.percentage || Math.round((score / totalQuestions) * 100));
    const xpEarned = Number(attemptData.xpEarned || (score * 10));

    const attemptDoc = {
      quizId: attemptData.quizId || "kinematics-mastery-quiz",
      score,
      totalQuestions,
      percentage,
      xpEarned,
      attemptedAt: now
    };

    const added = await addDoc(attemptsColl, attemptDoc);
    console.log(`%c[Firestore] ✓ Logged quiz attempt in users/${uid}/quizAttempts/${added.id}`, "color: #a855f7; font-weight: bold;");

    // Update parent user document metrics
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const uData = userSnap.data();
      const prevAttempted = uData.quizzesAttempted || 0;
      const prevCompleted = uData.quizzesCompleted || 0;
      const prevTotalScore = uData.totalQuizScore || 0;
      const prevBestScore = uData.bestQuizScore || 0;
      const prevTotalXp = uData.totalXP || 0;

      await setDoc(userRef, {
        quizzesAttempted: prevAttempted + 1,
        quizzesCompleted: prevCompleted + 1,
        totalQuizScore: prevTotalScore + score,
        bestQuizScore: Math.max(prevBestScore, score),
        totalXP: prevTotalXp + xpEarned,
        lastActiveDate: now,
        updatedAt: now
      }, { merge: true });
    }

    return { id: added.id, ...attemptDoc };
  } catch (err) {
    console.error("[Firestore] recordQuizAttemptInFirestore error:", err);
    return null;
  }
}

/**
 * Fetch full user profile and subcollections from Firestore
 */
export async function fetchFullUserDataFromFirestore(uid) {
  if (!uid || !db || uid === "guest") return null;

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;

    const userData = userSnap.data();

    // Fetch experiments subcollection
    const expColl = collection(db, "users", uid, "experiments");
    const expSnaps = await getDocs(expColl);
    const experiments = {};
    expSnaps.forEach((d) => {
      experiments[d.id] = d.data();
    });

    // Fetch quizAttempts subcollection (last 20 attempts)
    const quizColl = collection(db, "users", uid, "quizAttempts");
    const qQuery = query(quizColl, orderBy("attemptedAt", "desc"), limit(20));
    let quizAttempts = [];
    try {
      const qSnaps = await getDocs(qQuery);
      qSnaps.forEach((d) => {
        quizAttempts.push({ id: d.id, ...d.data() });
      });
    } catch (e) {
      // Fallback without query order
      const qSnaps = await getDocs(quizColl);
      qSnaps.forEach((d) => {
        quizAttempts.push({ id: d.id, ...d.data() });
      });
    }

    return {
      user: userData,
      experiments,
      quizAttempts
    };
  } catch (err) {
    console.warn("[Firestore] fetchFullUserDataFromFirestore notice:", err.message);
    return null;
  }
}

function getExperimentNameById(id) {
  switch (id) {
    case "projectile":
    case "exp-projectile":
      return "2D Projectile Motion";
    case "optical":
    case "exp-optical":
      return "Determination of Numerical Aperture of an Optical Fibre";
    case "colour-sensor":
    case "exp-colour-sensor":
      return "Study of Colour Sensor (TCS3200)";
    default:
      return id;
  }
}
