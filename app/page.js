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
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold">Lista de canciones</h2>
      <div className="mt-8">
        {
          songs.map(({ id, title, artist }) => (
            <div className="flex justify-between items-center border-b" key={id}>
              <div>
                <h4 className="text-xl font-semibold">{title}</h4>
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
