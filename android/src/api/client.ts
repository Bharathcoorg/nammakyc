const API_BASE_URL=process.env.EXPO_PUBLIC_API_BASE_URL??"http://localhost:8787";
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
  try{
    const response=await fetch(`${API_BASE_URL}${path}`,{
      ...init,
      signal:init?.signal??controller.signal,
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
