const MAX_REQUESTS = 20;
const WINDOW_MS = 60000;
const requests = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip) {
  const now = Date.now();
  const record = requests.get(ip);

  if (!record || now > record.resetTime) {
    requests.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });

    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: now + WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count++;

  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - record.count,
    reset: record.resetTime,
  };
}
