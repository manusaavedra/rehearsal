import { Skeleton } from "@nextui-org/react"

export default function Loading() {
    return (
        <div className="max-w-5xl mx-auto pt-10 p-4">
            {
                Array.from({ length: 20 }).map((_, section) => {
                    return (
                        <div key={section} className="py-4 flex border-b flex-col gap-2">
                            <Skeleton className="rounded-xl w-full h-4" />
                            <Skeleton className="rounded-xl w-32 h-2" />
                        </div>
                    )
                })
            }
        </div>
    )
}