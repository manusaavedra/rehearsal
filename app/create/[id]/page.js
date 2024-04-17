import FormSongs from "@/components/FormSongs"
import { Loading } from "@/components/Loading"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
        <section>
            <Suspense fallback={<Loading />}>
                <FormSongs song={song} mode="edit" />
            </Suspense>
        </section>
    )
}

