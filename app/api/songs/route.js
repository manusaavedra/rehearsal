import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.NEXT_TURSO_DATABASE_URL,
    authToken: process.env.NEXT_TURSO_TOKEN
})

export async function POST(req) {
    const { id, title, artist, sections } = await req.json()

    try {

        if (!id) {
            const { rowsAffected, lastInsertRowid } = await client.execute({
                sql: "INSERT INTO songs (title, artist, sections) VALUES(?, ?, ?)",
                args: [title, artist, sections]
            })

            if (rowsAffected > 0) {
                const { rows } = await client.execute({
                    sql: "SELECT * FROM songs WHERE id = ? LIMIT 1",
                    args: [parseInt(lastInsertRowid)]
                })
                return Response.json(rows[0])
            }
        } else {
            const { rowsAffected, lastInsertRowid } = await client.execute({
                sql: "UPDATE songs SET title=?, artist=?, sections=? WHERE id=?",
                args: [title, artist, sections, id]
            })

            if (rowsAffected > 0) {
                const { rows } = await client.execute({
                    sql: "SELECT * FROM songs WHERE id = ? LIMIT 1",
                    args: [parseInt(lastInsertRowid)]
                })
                return Response.json(rows[0])
            }
        }

        return Response.json({})

    } catch (error) {
        return Response.json({ error })
    }
}

export async function GET(req) {

    console.log("es get")

    try {
        const { rows } = await client.execute("SELECT * FROM songs")
        return Response.json(rows)
    } catch (error) {
        return Response.json({ error })
    }
}