"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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
      <h2 className="text-3xl font-bold">Rehearsal</h2>
      <Link href={`/create`}>Añadir nueva canción</Link>
      <div className="mt-8">
        {
          songs.map(({ id, title, artist }) => (
            <div className="flex gap-10 items-center border-b" key={id}>
              <div>
                <h4 className="text-base font-semibold">{title}</h4>
                <p className="text-gray-800">{artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/create/${id}`}>Editar</Link>
                <Link href={`/preview/${id}`}>Ver</Link>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
