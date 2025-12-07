"use client"

import { useEffect, useState } from "react";
import { SectionIndicator } from "./SectionIndicator";
import { useSearchParams } from "next/navigation";
import { Switch, Slider, Button } from "@nextui-org/react";
import ModalButton from "./ModalButton";
import { HiOutlineAdjustments } from "react-icons/hi";
import Image from "./Image";
import { FaPrint } from "react-icons/fa"
import { TbFileTypeTxt } from "react-icons/tb"
import useBuildSearchParams from "@/hooks/useBuildSearchParams";

export function Preview({ title, artist, image, sections, links }) {
    const [semitone, setSemitone] = useState(0)
    const [showMetadata, setShowMetadata] = useState(true)
    const [showChords, setShowChords] = useState(true)

    const { appendQueryString } = useBuildSearchParams()
    const searchParams = useSearchParams()

    useEffect(() => {
        const semitone = searchParams.get("semitone")
        const section = searchParams.get("section")

        //setSemitone(parseInt(semitone ?? 0))
    }, [searchParams])

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

    const htmlToPlainTextWithChords = (htmlText) => {
        // Convertir todo el HTML generado por `chordFormat` a texto plano.
        // Siempre convierte todas las secciones juntas cuando se llama sin argumento.

        const convertSingle = (html) => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(String(html), 'text/html')

            const linesOut = []

            const processLineElement = (el) => {
                let textLine = ''
                const chordChars = []

                const ensureChordLen = (len) => {
                    while (chordChars.length < len) chordChars.push(' ')
                }

                const insertChordAt = (pos, chord) => {
                    ensureChordLen(pos)
                    for (let i = 0; i < chord.length; i++) {
                        chordChars[pos + i] = chord[i]
                    }
                }

                const walk = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const txt = node.textContent.replace(/\u00A0/g, ' ')
                        textLine += txt
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const nodeEl = node
                        if (nodeEl.classList && nodeEl.classList.contains('chord')) {
                            const chord = nodeEl.textContent.trim()
                            const pos = textLine.length
                            insertChordAt(pos, chord)
                        } else if (nodeEl.tagName === 'BR') {
                            // ignore here, handled by structure
                        } else {
                            nodeEl.childNodes.forEach(walk)
                        }
                    }
                }

                el.childNodes.forEach(walk)

                const chordLine = chordChars.join('').replace(/\s+$/g, '')
                if (chordLine.trim()) {
                    linesOut.push(chordLine)
                }
                linesOut.push(textLine.replace(/\s+$/g, ''))
            }

            doc.body.childNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'P' || node.tagName === 'PRE')) {
                    if (node.tagName === 'PRE') {
                        if (node.querySelectorAll('p').length) {
                            node.querySelectorAll('p').forEach(processLineElement)
                        } else {
                            processLineElement(node)
                        }
                    } else {
                        processLineElement(node)
                    }
                } else if (node.nodeType === Node.TEXT_NODE) {
                    const txt = node.textContent.trim()
                    if (txt) linesOut.push(txt)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.childNodes.length) {
                        node.childNodes.forEach((child) => {
                            if (child.nodeType === Node.ELEMENT_NODE && (child.tagName === 'P' || child.tagName === 'PRE')) {
                                processLineElement(child)
                            } else if (child.nodeType === Node.ELEMENT_NODE) {
                                processLineElement(child)
                            } else if (child.nodeType === Node.TEXT_NODE) {
                                const t = child.textContent.trim()
                                if (t) linesOut.push(t)
                            }
                        })
                    }
                }
            })

            return linesOut.join('\n')
                .replace(/\n{3,}/g, '\n\n')
                .replace(/\t/g, '    ')
                .trim()
        }

        // Siempre convertir todas las secciones juntas y unirlas con dos saltos de línea
        const all = sections.map((section) => {
            const chart = chordFormat(section.content, semitone, {
                visibleChords: showChords,
                visibleMetadata: showMetadata
            })
            const text = convertSingle(chart)
            return `${section.title}\n${text}`
        }).join('\n\n')

        try {
            const blob = new Blob([all], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const safeTitle = (`${title}_${artist}` || 'song').replace(/[^a-z0-9_\- ]/gi, '')
            a.download = `${safeTitle || 'song'}.txt`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error('No se pudo generar la descarga .txt', e)
        }
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
        setSemitone(value)
    }

    const handleChangeSection = (value) => {
        appendQueryString("section", value)
    }

    const renderSections = () => {
        return sections.map((section) => {
            const chart = chordFormat(section.content, semitone, {
                visibleChords: showChords,
                visibleMetadata: showMetadata
            })
            return (
                <fieldset onClick={() => handleChangeSection(section.title)} className="mb-4 py-4 pt-6 px-4 border-2 rounded-md border-gray-200 print:break-inside-avoid" key={section.id}>
                    <legend className="font-semibold flex items-center gap-2">
                        <SectionIndicator sectionTitle={section.title} />
                        {section.title}
                    </legend>
                    <div dangerouslySetInnerHTML={{ __html: chart }} />
                </fieldset>
            )
        })
    }

    return (
        <div className="pt-8 p-4">
            <div className="sticky print:relative top-0 z-20 left-0 w-full bg-white mb-4">
                <div className={`grid grid-cols-[60px_1fr] items-center gap-4 w-full py-2 `}>
                    <div>
                        {
                            image ? <Image
                                containerClassName="w-16 h-16 overflow-hidden flex items-center"
                                className="w-full m-auto"
                                src={image}
                                alt={title}
                            /> : <div className="w-16 h-16 bg-gray-200 border-2 border-black rounded-full"></div>
                        }
                    </div>
                    <div className="overflow-hidden">
                        <h4 title={artist} className="text-sm truncate">{artist}</h4>
                        <h1 title={title} className="font-bold text-base sm:text-2xl uppercase">{title}</h1>
                        <div className="flex gap-2 w-full overflow-x-scroll py-1 items-center">
                            {
                                links && links.map(({ id, title, url }) => (
                                    <a className="px-4 min-w-fit py-1 rounded-full bg-gray-200 text-xs" key={id} href={url} rel="noreferrer" target="_blank">{title}</a>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="my-2 print:hidden">
                        <ModalButton buttonChildren={<HiOutlineAdjustments size={24} />}>
                            <fieldset className="mb-4 flex flex-col gap-3 py-2 p-2 border rounded-md border-gray-200">
                                <legend className="font-semibold text-center text-sm">Configurar vista</legend>
                                <div className="flex items-center justify-center gap-2">
                                    <Slider
                                        size="md"
                                        step={1}
                                        onChange={handleChangeSemitone}
                                        onChangeEnd={() => appendQueryString("semitone", semitone)}
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
                    <Button
                        className="flex items-center gap-2 print:hidden bg-black text-white font-semibold justify-center"
                        onPress={() => window.print()}>
                        <FaPrint size={16} />
                        <span className="hidden md:block">Imprimir</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 print:hidden bg-black text-white font-semibold justify-center"
                        onPress={() => htmlToPlainTextWithChords()}>
                        <TbFileTypeTxt size={18} />
                        <span className="hidden md:block">Descargat (.txt)</span>
                    </Button>
                </div>
            </div>
            {
                renderSections()
            }
        </div>
    )
}