import { Loading } from "@/components/Loading"
import Link from "next/link"
import { Suspense } from "react"
import { BsPencilSquare } from "react-icons/bs"

export default async function Home() {
  const request = await fetch(`${process.env.NEXT_HOSTNAME}/api/songs`)
  const songs = await request.json()

  return (
    <Suspense fallback={<Loading />}>
      <div className="max-w-5xl mx-auto p-4">
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
                  <Link prefetch href={`/create/${id}`}>
                    <BsPencilSquare size={24} />
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Suspense>
  )
}
