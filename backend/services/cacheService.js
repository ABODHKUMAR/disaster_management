const { supabase } = require("../supabase/supabaseClient");

async function getCachedValue(key) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("cache")
    .select("value")
    .eq("key", key)
    .gt("expires_at", now)
    .maybeSingle();

  return error ? null : data?.value;
}

async function setCachedValue(key, value, ttl = 3600) {
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const { error } = await supabase
    .from("cache")
    .upsert({ key, value, expires_at: expiresAt }, { onConflict: ["key"] });

  if (error) console.error("Cache error:", error.message);
}

module.exports = { getCachedValue, setCachedValue };
