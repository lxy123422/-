export const config = { runtime: "edge" };
import { kv } from "@vercel/kv";

export default async function handler(req) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return new Response(null, { headers, status: 204 });
  if (req.method !== "POST") return Response.json({msg:"仅POST"}, {status:405, headers});

  const {token, username, orderInfo} = await req.json();
  // 简易校验token
  if(token !== "game-token-"+username){
    return Response.json({success:false,msg:"未登录"},{headers,status:401});
  }

  const time = new Date().toLocaleString();
  const ip = req.headers.get("x-forwarded-for") || "未知";
  const orderId = Date.now() + "-" + Math.random().toString(36).slice(2);
  await kv.set(`order:${orderId}`, {username, orderInfo, time, ip});

  return Response.json({success:true,orderId}, {headers});
}
