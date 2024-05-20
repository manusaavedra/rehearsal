//https://www.letras.com/?q=llamado%20a%20mi%20destino
/* 
    {
        id: hit.result.id,
        title: hit.result.title,
        artist: hit.result.artist_names,
        image: hit.result.header_image_thumbnail_url,
        lyricsUrl: hit.result.url
    }
*/

import { revalidateTag } from "next/cache"

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('q')

    try {
        const customSearchID = process.env.CUSTOM_SEARCH_ID
        const apiKey = process.env.APIKEY_GOOGLE
        const endpoint = encodeURI(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchID}&q=${query}`)
        const request = await fetch(endpoint, {
            next: {
                revalidate: 1,
                tags: ["cx-google"]
            }
        })

        revalidateTag("cx-google")

        if (request.ok) {
            const data = await request.json()
            const lyricsMap = data.items.map((item) => {
                const [title, artist] = item.title.split("-")

                return {
                    title: title,
                    artist: artist,
                    image: item.pagemap.cse_image[0].src,
                    lyricsUrl: item.link
                }
            })

            return Response.json(lyricsMap || [])
        }

        return Response.json([])
    } catch (error) {
        return Response.error({ error });
    }
}