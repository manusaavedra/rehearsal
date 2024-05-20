"use client"

import Link from "next/link"
import { useSetlistStore } from "@/hooks/useSetlistStore"
import useToggle from "@/hooks/useToggle"
import { Button, ButtonGroup } from "@nextui-org/react"
import { BsDownload, BsList, BsPencilSquare, BsUpload } from "react-icons/bs"
import { FiPlus, FiMinus } from "react-icons/fi"
import useSocketStore from "@/hooks/useSocketStore"
import { ReactSortable } from "react-sortablejs"

const filterArrayById = (a, b) => {
    const setIds = new Set(b.map(item => item.id))
    const resultado = a.filter(item => !setIds.has(item.id))
    return resultado
}

export default function SetList({ data = [] }) {
    const editing = useToggle()
    const { setlist, updateSetlist } = useSetlistStore()
    const songs = filterArrayById(data, setlist)

    const handleAddSong = (song) => {
        useSetlistStore.setState({ setlist: [...setlist, { ...song, isSelected: true }] })
    }

    const handleRemoveSong = (song) => {
        const newSetlist = setlist.filter((s) => s.id !== song.id)
        useSetlistStore.setState({ setlist: newSetlist })
    }

    const handleDownload = async (jsonData) => {
        const jsonString = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `setlist.json`
        a.click()
    }

    const handleChangeImport = async (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()

        reader.onload = function (e) {
            const content = e.target.result
            const jsonData = JSON.parse(content)
            useSetlistStore.setState({ setlist: jsonData })
        }

        reader.readAsText(file)
    }

    return (
        <div className="mt-4 p-4 pb-10">
            <div>
                <ReactSortable list={setlist} setList={updateSetlist}>
                    {
                        setlist
                            .map((song) => (
                                <SongItem
                                    key={song.id}
                                    song={song}
                                    handleAddSong={handleAddSong}
                                    handleRemoveSong={handleRemoveSong}
                                />
                            ))
                    }
                </ReactSortable>
                {
                    editing.value && songs.map((song) => (
                        <SongItem
                            key={song.id}
                            song={song}
                            handleAddSong={handleAddSong}
                            handleRemoveSong={handleRemoveSong}
                        />
                    ))
                }
            </div>
            <section className="fixed bottom-4 left-0 w-full flex justify-center">
                <ButtonGroup className="bg-gray-200 rounded-lg">
                    <Button isDisabled={!editing.value} onPress={editing.close}>
                        <BsList size={24} />
                        <span className="hidden sm:block">Setlist</span>
                    </Button>
                    <Button isDisabled={editing.value} onPress={() => handleDownload(setlist)}>
                        <BsDownload size={24} />
                        <span className="hidden sm:block">Download</span>
                    </Button>
                    <Button className="relative" isDisabled={editing.value} onPress={editing.close}>
                        <BsUpload size={24} />
                        <input type="file" onChange={handleChangeImport} className="absolute top-0 left-0 w-full h-full opacity-0" />
                        <span className="hidden sm:block">Importar</span>
                    </Button>
                    <Button isDisabled={editing.value} onPress={editing.open}>
                        <BsPencilSquare size={24} />
                        <span className="hidden sm:block">Editar</span>
                    </Button>
                </ButtonGroup>
            </section>
        </div>
    )
}

function SongItem({ song, handleAddSong, handleRemoveSong }) {
    const { id, title, image, artist, isSelected } = song
    const setlistHandleClick = isSelected ? handleRemoveSong : handleAddSong

    return (
        <div className={`relative flex justify-center border-b`}>
            <Link className={`${!isSelected ? 'opacity-30' : 'opacity-100'} w-full grid grid-cols-[60px_1fr] gap-2 items-center`} href={`/preview/${id}`}>
                <picture className="w-[60px] h-[60px] flex items-center">
                    <img src={image ? image : '/icon512_rounded.png'} alt={title} />
                </picture>
                <div className="flex flex-col w-[80%] py-2 overflow-hidden justify-center">
                    <h4 className="text-base truncate text-ellipsis uppercase font-semibold">{title}</h4>
                    <p title={artist} className="text-gray-800 truncate overflow-ellipsis !mb-0">{artist}</p>
                </div>
            </Link>
            <div className="absolute top-0 h-full right-2 flex items-center gap-4">
                <button onClick={() => setlistHandleClick(song)}>
                    {
                        isSelected
                            ? <FiMinus size={24} />
                            : <FiPlus size={24} />
                    }
                </button>
            </div>
        </div>
    )
}
