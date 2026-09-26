export function requestId(request:Request):string{
 const supplied=request.headers.get("X-Request-Id")??"";
 return /^[A-Za-z0-9._-]{1,128}$/.test(supplied)?supplied:crypto.randomUUID();
}
export function applySecurityHeaders(response:Response,id:string):Response{
 const headers=new Headers(response.headers);
 headers.set("X-Request-Id",id);headers.set("Cache-Control","no-store");headers.set("X-Content-Type-Options","nosniff");headers.set("Referrer-Policy","no-referrer");headers.set("Permissions-Policy","camera=(self), microphone=(), geolocation=()");
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
