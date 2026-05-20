import { create } from "zustand";

type SubscriberState = {
  subscriberId?: string;
  setSubscriberId: (subscriberId?: string) => void;
};

export const useSubscriberStore = create<SubscriberState>((set) => {
  return {
    subscriberId: undefined,
    setSubscriberId: (data?: string) => set({ subscriberId: data }),
  };
});
