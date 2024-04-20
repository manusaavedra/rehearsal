import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react"
import { HiOutlineAdjustments } from "react-icons/hi";

export default function ModalButton({ children }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <>
            <Button className="w-10 h-10 rounded-full" isOnlyIcon onPress={onOpen}>
                <HiOutlineAdjustments size={24} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="p-4">
                    {(onClose) => (
                        <>
                            {children}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
