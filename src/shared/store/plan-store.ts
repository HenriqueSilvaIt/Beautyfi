import { create}  from "zustand";



interface PlanState {
  
    planId: number;
    setPlanId: (planId: number) => void;

}

export const usePlanStore = create<PlanState>((set) => ({
    planId: 0,
    setPlanId: (planId) => set({ planId }),
}));