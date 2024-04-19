import FormSongs from "@/components/FormSongs"
import { Loading } from "@/components/Loading"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function Create({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`, {
        cache: "no-store"
    })

    const songById = await request.json()

    if (!songById) {
        redirect('/')
    }

    const { sections, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []

    const song = { ...restSong, sections: parseSections }

    return (
        <Suspense fallback={<Loading />}>
            <section>
                <FormSongs song={song} mode="edit" />
            </section>
        </Suspense>
    )
}

