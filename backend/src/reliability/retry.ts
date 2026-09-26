export interface RetryPolicy{attempts:number;baseDelayMs:number;maxDelayMs:number}
export function retryDelay(attempt:number,policy:RetryPolicy,rnd=Math.random()){const exp=Math.min(policy.maxDelayMs,policy.baseDelayMs*2**attempt);return Math.floor(rnd*exp)}
export async function withRetry<T>(operation:()=>Promise<T>,policy:RetryPolicy,shouldRetry:(error:unknown)=>boolean):Promise<T>{
 let last:unknown;
 for(let attempt=0;attempt<policy.attempts;attempt++){try{return await operation()}catch(error){last=error;if(!shouldRetry(error)||attempt===policy.attempts-1)throw error;await new Promise(r=>setTimeout(r,retryDelay(attempt,policy)))}}
 throw last;
}
