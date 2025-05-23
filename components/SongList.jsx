"use client"

import { useInput } from "@/hooks/useInput";
import { useSetlistStore } from "@/hooks/useSetlistStore";
import Link from "next/link";
import { BsPencilSquare } from "react-icons/bs";
import { FiPlus, FiMinus } from "react-icons/fi";

const filterArrayById = (a, b) => {
    const setIds = new Set(b.map(item => item.id))
    const resultado = a.filter(item => !setIds.has(item.id))
    return resultado
}

export default function SongListComponent({ data = [], showButtonSetList = true, showButtonEdit = true }) {
    const inputSearch = useInput("")
    const setlist = useSetlistStore((state) => state.setlist)
    const compareSong = filterArrayById(data, setlist)

    const handleAddSong = (song) => {
        useSetlistStore.setState({ setlist: [...setlist, { ...song, isSelected: true }] })
    }

    const handleRemoveSong = (song) => {
        const newSetlist = setlist.filter((s) => s.id !== song.id)
        useSetlistStore.setState({ setlist: newSetlist })
    }

    const SongItem = ({ song }) => {
        const { id, title, image, artist, isSelected } = song
        const setlistHandleClick = () => !isSelected ? handleAddSong(song) : handleRemoveSong(song)

        return (
            <div className="relative grid grid-cols-[1fr_100px] border-b" key={id}>
                <Link className="w-full grid grid-cols-[60px_1fr] gap-2 items-center" href={`/preview/${id}`}>
                    <picture className="w-[60px] h-[60px] overflow-hidden flex items-center">
                        <img src={image ? image : '/icon512_rounded.png'} alt={title} />
                    </picture>
                    <div className="flex flex-col w-[80%] py-2 overflow-hidden justify-center">
                        <h4 className="text-base truncate text-ellipsis uppercase font-semibold">{title}</h4>
                        <p title={artist} className="text-gray-800 truncate overflow-ellipsis !mb-0">{artist}</p>
                    </div>
                </Link>
                <div className="h-full flex items-center gap-4">
                    {
                        showButtonSetList && (
                            <button onClick={setlistHandleClick}>
                                {
                                    isSelected
                                        ? <FiMinus size={26} />
                                        : <FiPlus size={26} />
                                }
                            </button>
                        )
                    }
                    {
                        showButtonEdit && (
                            <Link href={`/create/${id}`}>
                                <BsPencilSquare size={24} />
                            </Link>
                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 pb-10">
            <div className="sticky bg-white py-2 z-30 top-0">
                <input className="w-full" onChange={inputSearch.onChange} value={inputSearch.value} type="text" placeholder="Buscar" />
            </div>
            <div>
                {
                    compareSong
                        .filter((song) => {
                            return String(song.title).toLowerCase()
                                .includes(String(inputSearch.value).toLowerCase())
                                || String(song.artist).toLowerCase()
                                    .includes(String(inputSearch.value).toLowerCase())
                        })
                        .map((song) => (
                            <SongItem key={song.id} song={song} />
                        ))
                }
            </div>
        </div>
    )
}