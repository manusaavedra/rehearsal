import FormSongs from "@/components/FormSongs"
import { redirect } from "next/navigation"

export default async function Create({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`)
    const songById = await request.json()

    if (!songById) {
        redirect('/')
    }

    const { sections, links, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []
    const parseLinks = JSON.parse(links) || []

    const song = { ...restSong, sections: parseSections, links: parseLinks }

    return (
        <section>
            <FormSongs song={song} mode="edit" />
        </section>
    )
}

