"use client"

import { useState } from "react";

export default function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue)

    const toggle = () => setValue((prevState) => !prevState)

    const open = () => setValue(true)

    const close = () => setValue(false)

    return {
        value,
        close,
        open,
        toggle
    }
}