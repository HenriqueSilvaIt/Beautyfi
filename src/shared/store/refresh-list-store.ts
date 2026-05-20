import { create } from "zustand"


interface Loadings {
    initial: boolean,
    refresh: boolean,
    loadMore: boolean
}

interface HandleLoadingsParams {key: keyof Loadings,value: boolean}


export const useRefreshList = create<HandleLoadingsParams>((set, get) => ({

   key: "initial",
   value: false,

}))