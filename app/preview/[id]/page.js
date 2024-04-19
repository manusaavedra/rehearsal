import { Loading } from "@/components/Loading"
import { Preview } from "@/components/Preview"
import Link from "next/link"
import { Suspense } from "react"
import { BsPencilSquare } from "react-icons/bs"

export async function generateMetadata({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`, {
        cache: "no-store"
    })

    if (request.ok) {
        const songById = await request.json()
        return {
            title: `${songById.title} | ${songById.artist}`,
            description: 'Rehearsal tus charts mas fácil.'
        }
    }

    return {}
}

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

    const { key, ...song } = { ...restSong, sections: parseSections }

    return (
        <Suspense fallback={<Loading />}>
            <div className="max-w-4xl mx-auto">
                <Link prefetch className="flex items-center px-4 gap-2 mt-4" href={`/create/${song.id}`}>
                    <BsPencilSquare size={24} />
                    Editar esta canción
                </Link>
                <Preview {...song} />
            </div>
        </Suspense>
    )
}