export async function fetchHealth() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchStatus() {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
