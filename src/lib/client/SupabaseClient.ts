import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
    "https://uyqjlzjcrniklqwqzwek.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cWpsempjcm5pa2xxd3F6d2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5OTI0NDQsImV4cCI6MjA0OTU2ODQ0NH0.rd4i_sbarTEWz9eS93V0dP3mFHuH5CVLD8V_jR1DO70"
)