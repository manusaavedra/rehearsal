"use server"

import Link from "next/link"
import { BsPencilSquare } from "react-icons/bs"
import { Skeleton } from "@nextui-org/react"
import { Suspense } from "react"

export default async function Home() {
  const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`)
  const songs = await request.json()

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Suspense fallback={<Loading />}>
        <div className="mt-4">
          {
            songs.map(({ id, title, artist }) => (
              <div className="relative flex items-center border-b" key={id}>
                <Link className="w-full" href={`/preview/${id}`}>
                  <div className="flex flex-col py-2 justify-center">
                    <h4 className="text-base font-semibold">{title}</h4>
                    <p className="text-gray-800 !mb-0">{artist}</p>
                  </div>
                </Link>
                <div className="absolute right-0 top-0 h-full flex items-center gap-2">
                  <Link href={`/create/${id}`}>
                    <BsPencilSquare size={24} />
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
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
