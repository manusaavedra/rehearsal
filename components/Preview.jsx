"use client"

import { useCallback, useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { SectionIndicator } from "./SectionIndicator";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function Preview({ title, artist, sections }) {
    const [semitone, setSemitone] = useState(0)
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
        return text.replace(/[7]/g, (match) => {
            const superscripts = {
                '7': '⁷'
            }
            return superscripts[match];
        })
    }

    const chordFormat = (text, semitones) => {
        const transposeText = text.replace(/\[(.*?)\]/g, (match, chord) => {
            return "[" + transposeChord(chord, semitones) + "]"
        });

        const replacedText = replaceNumbersWithSuperscripts(transposeText)

        const regex = /\[(.*?)\]/g
        let format = String(replacedText)
            .replace(regex, '<span class="chord">$1</span>')
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

    const handleIncrementSemitone = () => {
        setSemitone((prevState) => {
            const newState = prevState + 1

            router.push(pathname + '?' + createQueryString('semitone', newState))

            return newState
        })
    }

    const handleDecrementSemitone = () => {
        setSemitone((prevState) => {
            const newState = prevState - 1

            router.push(pathname + '?' + createQueryString('semitone', newState))

            return newState
        })
    }

    return (
        <div className="pt-10 p-4">
            <div className="mb-6">
                <h1 className="font-bold text-2xl">{title}</h1>
                <h4 className="text-sm">{artist}</h4>
                <fieldset className="mb-4 py-2 p-2 border rounded-md border-gray-200">
                    <legend className="font-semibold text-center text-sm">Transpose</legend>
                    <div className="flex items-center justify-center gap-2">
                        <button className="bg-black" onClick={handleDecrementSemitone}>
                            <FiMinus />
                        </button>
                        {semitone}
                        <button className="bg-black" onClick={handleIncrementSemitone}>
                            <FiPlus />
                        </button>
                    </div>
                </fieldset>
            </div>
            {
                sections.map((section) => {
                    const chart = chordFormat(section.content, semitone)
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