export const config = { runtime: "edge" };
import { kv } from "@vercel/kv";

export default async function handler(req) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return new Response(null, { headers, status: 204 });
  if (req.method !== "GET") return Response.json({msg:"仅GET"}, {status:405, headers});

  const token = req.headers.get("token");
  // 这里写你的管理员账号
  const adminName = "admin";
  if(token !== "game-token-"+adminName){
    return Response.json({success:false,msg:"无权查看"},{headers,status:403});
  }

  const keys = await kv.keys("order:*");
  const list = [];
  for(const k of keys){
    const item = await kv.get(k);
    list.push(item);
  }
  return Response.json({success:true,data:list}, {headers});
}
