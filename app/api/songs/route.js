import { client } from "@/database"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
    const { id, title, artist, sections } = await req.json()

    try {
        if (!id) {
            const { rowsAffected } = await client.execute({
                sql: "INSERT INTO songs (title, artist, sections) VALUES(?, ?, ?)",
                args: [title, artist, sections]
            })

            if (rowsAffected > 0) {
                const { rows } = await client.execute({
                    sql: "SELECT * FROM songs WHERE title = ? LIMIT 1",
                    args: [title]
                })

                return Response.json(rows[0])
            }
        } else {
            const { rowsAffected } = await client.execute({
                sql: "UPDATE songs SET title=?, artist=?, sections=? WHERE id=?",
                args: [title, artist, sections, id]
            })

            if (rowsAffected > 0) {
                const { rows } = await client.execute({
                    sql: "SELECT * FROM songs WHERE id = ? LIMIT 1",
                    args: [id]
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
    try {
        const { rows } = await client.execute("SELECT * FROM songs ORDER BY title ASC")
        return Response.json(rows)
    } catch (error) {
        return Response.json({ error })
    }
}