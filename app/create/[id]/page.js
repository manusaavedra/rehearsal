"use client"

import { Preview } from "@/components/Preview"
import { useInput } from "@/hooks/useInput"
import { useEffect, useRef, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import Swal from "sweetalert2"
import { v4 as uuidv4 } from 'uuid'
import { Switch } from "@nextui-org/react";
import { SECTIONS_TITLES } from "@/constants"

export default function Create({ params }) {
    const [sections, setSections] = useState([])
    const [disabled, setDisabled] = useState(false)
    const id = useRef()
    const title = useInput("")
    const artist = useInput("")

    useEffect(() => {
        fetch("/api/songs")
            .then((res) => res.json())
            .then((data) => {
                const songById = data.find((song) => song.id === params.id)
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
            title: String(title.value).trim(),
            artist: String(artist.value).trim(),
            sections: JSON.stringify(sections)
        }

        await fetch('/api/songs', {
            method: "post",
            body: JSON.stringify(song)
        })

        Swal.fire({
            text: `[${song.title}], se ha guardado correctamente`,
            showConfirmButton: false,
            showCancelButton: false,
            icon: 'success',
        })
    }

    return (
        <main className="min-h-screen grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
            <div>
                <h2 className="text-3xl mb-4 font-bold">Editar canción</h2>
                <div className="mb-6">
                    <div className="mb-2">
                        <input className="w-full" type="text" onChange={title.onChange} value={title.value} placeholder="Titulo de la canción" />
                    </div>
                    <div className="mb-2">
                        <input className="w-full" type="text" onChange={artist.onChange} value={artist.value} placeholder="Artista" />
                    </div>
                </div>
                <div className="pb-4">
                    <Switch
                        onChange={(e) => setDisabled(e.target.checked)}
                        size="md"
                    >
                        <span>Reordenar secciones</span>
                    </Switch>
                </div>
                <ReactSortable list={sections} setList={setSections} disabled={!disabled}>
                    {
                        sections.map((section, index) => (
                            <section className="border p-2 rounded-md shadow-md mb-4" key={section.id}>

                                <div className="mb-2">
                                    <select
                                        disabled={disabled}
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
                                    disabled={disabled}
                                    className="w-full contain-content resize-none"
                                    name="content"
                                    onChange={(event) => handleChangeSection(index, event)}
                                    value={section.content}
                                    rows="6" cols="50"
                                ></textarea>
                            </section>
                        ))
                    }
                </ReactSortable>
                <div className="sticky bottom-4 flex items-center gap-4">
                    <button className="bg-gray-800 w-full py-2" onClick={handleAddSection}>Agregar sección</button>
                    <button className="w-full py-2" onClick={handleSave}>Guardar</button>
                </div>
            </div>
            <section className="h-full hidden sm:block w-full p-4">
                <Preview
                    title={title.value}
                    artist={artist.value}
                    sections={sections}
                />
            </section>
        </main>
    )
}

