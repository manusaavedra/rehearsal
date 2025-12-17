"use client"

import { Preview } from "@/components/Preview"
import { useInput } from "@/hooks/useInput"
import { useRef, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import Swal from "sweetalert2"
import { v4 as uuidv4 } from 'uuid'
import { Switch } from "@nextui-org/react";
import { SECTIONS_TITLES } from "@/constants"
import FetchButton from "./FetchButton"
import revalidateData from "@/actions"
import Editor from "./Editor"
import { BsCopy, BsLink45Deg, BsSearch, BsTrash } from "react-icons/bs"
import { Button, ButtonGroup } from "@nextui-org/react"
import ModalButton from "./ModalButton"
import SearchLyrics from "./SearchLyrics"
import ImageInput from "./ImageInput"

export default function FormSongs({ song, mode = "create" }) {
    const [sections, setSections] = useState(song?.sections || [])
    const [links, setLinks] = useState(song?.links || [])
    const [disabled, setDisabled] = useState(false)

    const isEditable = mode === "edit"

    const id = useRef(song?.id || null)
    const title = useInput(song?.title || "")
    const artist = useInput(song?.artist || "")
    const image = useInput(song?.image || "")

    const handleAddSectionBefore = (index) => {
        const newSection = {
            id: uuidv4(),
            title: "",
            content: ""
        }
        const newSections = sections.slice()
        newSections.splice(index, 0, newSection)
        setSections(newSections)
    }

    const handleAddSectionAfter = (index) => {
        const newSection = {
            id: uuidv4(),
            title: "",
            content: ""
        }

        const newSections = sections.slice()
        newSections.splice(index + 1, 0, newSection)
        setSections(newSections)
    }

    const handleAddSection = () => {
        // guarda en una variable si hay algun elemento textarea focus

        /*setSections((state) => [
            ...state,
            {
                id: uuidv4(),
                title: "",
                content: ""
            }
        ])*/
    }

    const handleAddLink = () => {
        setLinks((state) => [
            ...state,
            {
                id: uuidv4(),
                title: "",
                url: "",
            }
        ])
    }

    const handleChangeSection = (event, index) => {
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

    const handleChangeLink = (event, index) => {
        const newLinks = links.map((link, i) => {
            if (index === i) {
                const { name, value } = event.target
                return {
                    ...link,
                    [name]: value
                }
            }

            return link
        })

        setLinks(newLinks)
    }

    const handleDuplicateSection = (section) => {
        const { id, ...restSection } = section
        const newSection = {
            id: uuidv4(),
            ...restSection
        }

        const newSections = sections.slice()
        const sectionIndex = newSections.findIndex((section) => section.id === id)
        newSections.splice(sectionIndex, 0, newSection)
        setSections(newSections)
    }

    const handleDeleteSection = (section) => {
        const newSections = sections.filter((s) => s.id !== section.id)
        setSections(newSections)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        const song = {
            id: id.current,
            title: String(title.value).trim(),
            artist: String(artist.value).trim(),
            image: String(image.value).trim(),
            sections: JSON.stringify(sections),
            links: JSON.stringify(links)
        }

        const request = await fetch('/api/songs', {
            method: "post",
            body: JSON.stringify(song),
        })

        if (request.ok) {
            const newsong = await request.json()
            id.current = newsong.id

            await revalidateData(newsong.id)

            Swal.fire({
                text: `[${song.title}], se ha guardado correctamente`,
                showConfirmButton: false,
                showCancelButton: false,
                icon: 'success',
            })

        }

    }

    const handleSelected = (lyric) => {
        title.setValue(lyric.title)
        artist.setValue(lyric.artist)
        image.setValue(lyric.image)
        setSections(lyric.sections)
    }

    const handleLinkRemove = (dlink) => {
        const newLinks = links.filter((link) => link.id !== dlink.id)
        setLinks(newLinks)
    }

    return (
        <main className="min-h-screen grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
            <div>
                <h2 className="text-3xl mb-4 font-bold">{isEditable ? 'Editar ' : 'Añadir '} canción</h2>
                <ImageInput
                    onChange={image.onChange}
                    value={image.value}
                    alt={title.value}
                />
                <div className="mb-6">
                    <div className="flex items-center gap-2 flex-nowrap mb-2">
                        <input className="w-full" type="text" onChange={title.onChange} value={title.value} placeholder="Titulo de la canción" />
                        {
                            !isEditable && (
                                <ModalButton buttonChildren={<BsSearch size={16} />}>
                                    <div>
                                        <SearchLyrics onSelected={handleSelected} />
                                    </div>
                                </ModalButton>
                            )
                        }
                    </div>
                    <div className="mb-2">
                        <input className="w-full" type="text" onChange={artist.onChange} value={artist.value} placeholder="Artista" />
                    </div>
                </div>
                <div className="my-6">
                    {
                        links.map((link, index) => (
                            <div key={link.id} className="grid grid-cols-[1fr,30px] items-center gap-2">
                                <div className="flex flex-col gap-2 border p-2 rounded-md shadow-md mb-4">
                                    <div>
                                        <input className="w-full" name="title" type="text" onChange={(event) => { handleChangeLink(event, index) }} value={link.title} placeholder="Nombre de Link" />
                                    </div>
                                    <div>
                                        <input className="w-full" name="url" type="text" onChange={(event) => { handleChangeLink(event, index) }} value={link.url} placeholder="URL" />
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => handleLinkRemove(link)} className="flex items-center justify-center bg-red-500 text-white font-semibold h-8 w-8 rounded-md">
                                        <BsTrash size={24} />
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    <button className="flex items-center gap-2 justify-center bg-gray-200 w-full py-2" onClick={handleAddLink}>
                        <BsLink45Deg size={24} />
                        Aduntar Link
                    </button>
                </div>
                <div className="pb-4 text-right">
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
                            <section className="border p-2 rounded-md shadow-md mb-4 group" key={section.id}>
                                <div className="flex items-center mb-2 justify-between">
                                    <select
                                        disabled={disabled}
                                        name="title"
                                        onChange={(event) => handleChangeSection(event, index)}
                                        value={section.title}
                                    >
                                        <option value="">SECCIÓN</option>
                                        {
                                            SECTIONS_TITLES.map((title) => (
                                                <option key={title} value={title}>{title}</option>
                                            ))
                                        }
                                    </select>
                                    <ButtonGroup>
                                        <Button isDisabled={disabled} onClick={() => handleDuplicateSection(section)} isIconOnly >
                                            <BsCopy />
                                        </Button>
                                        <Button isDisabled={disabled} onClick={() => handleDeleteSection(section)} isIconOnly >
                                            <BsTrash />
                                        </Button>
                                    </ButtonGroup>
                                </div>
                                <Editor
                                    dataindex={index}
                                    disabled={disabled}
                                    className="w-full contain-content resize-none pb-4"
                                    name="content"
                                    onChange={handleChangeSection}
                                    value={section.content}
                                    rows="6" cols="50"
                                />
                                <div className="flex items-center gap-2 opacity-0  group-focus-within:opacity-100  group-hover:opacity-100 transition-opacity duration-150">
                                    <button onClick={() => handleAddSectionBefore(index)} className="bg-gray-200 w-full py-2 text-xs">Nueva sección antes</button>
                                    <button onClick={() => handleAddSectionAfter(index)} className="bg-gray-200 w-full py-2 text-xs">Nueva sección después</button>
                                </div>
                            </section>
                        ))
                    }
                </ReactSortable>
                <div className="sticky bottom-4 flex items-center gap-4">
                    <FetchButton className="bg-black text-white w-full py-3" onClick={handleSave}>Guardar</FetchButton>
                </div>
            </div>
            <section className="h-full hidden sm:block w-full p-4">
                {
                    sections.length > 0 && (
                        <Preview
                            title={title.value}
                            artist={artist.value}
                            image={image.value}
                            sections={sections}
                        />
                    )
                }
            </section>
        </main>
    )
}

