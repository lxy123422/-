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
  const userData = await kv.get(userKey);

  if(!userData){
    return Response.json({success:false, msg:"账号不存在，请先注册"},{headers});
  }
  if(userData.password !== password){
    return Response.json({success:false, msg:"密码错误"},{headers,status:401});
  }
  return Response.json({success:true, msg:"登录成功", token:"game-token-"+username}, {headers});
}
