"use client"

import { create } from 'zustand'
import io from 'socket.io-client'

const useSocketStore = create((set, get) => ({
    socket: null,
    users: [],
    initializeSocket: () => {
        const socket = io({
            autoConnect: false
        })

        if (get().socket === null) {
            socket.auth = {
                name: "Manuel Saavedra",
                rol: "Piano"
            }

            socket.connect()
            set({ socket })
        }

        socket.on("users", (users) => {
            const allUsers = users.filter((user) => user.id !== socket.id)
            set({ users: allUsers })
        })
    }
}))

export default useSocketStore
