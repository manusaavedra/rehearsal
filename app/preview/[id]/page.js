"use client"

import { Preview } from "@/components/Preview"
import { useEffect, useState } from "react"

export default function Create({ params }) {
    const [song, setSong] = useState(null)

    useEffect(() => {
        fetch("/api/songs")
            .then((res) => res.json())
            .then((data) => {
                const songById = data.find((song) => song.id === parseInt(params.id))
                const { sections, ...restSong } = songById
                const parseSections = JSON.parse(sections) || []
                console.log({ ...restSong, sections: parseSections })
                setSong({ ...restSong, sections: parseSections })
            })
    }, [params.id])

    return <div className="max-w-4xl mx-auto">
        {
            song && (
                <Preview {...song} />
            )
        }
    </div>
}