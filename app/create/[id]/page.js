import FormSongs from "@/components/FormSongs"
import { redirect } from "next/navigation"

export default async function Create({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`)
    const songById = await request.json()

    if (!songById) {
        redirect('/')
    }

    const { sections, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []

    const song = { ...restSong, sections: parseSections }

    return (
        <section>
            <FormSongs song={song} mode="edit" />
        </section>
    )
}

