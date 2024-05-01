import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSetlistStore = create(
    persist(
        (set) => ({
            setlist: [],
            updateSetlist: (setlist) => {
                set({ setlist })
            }
        }),
        {
            name: 'setlist-storage'
        }
    ),
)