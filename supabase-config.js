// Pristine — Supabase configuration

window.PRISTINE_SUPABASE_URL = "https://rwhlffnpouebyituqzkk.supabase.co";

window.PRISTINE_SUPABASE_KEY = "sb_publishable_ly1oXjgsVA4XfjzuTGvjcg_pjrLBggC";

// Initialise the Supabase client
window.pristineSupabase = window.supabase.createClient(
  window.PRISTINE_SUPABASE_URL,
  window.PRISTINE_SUPABASE_KEY
);