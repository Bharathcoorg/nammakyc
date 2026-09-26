const API_BASE_URL=process.env.EXPO_PUBLIC_API_BASE_URL??"http://localhost:8787";
export interface ApiError{error:{code:string;message:string}}
export async function apiRequest<T>(path:string,init?:RequestInit):Promise<T>{
 const response=await fetch(`${API_BASE_URL}${path}`,{...init,headers:{"Accept":"application/json","Content-Type":"application/json",...init?.headers}});
 if(!response.ok){const body=await response.json().catch(()=>null) as ApiError|null;throw new Error(body?.error.message??"Request failed");}
 return response.json() as Promise<T>;
}
