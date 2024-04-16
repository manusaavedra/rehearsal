"use client"

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

export function Preview({ title, artist, sections }) {
    const [semitone, setSemitone] = useState(0)

    const replaceNumbersWithSuperscripts = (text) => {
        return text.replace(/[6789]/g, (match) => {
            const superscripts = {
                '6': '⁶',
                '7': '⁷',
                '8': '⁸',
                '9': '⁹'
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

        format = `<pre>${format}</pre>`;
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
        setSemitone((prevState) => prevState + 1)
    }

    const handleDecrementSemitone = () => {
        setSemitone((prevState) => prevState - 1)
    }

    return (
        <div className="pt-10 p-4">
            <div className="mb-6">
                <h1 className="font-bold text-2xl">{title}</h1>
                <h4 className="text-sm">{artist}</h4>
                <fieldset className="mb-4 py-2 p-2 border rounded-md border-gray-200">
                    <legend className="font-semibold text-center text-sm">Transpose</legend>
                    <div className="flex items-center justify-center gap-2">
                        <button className="bg-gray-800" onClick={handleDecrementSemitone}>
                            <FiMinus />
                        </button>
                        {semitone}
                        <button className="bg-gray-800" onClick={handleIncrementSemitone}>
                            <FiPlus />
                        </button>
                    </div>
                </fieldset>
            </div>
            {
                sections.map((section) => {
                    const chart = chordFormat(section.content, semitone)
                    return (
                        <fieldset className="mb-4 py-4 p-2 border rounded-md border-gray-200" key={section.id}>
                            <legend className="font-semibold">{section.title}</legend>
                            <p dangerouslySetInnerHTML={{ __html: chart }} />
                        </fieldset>
                    )
                })
            }
        </div>
    )
}