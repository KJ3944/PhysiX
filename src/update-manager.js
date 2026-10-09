/**
 * PhysiX • New-Deployment & Version Update Notification Engine
 * Inspired by Chordician's resilient PWA & Web deployment update experience.
 * 
 * Features:
 * - Real-time deployed version detection via /version.json polling and Service Worker lifecycle
 * - Non-intrusive, beautiful glassmorphic modal with zero emojis
 * - "Refresh Now" (activates new Service Worker and cleanly reloads)
 * - "Later" (snoozes reminders for 30 minutes, preventing annoying interruption loops)
 * - Prevents reload loops and stale cache locks
 * - PWA and standalone mode compliant
 */

const UPDATE_CHECK_INTERVAL_MS = 60 * 1000; // Poll every 60 seconds
const LATER_SNOOZE_MS = 30 * 60 * 1000;      // 30 minutes snooze
const STORAGE_KEY_SNOOZE = "physix_update_snooze_until";
const STORAGE_KEY_KNOWN_VERSION = "physix_known_version";

class UpdateManager {
  constructor() {
    this.currentVersion = (typeof __PHYSIX_VERSION__ !== "undefined")
      ? __PHYSIX_VERSION__
      : String(Date.now());
    this.latestVersion = this.currentVersion;
    this.waitingWorker = null;
    this.isUpdateAvailable = false;
    this.isModalVisible = false;
    this.pollTimer = null;
    this.modalEl = null;

    // Track active SW registration
    this.swRegistration = null;
  }

  init() {
    // Save current active version
    try {
      localStorage.setItem(STORAGE_KEY_KNOWN_VERSION, this.currentVersion);
    } catch (e) {}

    // Listen for Service Worker updates if supported
    this.initServiceWorkerListener();

    // Start background version polling
    this.startVersionPolling();

    // Check immediately when page becomes visible after sleep/tab switch
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.checkForUpdates();
      }
    });

    console.log(`[UpdateManager] Active version: ${this.currentVersion}`);
  }

  initServiceWorkerListener() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      this.swRegistration = reg;

      // 1. Check if there is already a worker waiting
      if (reg.waiting) {
        this.waitingWorker = reg.waiting;
        this.notifyUpdateAvailable("Service Worker waiting");
      }

      // 2. Listen for future updates found during background check
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            this.waitingWorker = newWorker;
            this.notifyUpdateAvailable("New Service Worker installed");
          }
        });
      });
    }).catch((err) => {
      console.warn("[UpdateManager] SW registration query warning:", err);
    });

    // Handle controller change (when new SW claims client)
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      console.log("[UpdateManager] New Service Worker activated. Reloading application...");
      window.location.reload();
    });
  }

  startVersionPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    // Initial check after 10s
    setTimeout(() => this.checkForUpdates(), 10000);
    // Recurring interval
    this.pollTimer = setInterval(() => {
      this.checkForUpdates();
    }, UPDATE_CHECK_INTERVAL_MS);
  }

  async checkForUpdates() {
    if (!navigator.onLine) return;

    // First check SW updates
    if (this.swRegistration && typeof this.swRegistration.update === "function") {
      this.swRegistration.update().catch(() => {});
    }

    // Also fetch deployed version.json with cache-busting
    try {
      const res = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });

      if (!res.ok) return;
      const data = await res.json();
      const deployedVersion = String(data.version || "").trim();

      if (deployedVersion && deployedVersion !== this.currentVersion) {
        this.latestVersion = deployedVersion;
        this.notifyUpdateAvailable(`Deployed version changed (${this.currentVersion} -> ${deployedVersion})`);
      }
    } catch (e) {
      // Offline or network error - ignore silently
    }
  }

  notifyUpdateAvailable(reason = "") {
    if (this.isUpdateAvailable && this.isModalVisible) return;
    this.isUpdateAvailable = true;

    // Check if user chose "Later" and snooze is still active
    try {
      const snoozeUntil = Number(localStorage.getItem(STORAGE_KEY_SNOOZE)) || 0;
      if (Date.now() < snoozeUntil) {
        console.log(`[UpdateManager] Update available (${reason}), but user snoozed until ${new Date(snoozeUntil).toLocaleTimeString()}`);
        return;
      }
    } catch (e) {}

    console.log(`[UpdateManager] Presenting update notification: ${reason}`);
    this.showUpdateModal();
  }

  showUpdateModal() {
    if (this.isModalVisible) return;
    this.isModalVisible = true;

    let modal = document.getElementById("physix-update-notification-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "physix-update-notification-modal";
      modal.className = "physix-update-modal-backdrop";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Application Update Available");

      modal.innerHTML = `
        <div class="physix-update-dialog">
          <div class="physix-update-glow-orb"></div>
          <div class="physix-update-header">
            <div class="physix-update-icon-box">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 16h5v5"></path>
              </svg>
            </div>
            <div class="physix-update-title-wrap">
              <span class="physix-update-kicker">SYSTEM DEPLOYMENT DETECTED</span>
              <h3 class="physix-update-title">A New Update Is Here!</h3>
            </div>
          </div>

          <p class="physix-update-message">
            A new version of PhysiX is available. Refresh to get the latest improvements.
          </p>

          <div class="physix-update-actions">
            <button type="button" id="btn-update-later" class="physix-update-btn physix-update-btn-later">
              Later
            </button>
            <button type="button" id="btn-update-refresh-now" class="physix-update-btn physix-update-btn-refresh">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Refresh Now</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#btn-update-refresh-now")?.addEventListener("click", () => this.handleRefreshNow());
      modal.querySelector("#btn-update-later")?.addEventListener("click", () => this.handleLater());
    }

    this.modalEl = modal;
    modal.classList.remove("hidden");
    modal.classList.add("visible");
  }

  hideUpdateModal() {
    this.isModalVisible = false;
    if (this.modalEl) {
      this.modalEl.classList.remove("visible");
      this.modalEl.classList.add("hidden");
    }
  }

  handleLater() {
    // Snooze reminder for 30 minutes
    try {
      localStorage.setItem(STORAGE_KEY_SNOOZE, String(Date.now() + LATER_SNOOZE_MS));
    } catch (e) {}

    this.hideUpdateModal();
    console.log("[UpdateManager] User selected Later. Snoozing for 30 minutes.");
  }

  handleRefreshNow() {
    console.log("[UpdateManager] User clicked Refresh Now. Activating new version...");

    // Clear snooze key
    try {
      localStorage.removeItem(STORAGE_KEY_SNOOZE);
      localStorage.setItem(STORAGE_KEY_KNOWN_VERSION, this.latestVersion);
    } catch (e) {}

    // Disable button to prevent multi-click
    const refreshBtn = document.getElementById("btn-update-refresh-now");
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = `<span>Updating...</span>`;
    }

    // If a Service Worker is waiting, message it to skip waiting
    if (this.waitingWorker) {
      this.waitingWorker.postMessage("SKIP_WAITING");
      // Fallback reload if controllerchange doesn't trigger within 800ms
      setTimeout(() => {
        window.location.reload();
      }, 800);
      return;
    }

    // Fallback: standard cache-busted reload
    window.location.reload();
  }
}

export const updateManager = new UpdateManager();
