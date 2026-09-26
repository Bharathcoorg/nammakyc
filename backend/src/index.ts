import { route } from "./routes/router";
import { applySecurityHeaders, requestId } from "./security/headers";
import { validateRequest } from "./security/request";

export interface Env { ENVIRONMENT:string; }

export default {
 async fetch(request:Request,_env:Env):Promise<Response>{
  const id=requestId(request);
  try{
   validateRequest(request);
   const response=await route(request);
   return applySecurityHeaders(response??Response.json({error:{code:"NOT_FOUND",message:"Route not found"}},{status:404}),id);
  }catch(error){
   const message=error instanceof Error?error.message:"";
   const status=message==="JSON content type required"||message==="Request body too large"?415:500;
   const code=status===415?"INVALID_REQUEST":"INTERNAL_ERROR";
   return applySecurityHeaders(Response.json({error:{code,message:status===415?message:"Internal server error"}},{status}),id);
  }
 }
};
