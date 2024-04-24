"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPlus } from "react-icons/bs";

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="bg-gray-50 shadow-sm flex items-center justify-between px-4 py-2">
            <div className="flex flex-col">
                <Link href="/" prefetch className="text-2xl font-bold">Rehearsal</Link>
                <span className="text-xs">by Casa de oración</span>
            </div>
            {
                pathname === "/" && (
                    <div className="flex flex-col">
                        <Link href="/create" prefetch className="flex bg-gray-200 p-2 rounded-md items-center gap-2 font-bold">
                            <BsPlus size={24} />
                            Nueva Canción
                        </Link>
                    </div>
                )
            }
        </header>
    )
}