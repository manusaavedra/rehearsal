"use server"

import { Preview } from "@/components/Preview"
import { Skeleton } from "@nextui-org/react"
import { revalidatePath } from "next/cache"
import { Suspense } from "react"

export async function generateMetadata({ params }) {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs/${params.id}`)
    revalidatePath('/preview/[id]', 'page')

    if (request.ok) {
        const songById = await request.json()
        return {
            title: `${songById.title} | ${songById.artist}`,
            description: 'Rehearsal tus charts mas fácil.',
            openGraph: {
                images: [songById.image || "/icon512_rounded.png"],
            }
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

    const { sections, links, ...restSong } = songById
    const parseSections = JSON.parse(sections) || []
    const parseLinks = JSON.parse(links) || []

    const { key, ...song } = { ...restSong, sections: parseSections, links: parseLinks }

    return (
        <section className="max-w-4xl mx-auto">
            <Suspense fallback={<Loading />}>
                <section className="h-screen">
                    <Preview {...song} />
                </section>
            </Suspense>
        </section>
    )
}

function Loading() {
    return (
        <div className="pt-10 p-4">
            <div className="mb-6 flex flex-col gap-2">
                <Skeleton className="h-4 w-40 rounded-xl" />
                <Skeleton className="h-2 w-20 rounded-xl" />
            </div>
            <div className="mb-6">
                <Skeleton className="h-8 w-full rounded-xl" />
            </div>
            {
                Array.from({ length: 5 }).map((_, section) => {
                    return (
                        <div key={section} className="mb-4">
                            <Skeleton className="rounded-xl">
                                <div className="h-32 w-full"></div>
                            </Skeleton>
                        </div>
                    )
                })
            }
        </div>
    )
}