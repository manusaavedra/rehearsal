import useToggle from "@/hooks/useToggle"
import { Button } from "@nextui-org/react"

export default function ImageInput({ onChange, value, alt }) {
    const editable = useToggle(false)
    const image = value === "" ? "/icon512_rounded.png" : value

    return (
        <div className="mb-4 w-full">
            <div className="relative max-w-32 h-32">
                {
                    image && (
                        <picture className="max-w-[120px]">
                            <img src={image} alt={alt} />
                        </picture>
                    )
                }
                <Button className="absolute bottom-2 right-2" onPress={editable.toggle}>
                    {
                        editable.value ? "Guardar" : "Editar"
                    }
                </Button>
            </div>
            {
                editable.value && (
                    <input type="text" name="image" placeholder="thumbnail, cover, image" onChange={onChange} value={value} />
                )
            }
        </div>
    )
}