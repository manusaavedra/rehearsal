"use client"

import useSocketStore from "@/hooks/useSocketStore"

export default function Page() {
    const { socket, users } = useSocketStore()
    console.log(users)

    return (
        <div>
            <p>{socket?.id}</p>
            remote setlist
        </div>
    )
}