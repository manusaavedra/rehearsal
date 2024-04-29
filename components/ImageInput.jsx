import useToggle from "@/hooks/useToggle"
import { Button } from "@nextui-org/react"

export default function ImageInput({ onChange, value, alt }) {
    const editable = useToggle(false)
    const image = value === "" ? "/icon512_rounded.png" : value

    return (
        <div className="mb-4 w-full">
            <div className="relative overflow-hidden w-32 h-32">
                {
                    image && (
                        <picture className="w-auto">
                            <img className="max-w-[120px]" src={image} alt={alt} />
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
                    <input type="url" name="image" placeholder="URL de la imagen" onChange={onChange} value={value} />
                )
            }
        </div>
    )
}