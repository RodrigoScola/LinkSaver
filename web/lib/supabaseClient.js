import { createClient } from "@supabase/supabase-js"
export const supabase = createClient(
	"https://wjyoufguistmaipclqvj.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqeW91Zmd1aXN0bWFpcGNscXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzEwMzg2NzQsImV4cCI6MTk4NjYxNDY3NH0.2xj8LJ3WaWRZJn2fvgALbFaic5kO6mbVgVqIJtA3VLg"
)
