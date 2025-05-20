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
            </div>
            {children}
            {
                pathname !== '/setlist' && (
                    <Link href="/setlist" prefetch className="flex bg-gray-200 p-2 rounded-md items-center gap-2 font-bold">
                        <BsList
                            size={24} />
                        SetList
                    </Link>
                )
            }
        </header>
    )
}