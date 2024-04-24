"use client"

import { useCallback, useEffect, useState } from "react";
import { SectionIndicator } from "./SectionIndicator";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Switch, Slider } from "@nextui-org/react";
import ModalButton from "./ModalButton";
import { HiOutlineAdjustments } from "react-icons/hi";
import useToggle from "@/hooks/useToggle";

export function Preview({ title, artist, image, sections, links }) {
    const [semitone, setSemitone] = useState(0)
    const [showMetadata, setShowMetadata] = useState(true)
    const [showChords, setShowChords] = useState(true)
    const sticky = useToggle(false)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const semitone = searchParams.get("semitone")
        setSemitone(parseInt(semitone ?? 0))
    }, [searchParams])

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const replaceNumbersWithSuperscripts = (text) => {
        return text.replace(/[123456789]/g, (match) => {
            const superscripts = {
                '1': '¹',
                '2': '²',
                '3': '³',
                '4': '⁴',
                '5': '⁵',
                '6': '⁶',
                '7': '⁷',
                '8': '⁸',
                '9': '⁹'
            }
            return superscripts[match];
        })
    }

    const metadataFormat = (text, visible) => {
        const chordRegex = /\{(.*?)\}/g
        const metaElement = visible ? '<span class="chord-metadata">$1</span>' : ''
        let format = String(text)
            .replace(chordRegex, metaElement)
            .replace(/\n/g, '</p><p>')

        return format
    }

    const chordFormat = (text, semitones, options) => {
        const chordRegex = /\[(.*?)\]/g
        const transposeText = text.replace(/\[(.*?)\]/g, (_, chord) => {
            return "[" + transposeChord(chord, semitones) + "]"
        })

        let format = replaceNumbersWithSuperscripts(transposeText)

        const chordElement = options?.visibleChords ? `<span class="chord">$1</span>` : ''

        format = metadataFormat(format, options?.visibleMetadata)
        format = String(format)
            .replace(chordRegex, chordElement)
            .replace(/\n/g, '</p><p>')

        format = `<pre><p>${format}</p></pre>`;
        format = format.replace(/<p><\/p>/g, '')

        return format;
    }

    function transposeChord(chord, amount) {
        const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const normalizeMap = { "Cb": "B", "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "E#": "F", "B#": "C" }
        return chord.replace(/[CDEFGAB](b|#)?/g, (match) => {
            const i = (scale.indexOf((normalizeMap[match] ? normalizeMap[match] : match)) + amount) % scale.length;
            return scale[i < 0 ? i + scale.length : i];
        })
    }

    const handleChangeSemitone = (value) => {
        const newState = value
        router.push(pathname + '?' + createQueryString('semitone', newState))
        setSemitone(newState)
    }

    return (
        <div className="pt-8 p-4">
            <div className={`sticky grid grid-cols-[60px_1fr_100px] items-center gap-4 z-20 top-0 left-0 w-full py-2 bg-white`}>
                <div>
                    {
                        image && (
                            <picture className="w-16 block">
                                <img className="w-full" src={image} alt={title} />
                            </picture>
                        )
                    }
                </div>
                <div className="overflow-hidden">
                    <h4 className="text-sm truncate text-gray-600">{artist}</h4>
                    <h1 className="font-bold text-xl sm:text-2xl truncate">{title}</h1>
                    <div className="flex gap-2 w-full overflow-x-scroll py-1 items-center">
                        {
                            links && links.map(({ id, title, url }) => (
                                <a className="px-4 py-1 rounded-full bg-gray-200 text-xs" key={id} href={url} rel="noreferrer" target="_blank">{title}</a>
                            ))
                        }
                    </div>
                </div>
                <div className="my-4">
                    <ModalButton buttonChildren={<HiOutlineAdjustments size={24} />}>
                        <fieldset className="mb-4 flex flex-col gap-3 py-2 p-2 border rounded-md border-gray-200">
                            <legend className="font-semibold text-center text-sm">Configurar vista</legend>
                            <div className="flex items-center justify-center gap-2">
                                <Slider
                                    size="md"
                                    step={1}
                                    onChange={handleChangeSemitone}
                                    label="Transpose"
                                    showSteps={true}
                                    maxValue={12}
                                    minValue={-12}
                                    defaultValue={0}
                                    value={semitone}
                                    className="max-w-md"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
                                <div>
                                    <Switch
                                        isSelected={showChords}
                                        onChange={(e) => setShowChords(e.target.checked)}
                                        size="md"
                                    >
                                        <span>Acordes</span>
                                    </Switch>
                                </div>
                                <div>
                                    <Switch
                                        isSelected={showMetadata}
                                        onChange={(e) => setShowMetadata(e.target.checked)}
                                        size="md"
                                    >
                                        <span>Comentarios</span>
                                    </Switch>
                                </div>
                            </div>
                        </fieldset>
                    </ModalButton>
                </div>
            </div>
            {
                sections.map((section) => {
                    const chart = chordFormat(section.content, semitone, {
                        visibleChords: showChords,
                        visibleMetadata: showMetadata
                    })
                    return (
                        <fieldset className="mb-4 py-4 pt-6 px-4 border-2 rounded-md border-gray-200" key={section.id}>
                            <legend className="font-semibold flex items-center gap-2">
                                <SectionIndicator sectionTitle={section.title} />
                                {section.title}
                            </legend>
                            <div dangerouslySetInnerHTML={{ __html: chart }} />
                        </fieldset>
                    )
                })
            }
        </div>
    )
}