import FormSongs from "@/components/FormSongs"
import { Skeleton } from "@nextui-org/react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

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
            <Suspense fallback={<Loading />}>
                <FormSongs song={song} mode="edit" />
            </Suspense>
        </section>
    )
}

function Loading() {
    return (
        <div className="pt-10 p-4">
            <div className="mb-6 flex flex-col gap-2">
                <Skeleton className="h-4 w-40 rounded-xl" />
                <Skeleton className="h-2 w-40 rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
            </div>
            {
                Array.from({ length: 5 }).map((_, section) => {
                    return (
                        <div key={section} className="mb-4">
                            <Skeleton className="rounded-xl">
                                <div className="h-20 w-full"></div>
                            </Skeleton>
                        </div>
                    )
                })
            }
        </div>
    )
}

