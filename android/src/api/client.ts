const API_BASE_URL=process.env.EXPO_PUBLIC_API_BASE_URL?.trim()??"";

function requireApiBaseUrl():string{
  if(!API_BASE_URL) throw new Error("Namma KYC API endpoint is not configured.");
  if(!/^https:\/\//i.test(API_BASE_URL) && !/^http:\/\/localhost(?::\d+)?$/i.test(API_BASE_URL)) throw new Error("Namma KYC API endpoint must use HTTPS.");
  return API_BASE_URL.replace(/\/$/,"");
}
const REQUEST_TIMEOUT_MS=15_000;

export interface ApiError{error:{code:string;message:string}}

async function readError(response:Response):Promise<string>{
  try{
    const body=await response.json() as ApiError;
    if(body?.error?.message) return body.error.message;
  }catch{}
  return response.status===408?"Request timed out":"Request failed";
}

export async function apiRequest<T>(path:string,init?:RequestInit):Promise<T>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);
  const signal=init?.signal??controller.signal;
  try{
    const response=await fetch(`${requireApiBaseUrl()}${path}`,{
      ...init,
      signal,
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json",
        ...init?.headers
      }
    });
    if(!response.ok) throw new Error(await readError(response));
    return response.json() as Promise<T>;
  }catch(error){
    if(error instanceof Error&&error.name==="AbortError") throw new Error("The request timed out. Please try again.");
    throw error;
  }finally{
    clearTimeout(timer);
  }
}

export async function getKycStatus<T>(requestId:string){return apiRequest<T>("/v1/kyc/"+encodeURIComponent(requestId))}
