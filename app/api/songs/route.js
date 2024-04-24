import { client } from "@/database"

export async function POST(req) {
    const { id, title, artist, image, sections, links } = await req.json()

    try {
        if (!id) {
            const { rowsAffected } = await client.execute({
                sql: "INSERT INTO songs (title, artist, image, sections, links) VALUES(?, ?, ?, ?, ?)",
                args: [title, artist, image, sections, links]
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
                sql: "UPDATE songs SET title=?, artist=?, image=?, sections=?, links=? WHERE id=?",
                args: [title, artist, image, sections, links, id]
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