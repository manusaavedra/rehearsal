export function SectionIndicator({ sectionTitle }) {
    const getLetter = (text) => {
        const words = String(text).split(" ")

        if (words.length > 1) {
            return words.map((word) => word.substring(0, 1))
        }

        return words[0].substring(0, 1)
    }

    return (
        <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center">
            <span className="text-sm text-white font-semibold">{getLetter(sectionTitle)}</span>
        </div>
    )
}