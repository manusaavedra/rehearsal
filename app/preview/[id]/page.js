import { Preview } from "@/components/Preview"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { BsPencilSquare } from "react-icons/bs"

export async function generateMetadata({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`)
    revalidatePath('/preview/[id]', 'page')

    if (request.ok) {
        const songById = await request.json()
        return {
            title: `${songById.title} | ${songById.artist}`,
            description: 'Rehearsal tus charts mas fácil.'
        }
    }

    return null
}

export default async function Create({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`)
    const songById = await request.json()
    revalidatePath('/preview/[id]', 'page')

    if (!songById) {
        redirect('/')
    }

    const { sections, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []

    const { key, ...song } = { ...restSong, sections: parseSections }

    return (
        <section className="max-w-4xl mx-auto">
            <Link prefetch className="flex items-center px-4 gap-2 mt-4" href={`/create/${song.id}`}>
                <BsPencilSquare size={24} />
                Editar esta canción
            </Link>
            <Preview {...song} />
        </section>
    )
}