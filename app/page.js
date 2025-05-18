"use server"

import Link from "next/link"
import { BsPlus } from "react-icons/bs"
import { Skeleton } from "@nextui-org/react"
import { Suspense } from "react"
import SongListComponent from "@/components/SongList"

export default async function Home() {
  const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`, {
    cache: 'no-store'
  })
  const songs = await request.json()

  return (
    <div className="max-w-5xl mx-auto">
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col">
          <Link href="/create" prefetch className="fixed bottom-4 right-6 z-20 flex bg-blue-500 rounded-full  text-white p-2 items-center gap-2 font-bold">
            <BsPlus
              size={24} />
            <span className="hidden sm:block">Nueva Canción</span>
          </Link>
        </div>
        <SongListComponent data={songs} showButtonSetList={true} />
      </Suspense>
    </div>
  )
}


function Loading() {
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
