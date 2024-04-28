import SetListComponent from "@/components/SetList";
import { Suspense } from "react";

export default async function SetList() {
    const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`)
    const songs = await request.json()

    return (
        <section className="max-w-5xl mx-auto">
            <Suspense fallback={<span>Cargando...</span>}>
                <SetListComponent
                    data={songs}
                    showButtonEdit={false}
                    showButtonSetList={true}
                />
            </Suspense>
        </section>
    )
}