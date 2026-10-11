export const config = { runtime: "edge" };
import { kv } from "@vercel/kv";

export default async function handler(req) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return new Response(null, { headers, status: 204 });
  if (req.method !== "POST") return Response.json({msg:"仅POST"}, {status:405, headers});

  const { username, password } = await req.json();
  const userKey = `user:${username}`;
  const exist = await kv.get(userKey);

  if(exist){
    return Response.json({success:false, msg:"账号已存在，请直接登录"},{headers});
  }
  // 保存账号密码
  await kv.set(userKey, {password, createTime: new Date().toLocaleString()});
  return Response.json({success:true, msg:"注册成功，自动登录", token:"game-token-"+username},{headers});
}
