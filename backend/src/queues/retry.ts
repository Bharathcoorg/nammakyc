export function queueRetryDelaySeconds(attempt:number,rnd=Math.random()):number{
  const normalizedAttempt=Math.max(0,Math.floor(attempt));
  const capped=Math.min(normalizedAttempt,5);
  const base=2**capped;
  const jitter=Math.max(0,Math.min(1,rnd));
  return Math.min(60,Math.max(1,Math.floor(base*(0.5+jitter))));
}
