export function getUserId(): string {
  if (typeof window === "undefined") return "server-fallback";
  let userId = localStorage.getItem("planb_user_id");
  if (!userId) {
    const randomHex = Math.random().toString(16).substring(2, 10);
    userId = `usr_${Date.now()}_${randomHex}`;
    localStorage.setItem("planb_user_id", userId);
  }
  return userId;
}
