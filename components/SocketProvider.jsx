"use client"

import useSocketStore from "@/hooks/useSocketStore"
import { useEffect } from "react"

export default function SocketProvider({ children }) {
    const { initializeSocket } = useSocketStore()

    useEffect(() => {
        initializeSocket()
    }, [initializeSocket])

    return (
        <>
            {children}
        </>
    )
}