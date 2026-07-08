import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface NotificationStore {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "date" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notification) => {
        set((state) => {
          // Prevent duplicates
          if (state.notifications.some((n) => n.id === notification.id)) {
            return state;
          }
          const newItem: NotificationItem = {
            ...notification,
            date: new Date().toISOString(),
            read: false,
          };
          return {
            notifications: [newItem, ...state.notifications],
          };
        });
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "beautyfi-notifications",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
