import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/stores/cartStore";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  total: number;
  status:
    | "Preparing"
    | "Brewing"
    | "Quality Check"
    | "Ready for Pickup"
    | "Completed";
  paymentMethod: string;
  orderDate: string;
  estimatedPickupTime?: string;
  loyaltyPointsApplied?: boolean;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  createOrder: (orderData: Omit<Order, "id" | "orderDate">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  clearCurrentOrder: () => void;
  availableLoyaltyPoints: number;
  setLoyaltyPoints: (points: number) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrder: null,
      orderHistory: [],

      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD${Date.now()}`,
          orderDate: new Date().toISOString(),
        };

        set((state) => ({
          currentOrder: newOrder,
          orderHistory: [...state.orderHistory, newOrder],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          currentOrder:
            state.currentOrder?.id === orderId
              ? { ...state.currentOrder, status }
              : state.currentOrder,
          orderHistory: state.orderHistory.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }));
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      availableLoyaltyPoints: 150,
      setLoyaltyPoints: (points) => set({ availableLoyaltyPoints: points }),
    }),
    {
      name: "order-storage",
    },
  ),
);
