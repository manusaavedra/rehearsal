import { useState } from "react"

export default function FetchButton({ onClick, className, children }) {
    const [loading, setLoading] = useState(false)

    const handleClick = async (e) => {
        setLoading(true)
        await onClick(e)
        setLoading(false)
    }

    return (
        <button onClick={handleClick} disabled={loading} className={className}>
            {children} {loading ? '...' : ''}
        </button>
    )
}