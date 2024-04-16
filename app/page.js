"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BsPlus, BsPencilSquare } from "react-icons/bs"

export default function Home() {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data)
      })
  }, [])

  return (
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
                <Link href={`/create/${id}`}>
                  <BsPencilSquare size={24} />
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
