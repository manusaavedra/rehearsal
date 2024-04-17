import { client } from "@/database"

export async function GET(req, { params }) {
    try {
        const { rows } = await client.execute({
            sql: "SELECT * FROM songs WHERE id = ?",
            args: [params.id]
        })

        return Response.json(rows[0])
    } catch (error) {
        return Response.json({ error })
    }
}