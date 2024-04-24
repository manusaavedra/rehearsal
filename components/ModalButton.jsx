import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react"

export default function ModalButton({ buttonChildren, children }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <>
            <Button className="w-10 h-10 rounded-full" isOnlyIcon onPress={onOpen}>
                {buttonChildren}
            </Button>
            <Modal placement="top-center" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="p-4 pt-10">
                    {(onClose) => (
                        <div>
                            {children}
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
