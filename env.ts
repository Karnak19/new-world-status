import "https://deno.land/x/dotenv/load.ts";

export const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL");
