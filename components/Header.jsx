"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsList } from "react-icons/bs";

export default function Header({ children }) {
    const pathname = usePathname()
    return (
        <header className="bg-gray-50 shadow-sm flex items-center justify-between px-4 py-2">
            <div className="flex flex-col">
                <Link href="/" prefetch className="text-2xl font-bold">Rehearsal</Link>
                <p className="text-xs text-gray-600">made by <a className="font-semibold" href="https://www.instagram.com/manukeyboard/">@manukeaboard</a> </p>
            </div>
            {children}
            {/*
                pathname !== '/setlist' && (
                    <Link href="/setlist" prefetch className="flex print:hidden bg-gray-200 p-2 rounded-md items-center gap-2 font-bold">
                        <BsList
                            size={24} />
                        SetList
                    </Link>
                )
            */}
        </header>
    )
}