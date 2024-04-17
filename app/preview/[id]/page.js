import { Loading } from "@/components/Loading"
import { Preview } from "@/components/Preview"
import { revalidatePath } from "next/cache"
import { Suspense } from "react"

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

    const song = { ...restSong, sections: parseSections }

    return (
        <Suspense fallback={<Loading />}>
            <div className="max-w-4xl mx-auto">
                <Preview {...song} />
            </div>
        </Suspense>
    )
}