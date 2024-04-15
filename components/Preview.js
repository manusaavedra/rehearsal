"use client"

import { useState } from "react";

export function Preview({ title, artist, sections }) {
    const [semitone, setSemitone] = useState(0)

    const chordFormat = (text, semitones) => {
        const transposeText = text.replace(/\[(.*?)\]/g, (match, chord) => {
            return "[" + transposeChord(chord, semitones) + "]";
        });
        const regex = /\[(.*?)\]/g;
        let format = String(transposeText).replace(regex, '<span class="chord">$1</span>')
            .replace(/\n/g, '</p><p>')
            .replace(/7/g, '⁷')

        format = `<p>${format}</p>`
        format = format.replace(/<p><\/p>/g, '')
        return format;
    }

    function transposeChord(chord, amount) {
        const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        const normalizeMap = { "Cb": "B", "Db": "C#", "Eb": "D#", "Fb": "E", "Gb": "F#", "Ab": "G#", "Bb": "A#", "E#": "F", "B#": "C" }
        return chord.replace(/[CDEFGAB](b|#)?/g, function (match) {
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
        <div className="pt-10">
            <div className="mb-6">
                <h1 className="font-bold text-2xl">{title}</h1>
                <h4 className="text-xs">{artist}</h4>
                <fieldset className="mb-4 py-2 p-2 border rounded-md border-gray-200">
                    <legend className="font-semibold text-center text-sm">Transpose</legend>
                    <div className="flex items-center justify-center gap-2">
                        <button className="bg-gray-800" onClick={handleDecrementSemitone}>-</button>
                        {semitone}
                        <button className="bg-gray-800" onClick={handleIncrementSemitone}>+</button>
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