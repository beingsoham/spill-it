import { create } from 'zustand'

export const usePostModal = create((set) => ({
  isOpen: false,
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
}))
