"use client"

import { CHORDS } from "@/constants"
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete"
import { useEffect } from "react"


export default function Editor(props) {
    const Item = ({ entity: { name, char } }) => <div className="chordItem p-2 border-b">{name}</div>
    const { onChange, ...restProps } = props

    const handleChange = (event) => {
        onChange(event, props.dataindex)
    }

    return (
        <ReactTextareaAutocomplete
            {...restProps}
            onChange={handleChange}
            listClassName="dropdown w-[100px] max-h-[140px] overflow-y-auto shadow-lg border"
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
    )
}

/*
export default function Editor(props) {
    const searchInput = useInput("")
    const [showPopup, setShowPopup] = useState(false)

    const editor = useRef()
    const lastCursorPosition = useRef()
    const lastSelectionText = useRef("")
    const searchInputRef = useRef()

    const { onChange, ref, ...restProps } = props

    const handleKeyUp = (e) => {
        if (e.key === '[') {
            setShowPopup(true)
            const { value, selectionStart } = e.target
            const cursorPosition = selectionStart
            lastCursorPosition.current = cursorPosition
            lastSelectionText.current = [
                String(value).substring(0, cursorPosition),
                String(value).substring(cursorPosition)
            ]

            setTimeout(() => {
                searchInputRef.current.focus()
            }, 10)
        }
    }

    const handleChange = (event) => {
        onChange(event, props.dataindex)
    }

    const handleChangeValue = (event) => {
        onChange(event, props.dataindex)
        setTimeout(() => {
            const cursorPosition = event.target.selectionStart
            editor.current.focus()
            editor.current.setSelectionRange(cursorPosition, cursorPosition)
            searchInput.setValue("")
        }, 1)
    }

    const filterByChord = (chord) => {
        const query = String(searchInput.value).trim()
        return String(chord).includes(query)
    }

    const handleChordSelected = (chord) => {
        setShowPopup(false)

        const [beforeCursor, afterCursor] = lastSelectionText.current
        const newValue = `${beforeCursor}[${chord}]${afterCursor}`

        handleChangeValue({
            target: {
                value: newValue,
                name: props.name,
                selectionStart: (lastCursorPosition.current + 2) + chord.length,
                selectionEnd: (lastCursorPosition.current + 2) + chord.length
            }
        }, props.dataindex)

    }

    return (
        <div>
            <textarea
                {...restProps}
                ref={editor}
                onChange={handleChange}
                onKeyDown={handleKeyUp}
            ></textarea>
            {
                showPopup && (
                    <div className="z-40 fixed top-0 overflow-hidden left-0 w-full h-screen">
                        <div onClick={() => setShowPopup(false)} className="z-[-1] absolute top-0 overflow-hidden left-0 w-full h-full bg-black bg-opacity-15" />
                        <div className="bg-white rounded-xl mt-8 p-4 pt-0 max-w-sm max-h-[300px] overflow-y-auto w-[95%] mx-auto">
                            <div className="z-10 mb-2 py-4 sticky top-0 left-0 bg-white">
                                <input
                                    ref={searchInputRef}
                                    className="w-full"
                                    type="text"
                                    onChange={searchInput.onChange}
                                    value={searchInput.value}
                                    placeholder="Buscar acorde"
                                />
                            </div>
                            <div className="flex flex-col">
                                {
                                    CHORDS.flat().filter(filterByChord).slice(0, 10).map((chord) => (
                                        <div className="w-full border-b py-2" onClick={() => handleChordSelected(chord)} key={chord}>
                                            <p className="!m-0">{chord}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
*/