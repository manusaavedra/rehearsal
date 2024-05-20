// https://api.lyrics.ovh/suggest/
//https://api.lyrics.ovh/v1/artist/title
"use client"

import { useInput } from "@/hooks/useInput"
import { Button } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { BsPlus } from "react-icons/bs"
import { useDebouncedCallback } from "use-debounce"
import { v4 as uuidv4 } from 'uuid'
import * as cheerio from 'cheerio';

export default function SearchLyrics({ onSelected }) {
    const searchInput = useInput("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const debounced = useDebouncedCallback((value) => {
        if (String(value).length > 0) {
            setLoading(true)
            fetch(`/api/search?q=${value}`)
                .then((res) => res.json())
                .then((result) => setResults(result))
                .finally(() => {
                    setLoading(false)
                })
        }
    }, 700)

    const handleChange = (e) => {
        searchInput.onChange(e)
        debounced(e.target.value)
    }

    const handleOnSelected = async (result) => {
        const response = await fetch(`/api/lyrics?url=${result.lyricsUrl}`);
        const { text } = await response.json();

        if (text) {
            const $ = cheerio.load(text);
            const blocks = $(".lyric-original > p")

            const sectionsArray = blocks.map((_, el) => {
                return $(el).html().replace(/\s*<br>\s*/g, '\n')
            }).toArray()

            const sections = sectionsArray.map((section) => {
                return { id: uuidv4(), title: "", content: section }
            })

            const lyrics = { ...result, sections }
            return onSelected(lyrics)
        }

        return onSelected({ ...result, sections: [] })

    }

    console.log(results)

    return (
        <div className="bg-red relative grid grid-rows-[60px_1fr] w-full h-96 text-black">
            <div className="mb-4">
                <input className="w-full" type="text" onChange={handleChange} value={searchInput.value} placeholder="Buscar en letras.com 💓" />
            </div>
            {
                loading && (
                    <div>
                        <p>Resultados desde letras.com 💓</p>
                    </div>
                )
            }
            <div className="bg-white w-full overflow-y-auto">
                <ul>
                    {
                        results.map((result) => (
                            <li className="grid grid-cols-[60px_1fr_40px] gap-2 mb-2" key={result.id}>
                                <div>
                                    <picture className="w-10">
                                        <img src={result.image} alt={result.title} />
                                    </picture>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{result.title}</h4>
                                    <span>{result.artist}</span>
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
