import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSetlistStore = create(
    persist(
        () => ({
            setlist: []
        }),
        {
            name: 'setlist-storage'
        }
    ),
)