import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://iqsmdmpxyplfsqukiern.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxc21kbXB4eXBsZnNxdWtpZXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgyNzMsImV4cCI6MjEwODIzNDI3M30.D9ED6K6lB8tLbn4LIBELk1kffkII8JzxuHU_fE5BBMU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
