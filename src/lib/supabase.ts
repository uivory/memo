import { createClient } from "@supabase/supabase-js";

// 접속 주소와 공개 키는 .env.local의 NEXT_PUBLIC_ 값이다. 브라우저에 그대로 실리는 값이라 공개 키만 쓴다.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    ".env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 넣어 주세요.",
  );
}

export const supabase = createClient(url, key);
