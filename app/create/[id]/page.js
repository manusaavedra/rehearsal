"use client"

import { Preview } from "@/components/Preview"
import { useInput } from "@/hooks/useInput"
import { useEffect, useRef, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import { v4 as uuidv4 } from 'uuid'

const SECTIONS_TITLES = [
    "INTRO",
    "VERSO",
    "VERSO 1",
    "VERSO 2",
    "VERSO 3",
    "VERSO 4",
    "PRE CORO",
    "PRE CORO 1",
    "PRE CORO 2",
    "CORO",
    "CORO 1",
    "CORO 2",
    "CORO 3",
    "CORO 4",
    "PUENTE",
    "PUENTE 1",
    "PUENTE 2",
    "PUENTE 3",
    "PUENTE 4",
    "FINAL"
]

export default function Create({ params }) {
    const [sections, setSections] = useState([])
    const id = useRef()
    const title = useInput("")
    const artist = useInput("")

    useEffect(() => {
        fetch("/api/songs")
            .then((res) => res.json())
            .then((data) => {
                const songById = data.find((song) => song.id === parseInt(params.id))
                const { sections, ...restSong } = songById
                const parseSections = JSON.parse(sections) || []
                title.setValue(restSong.title)
                artist.setValue(restSong.artist)
                id.current = restSong.id
                setSections(parseSections)
            })
    }, [params.id])

    const handleAddSection = () => {
        setSections((state) => [
            ...state,
            {
                id: uuidv4(),
                title: "",
                content: ""
            }
        ])
    }

    const handleChangeSection = (index, event) => {
        const newSections = sections.map((section, i) => {
            if (index === i) {
                const { name, value } = event.target
                return {
                    ...section,
                    [name]: value
                }
            }

            return section
        })

        setSections(newSections)
    }

    const handleSave = async () => {
        const song = {
            id: id.current,
            title: title.value,
            artist: artist.value,
            sections: JSON.stringify(sections)
        }

        const req = await fetch('/api/songs', {
            method: "post",
            body: JSON.stringify(song)
        })

        const data = await req.json()
        id.current = data.id
    }

    return (
        <main className="min-h-screen grid grid-cols-2 gap-2 p-4">
            <div>
                <div className="mb-6">
                    <div className="mb-2">
                        <input className="w-full" type="text" onChange={title.onChange} value={title.value} placeholder="Titulo de la canción" />
                    </div>
                    <div className="mb-2">
                        <input className="w-full" type="text" onChange={artist.onChange} value={artist.value} placeholder="Artista" />
                    </div>
                </div>

                {
                    sections.map((section, index) => (
                        <section className="border p-2 rounded-md shadow-md mb-4" key={section.id}>

                            <div className="mb-2">
                                <select
                                    name="title"
                                    onChange={(event) => handleChangeSection(index, event)}
                                    value={section.title}
                                >
                                    <option value="">SECCIÓN</option>
                                    {
                                        SECTIONS_TITLES.map((title) => (
                                            <option key={title} value={title}>{title}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <textarea
                                className="w-full contain-content resize-none"
                                name="content"
                                onChange={(event) => handleChangeSection(index, event)}
                                value={section.content}
                                rows="6" cols="50"
                            ></textarea>
                        </section>
                    ))
                }
                <div className="sticky bottom-4 flex items-center gap-4">
                    <button className="bg-gray-800 w-full py-2" onClick={handleAddSection}>Agregar sección</button>
                    <button className="w-full py-2" onClick={handleSave}>Guardar</button>
                </div>
            </div>
            <section className="h-full w-full p-4">
                <Preview
                    title={title.value}
                    artist={artist.value}
                    sections={sections}
                />
            </section>
        </main>
    )
}

