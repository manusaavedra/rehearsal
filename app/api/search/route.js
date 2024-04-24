export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q')

    try {
        const request = await fetch(`https://api.genius.com/search?q=${query}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GENIUS_TOKEN}`
            }
        })

        if (request.ok) {
            const data = await request.json()
            const resultMap = data.response.hits.map((hit) => {
                return {
                    id: hit.result.id,
                    title: hit.result.title,
                    artist: hit.result.artist_names,
                    image: hit.result.header_image_thumbnail_url,
                    lyricsUrl: hit.result.url
                }
            })
            return Response.json(resultMap || [])
        }
    } catch (error) {
        return Response.error({ error });
    }
}