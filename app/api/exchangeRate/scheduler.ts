export const UPDATE_TIMES = [8, 15];
export function getTimeUntilNextUpdate(): number {
  const now = new Date();
  let nextUpdate = new Date();

  for (const hour of UPDATE_TIMES) {
    const updateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      0,
      0
    );
    if (updateTime > now) {
      nextUpdate = updateTime;
      break;
    }
  }

  if (nextUpdate <= now) {
    nextUpdate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      UPDATE_TIMES[0],
      0,
      0
    );
  }

  const timeUntilUpdate = nextUpdate.getTime() - now.getTime();

  return timeUntilUpdate;
}

export function isNearUpdateTime(): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (const updateHour of UPDATE_TIMES) {
    if (currentHour === updateHour && currentMinute < 5) {
      return true;
    }
  }
  return false;
}
