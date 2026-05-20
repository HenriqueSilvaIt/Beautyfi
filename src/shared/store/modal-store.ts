import { ReactNode } from "react";
import { create } from "zustand";


interface ModalConfig {
    animationType?: "none" | "slide" | "fade";
    transparent?: boolean;
    statusBarTranslucent?: boolean;
}

interface ModalStore {

    isOpen: boolean; /*Informar se o modal está aberto ou não */
    content: ReactNode | null /*Contéudo renderizado dentro do modal */
    config?: ModalConfig;
    open: (content: ReactNode, config?: ModalConfig) => void; /*recebe o conteúdo
    e a config */
    close: () => void;
}


export const useModalStore = create<ModalStore>((set, get) => ({
    isOpen: false,
    content: null,
    config: {
        animationType: "fade",
        transparent: true,
        statusbarTranslucent: false,
    },
    open: (content: ReactNode, config?: ModalConfig) => set({
        content,
        config: {
            ...get().config,
            ...config,
        },
         isOpen: true,

    }),
    close: () => set({
        content: null,
        isOpen: false
    })
}))