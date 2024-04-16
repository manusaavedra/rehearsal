import { createClient } from "@libsql/client";

export const client = createClient({
    url: process.env.NEXT_TURSO_DATABASE_URL,
    authToken: process.env.NEXT_TURSO_TOKEN
})
