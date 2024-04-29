"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export default function useBuildSearchParams() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const appendQueryString = (key, value) => {
        router.push(pathname + '?' + createQueryString(key, value))
    }

    return {
        appendQueryString,
        searchParams,
        router
    }
}