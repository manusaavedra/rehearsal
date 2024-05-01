import dynamic from "next/dynamic"
import { Suspense } from "react"

const SetList = dynamic(() => import('@/components/SetList'), { ssr: false })

export default async function Page() {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`)
    const songs = await request.json()

    return (
        <section className="max-w-5xl mx-auto">
            <Suspense fallback={<span>Cargando...</span>}>
                <SetList
                    data={songs}
                />
            </Suspense>
        </section>
    )
}