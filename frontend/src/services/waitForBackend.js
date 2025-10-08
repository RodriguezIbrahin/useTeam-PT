export async function waitForBackendHealth({
  url = (import.meta.env.VITE_API_URL || "http://localhost:3000") +
    "/api/health",
  timeoutMs = 60000, // total timeout en ms
  initialDelay = 500, // primer delay en ms
  maxDelay = 5000, // delay máximo entre intentos
  onAttempt, // opcional: callback(attemptNumber, url)
} = {}) {
  const start = Date.now();
  let attempt = 0;
  let delay = initialDelay;

  while (Date.now() - start < timeoutMs) {
    attempt++;
    try {
      if (onAttempt) onAttempt(attempt, url);
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (res.ok) return true;
    } catch (err) {
      console.warn("Backend health check failed:", err);
    }

    // wait with jitter
    const jitter = Math.round(Math.random() * 200);
    await new Promise((r) => setTimeout(r, delay + jitter));
    delay = Math.min(maxDelay, Math.round(delay * 1.8));
  }

  return false;
}
