export function getBootDelay(offset: number): number {
  if (typeof window === "undefined") return 0;
  const alreadyBooted = window.sessionStorage.getItem("booted");
  return alreadyBooted ? 0 : offset;
}
