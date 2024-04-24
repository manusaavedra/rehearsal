// https://api.lyrics.ovh/suggest/
//https://api.lyrics.ovh/v1/artist/title
"use client"

import { useInput } from "@/hooks/useInput"
import { Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { BsPlus } from "react-icons/bs"
import { v4 as uuidv4 } from 'uuid'

export default function SearchLyrics({ onSelected }) {
    const searchInput = useInput("")
    const [results, setResults] = useState([])

    useEffect(() => {
        fetch(`https://api.lyrics.ovh/suggest/${searchInput.value}`)
            .then((res) => res.json())
            .then((data) => setResults(data))
    }, [searchInput.value])

    const handleChange = (e) => {
        searchInput.onChange(e)
    }

    const handleOnSelected = async (result) => {
        const metadataMap = {
            title: result.title,
            artist: result.artist.name,
            cover: result.album.cover_small,
        }

        const request = await fetch(`https://api.lyrics.ovh/v1/${metadataMap.artist}/${metadataMap.title}`)

        if (request.ok) {
            const result = await request.json()

            const lyricsSections = String(result?.lyrics).replace("Paroles de la chanson ", "").split("\n\n")

            const sections = lyricsSections.map((lyric) => {
                return { content: lyric, title: "", id: uuidv4() }
            })

            const lyric = { ...metadataMap, sections }
            onSelected(lyric)

            return
        }

        const lyric = { ...metadataMap, sections: [] }
        onSelected(lyric)
    }

    return (
        <div className="bg-red relative grid grid-rows-[60px_1fr] w-full h-96 text-black">
            <div className="mb-4">
                <input className="w-full" type="text" onChange={handleChange} value={searchInput.value} placeholder="Buscar en lyrics.ovh" />
            </div>
            <div className="bg-white w-full overflow-y-auto">
                <ul>
                    {
                        results?.data?.map((result) => (
                            <li className="grid grid-cols-[60px_1fr_40px] mb-2" key={result.id}>
                                <div>
                                    <picture className="w-10">
                                        <img src={result.album.cover_small} alt={result.title} />
                                    </picture>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{result.title}</h4>
                                    <span>{result.artist.name}</span>
                                </div>
                                <div>
                                    <Button onPress={() => handleOnSelected(result)} isIconOnly>
                                        <BsPlus size={24} />
                                    </Button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}
