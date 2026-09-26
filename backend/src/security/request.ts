const MAX_BODY_BYTES=16*1024;

export async function validateRequest(request:Request):Promise<void>{
 if(!["POST","PUT","PATCH"].includes(request.method)) return;
  const type=request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if(type!=="application/json") throw new Error("JSON content type required");
  const length=request.headers.get("content-length");
  if(length){const parsed=Number(length);if(!Number.isSafeInteger(parsed)||parsed<0||parsed>MAX_BODY_BYTES)throw new Error("Request body too large");return;}
  const body=await request.clone().arrayBuffer();
  if(body.byteLength>MAX_BODY_BYTES) throw new Error("Request body too large");
}
