import { Loading } from "@/components/Loading"
import { Preview } from "@/components/Preview"
import { revalidatePath } from "next/cache"
import { Suspense } from "react"

export async function generateMetadata({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`, {
        cache: "no-cache"
    })

    if (request.ok) {
        const data = await request.json()
        const songById = data.find((song) => song.id === params.id)
        return {
            title: `${songById.title} | ${songById.artist}`,
            description: 'Rehearsal tus charts mas fácil.'
        }
    }

    return {}
}

export default async function Create({ params }) {
    revalidatePath(`/create/${params.id}`)

    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`, {
        cache: "no-cache"
    })

    const data = await request.json()
    const songById = data.find((song) => song.id === params.id)

    if (!songById) {
        redirect('/')
    }

    const { sections, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []

    const { key, ...song } = { ...restSong, sections: parseSections }

    return (
        <Suspense fallback={<Loading />}>
            <div className="max-w-4xl mx-auto">
                <Preview {...song} />
            </div>
        </Suspense>
    )
}