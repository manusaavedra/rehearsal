"use client"

import { CHORDS } from "@/constants"
import { Button } from "@nextui-org/react"
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete"
import { useRef } from "react"
import { TbBracketsContainStart } from "react-icons/tb";

export default function Editor(props) {
    const { onChange, ref, ...restProps } = props
    const editor = useRef()

    const Item = ({ entity: { name, _ } }) => {
        return (
            <div className="chordItem p-2 border-b">{name}</div>
        )
    }

    const handleChange = (event) => {
        onChange(event, props.dataindex)
    }

    const setTextEditor = (textToInsert) => {
        const textarea = editor.current

        if (!textarea) {
            console.error("Textarea not found")
            return
        }

        const selectionStart = textarea.selectionStart
        const selectionEnd = textarea.selectionEnd
        const currentValue = textarea.value

        const newValue =
            currentValue.substring(0, selectionStart)
            + textToInsert + currentValue.substring(selectionEnd)

        handleChange({ target: { name: "content", value: newValue } })

        const newCursorPosition = selectionStart + textToInsert.length
        textarea.focus()
        setTimeout(() => {
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0)
    }

    return (
        <section className="relative">
            <ReactTextareaAutocomplete
                {...restProps}
                innerRef={(textarea) => editor.current = textarea}
                onChange={handleChange}
                listClassName="bg-white dropdown w-[100px] max-h-[140px] overflow-y-auto shadow-lg border"
                movePopupAsYouType={true}
                loadingComponent={() => <span>Loading</span>}
                trigger={{
                    "[": {
                        dataProvider: token => {
                            return CHORDS.flat()
                                .sort((a, b) => a - b)
                                .map((chord) => {
                                    return { name: chord, char: `[${chord}]` }
                                })
                                .filter((chord) => String(chord.name).includes(token))
                                .slice(0, 10)

                        },
                        component: Item,
                        afterWhitespace: false,
                        allowWhitespace: false,
                        output: (item, _) => item.char
                    }
                }}
            />
            <div className="absolute bottom-4 right-2 flex items-center gap-2">
                <Button
                    className="w-6 h-6 p-0 font-semibold rounded-full grid place-items-center"
                    onPress={() => setTextEditor("[")}
                    isIconOnly
                >
                    {'['}
                </Button>
                <Button
                    className="w-6 h-6 p-0 font-semibold rounded-full grid place-items-center"
                    onPress={() => setTextEditor("{")}
                    isIconOnly
                >
                    {'{'}
                </Button>
                <Button
                    className="w-6 h-6 p-0 font-semibold rounded-full grid place-items-center"
                    onPress={() => setTextEditor("}")}
                    isIconOnly
                >
                    {'}'}
                </Button>
            </div>
        </section>
    )
}