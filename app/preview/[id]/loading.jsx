import { Skeleton } from "@nextui-org/react";

export default function Loading() {
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