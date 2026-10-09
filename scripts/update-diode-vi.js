import fs from 'fs';

let code = fs.readFileSync('src/diode-vi.js', 'utf8');

// 1. Update challenges object
const oldChallenges = `    // Gamification Challenges
    challenges: {
      setRangesForward: {
        title: "Challenge 1 — Forward Bias Meter Range Alignment",
        desc: "Set Voltmeter = 1.5 V and Ammeter = 10 mA (Upper Scales active).",
        xp: 60,
        completed: false
      },
      wireForward: {
        title: "Challenge 2 — Forward Bias Circuit Patching",
        desc: "Connect series milliammeter, forward diode (P to +, N to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      logForward: {
        title: "Challenge 3 — Log First Forward Bias Trial",
        desc: "Turn power ON, adjust VF knob past 0.6 V, and record live meter reading.",
        xp: 75,
        completed: false
      },
      setRangesReverse: {
        title: "Challenge 4 — Reverse Bias Range Alignment",
        desc: "Set Voltmeter = 30 V and Ammeter = 100 μA (Lower Scales active).",
        xp: 60,
        completed: false
      },
      wireReverse: {
        title: "Challenge 5 — Reverse Bias Circuit Patching",
        desc: "Connect series microammeter, reverse diode (N to +, P to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      logReverse: {
        title: "Challenge 6 — Log Reverse Saturation Trial",
        desc: "Apply reverse voltage (VR > 5 V) and log observation in microamperes.",
        xp: 75,
        completed: false
      },
      graphForward: {
        title: "Challenge 7 — Generate Forward V-I Characteristic",
        desc: "Record at least 4 forward observations to plot the 1st quadrant knee curve.",
        xp: 120,
        completed: false
      },
      graphReverse: {
        title: "Challenge 8 — Generate Reverse V-I Characteristic",
        desc: "Record at least 4 reverse observations to plot the 3rd quadrant curve.",
        xp: 120,
        completed: false
      }
    }`;

const newChallenges = `    // Gamification Challenges
    challenges: {
      setRangesFwd: {
        id: "setRangesFwd",
        title: "Challenge 1 — Forward Bias Meter Range Alignment",
        desc: "Set Voltmeter = 1.5 V and Ammeter = 10 mA (Upper Scales active).",
        xp: 60,
        completed: false
      },
      connectFwd: {
        id: "connectFwd",
        title: "Challenge 2 — Forward Bias Circuit Patching",
        desc: "Connect series milliammeter, forward diode (P to +, N to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      recordFwd: {
        id: "recordFwd",
        title: "Challenge 3 — Log First Forward Bias Trial",
        desc: "Turn power ON, adjust VF knob past 0.6 V, and record live meter reading.",
        xp: 75,
        completed: false
      },
      setRangesRev: {
        id: "setRangesRev",
        title: "Challenge 4 — Reverse Bias Range Alignment",
        desc: "Set Voltmeter = 30 V and Ammeter = 100 μA (Lower Scales active).",
        xp: 60,
        completed: false
      },
      connectRev: {
        id: "connectRev",
        title: "Challenge 5 — Reverse Bias Circuit Patching",
        desc: "Connect series microammeter, reverse diode (N to +, P to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      recordRev: {
        id: "recordRev",
        title: "Challenge 6 — Log Reverse Saturation Trial",
        desc: "Apply reverse voltage (VR > 5 V) and log observation in microamperes.",
        xp: 75,
        completed: false
      },
      generateFwdCurve: {
        id: "generateFwdCurve",
        title: "Challenge 7 — Generate Forward V-I Characteristic",
        desc: "Record at least 4 forward observations to plot the 1st quadrant knee curve.",
        xp: 120,
        completed: false
      },
      generateRevCurve: {
        id: "generateRevCurve",
        title: "Challenge 8 — Generate Reverse V-I Characteristic",
        desc: "Record at least 4 reverse observations to plot the 3rd quadrant curve.",
        xp: 120,
        completed: false
      }
    }`;

// 2. Update evaluateCircuit triggers
const oldEvalTriggers = `    if (fwdLoopValid) {
      state.circuitValid = true;
      state.biasMode = "forward";
      state.circuitStatusText = "Circuit Connected Correctly — Forward Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("wireForward");
    } else if (revLoopValid) {
      state.circuitValid = true;
      state.biasMode = "reverse";
      state.circuitStatusText = "Circuit Connected Correctly — Reverse Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("wireReverse");
    }`;

const newEvalTriggers = `    if (fwdLoopValid) {
      state.circuitValid = true;
      state.biasMode = "forward";
      state.circuitStatusText = "Circuit Connected Correctly — Forward Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("connectFwd");
    } else if (revLoopValid) {
      state.circuitValid = true;
      state.biasMode = "reverse";
      state.circuitStatusText = "Circuit Connected Correctly — Reverse Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("connectRev");
    }`;

// 3. Update checkRangeChallenges triggers
const oldRangeTriggers = `  function checkRangeChallenges() {
    if (state.vmRange === 1.5 && state.amRange === 10) {
      triggerChallenge("setRangesForward");
    }
    if (state.vmRange === 30 && state.amRange === 100) {
      triggerChallenge("setRangesReverse");
    }
  }`;

const newRangeTriggers = `  function checkRangeChallenges() {
    if (state.vmRange === 1.5 && state.amRange === 10) {
      triggerChallenge("setRangesFwd");
    }
    if (state.vmRange === 30 && state.amRange === 100) {
      triggerChallenge("setRangesRev");
    }
  }`;

// 4. Update recordCurrentObservation triggers
const oldRecordTriggers = `      triggerChallenge("logForward");

      if (state.forwardObservations.length >= 4) {
        triggerChallenge("graphForward");
      }`;

const newRecordTriggers = `      triggerChallenge("recordFwd");

      if (state.forwardObservations.length >= 4) {
        triggerChallenge("generateFwdCurve");
      }`;

const oldRevRecordTriggers = `      triggerChallenge("logReverse");

      if (state.reverseObservations.length >= 4) {
        triggerChallenge("graphReverse");
      }`;

const newRevRecordTriggers = `      triggerChallenge("recordRev");

      if (state.reverseObservations.length >= 4) {
        triggerChallenge("generateRevCurve");
      }`;

// 5. Update triggerChallenge implementation
const oldTriggerImpl = `  function triggerChallenge(challengeKey) {
    const ch = state.challenges[challengeKey];
    if (!ch || ch.completed) return;

    ch.completed = true;
    renderChallengesDom();

    const payload = {
      challengeId: \`diode.\${challengeKey}\`,
      xp: ch.xp,
      title: ch.title,
      badgeId: "badge-semiconductor-specialist",
      badgeTitle: "Semiconductor Specialist"
    };`;

const newTriggerImpl = `  const CHALLENGE_ALIASES = {
    setRangesForward: "setRangesFwd",
    wireForward: "connectFwd",
    logForward: "recordFwd",
    setRangesReverse: "setRangesRev",
    wireReverse: "connectRev",
    logReverse: "recordRev",
    graphForward: "generateFwdCurve",
    graphReverse: "generateRevCurve"
  };

  function triggerChallenge(challengeKey) {
    const key = CHALLENGE_ALIASES[challengeKey] || challengeKey;
    const ch = state.challenges[key];
    if (!ch || ch.completed) return;

    ch.completed = true;
    renderChallengesDom();

    const payload = {
      challengeId: \`diode.\${key}\`,
      xp: ch.xp,
      title: ch.title,
      badgeId: "badge-semiconductor-specialist",
      badgeTitle: "Semiconductor Specialist"
    };`;

// 6. Update hydrateChallenges
const oldHydrate = `  function hydrateChallenges(completedSet) {
    if (!Array.isArray(completedSet)) return;
    const set = new Set(completedSet);
    Object.keys(state.challenges).forEach(key => {
      if (set.has(\`diode.\${key}\`)) {
        state.challenges[key].completed = true;
      }
    });
    renderChallengesDom();
  }`;

const newHydrate = `  function hydrateChallenges(completedSet) {
    if (!Array.isArray(completedSet)) return;
    const set = new Set(completedSet);
    Object.keys(state.challenges).forEach(key => {
      if (set.has(\`diode.\${key}\`)) {
        state.challenges[key].completed = true;
      } else {
        // Check legacy aliases
        Object.entries(CHALLENGE_ALIASES).forEach(([oldKey, newKey]) => {
          if (newKey === key && set.has(\`diode.\${oldKey}\`)) {
            state.challenges[key].completed = true;
          }
        });
      }
    });
    renderChallengesDom();
  }`;

// Normalize line endings
const isCRLF = code.includes('\r\n');
let norm = isCRLF ? code.replace(/\r\n/g, '\n') : code;

norm = norm.replace(oldChallenges.replace(/\r\n/g, '\n'), newChallenges.replace(/\r\n/g, '\n'));
norm = norm.replace(oldEvalTriggers.replace(/\r\n/g, '\n'), newEvalTriggers.replace(/\r\n/g, '\n'));
norm = norm.replace(oldRangeTriggers.replace(/\r\n/g, '\n'), newRangeTriggers.replace(/\r\n/g, '\n'));
norm = norm.replace(oldRecordTriggers.replace(/\r\n/g, '\n'), newRecordTriggers.replace(/\r\n/g, '\n'));
norm = norm.replace(oldRevRecordTriggers.replace(/\r\n/g, '\n'), newRevRecordTriggers.replace(/\r\n/g, '\n'));
norm = norm.replace(oldTriggerImpl.replace(/\r\n/g, '\n'), newTriggerImpl.replace(/\r\n/g, '\n'));
norm = norm.replace(oldHydrate.replace(/\r\n/g, '\n'), newHydrate.replace(/\r\n/g, '\n'));

if (isCRLF) {
  norm = norm.replace(/\n/g, '\r\n');
}

fs.writeFileSync('src/diode-vi.js', norm, 'utf8');
console.log("Successfully updated challenge keys and triggers in src/diode-vi.js");
