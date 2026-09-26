const MAX_BODY_BYTES=16*1024;
export function validateRequest(request:Request):void{
 if(["POST","PUT","PATCH"].includes(request.method)){
  const type=request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if(type!=="application/json") throw new Error("JSON content type required");
  const length=request.headers.get("content-length");
  if(length&&Number(length)>MAX_BODY_BYTES) throw new Error("Request body too large");
 }
}
