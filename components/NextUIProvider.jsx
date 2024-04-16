"use client"

import { NextUIProvider } from "@nextui-org/react"

export default function NextUIProviders({ children }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}