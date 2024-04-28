export default function Image(props) {
    const { src, alt, containerClassName, ...allProps } = props
    const source = src ? src : "/icon512_rounded.png"

    return (
        <picture className={containerClassName}>
            <img {...allProps} src={source} alt={alt} />
        </picture>
    )
}