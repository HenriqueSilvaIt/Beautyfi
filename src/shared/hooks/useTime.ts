export function useTime() {
  const SLOT_HEIGHT = 40
  const MINUTES_PER_SLOT = 10
  const TOTAL_MINUTES = 24 * 60

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":")
    return Number(h) * 60 + Number(m)
  }

  function minutesToTime(minutes: number) {
    const clamped = Math.max(0, Math.min(minutes, TOTAL_MINUTES))
    const h = Math.floor(clamped / 60)
    const m = clamped % 60

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }

  function yToTime(y: number) {
    const minutes =
      Math.floor(y / SLOT_HEIGHT) * MINUTES_PER_SLOT

    return minutesToTime(minutes)
  }

  function timeToTop(time: string) {
    return (timeToMinutes(time) / MINUTES_PER_SLOT) * SLOT_HEIGHT
  }

  

  return {
    SLOT_HEIGHT,
    timeToMinutes,
    timeToTop,
    minutesToTime,
    yToTime,
  }
}
