// stores/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
  };
  seasonal?: boolean;
  customizationOptions?: {
    name: string;
    price: number;
  }[];
}

// Define the structure of a cart item
export interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  incrementQuantity: (itemId: number) => void;
  decrementQuantity: (itemId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => {
        const existingItemIndex = get().items.findIndex(
          (item) =>
            item.id === newItem.id &&
            JSON.stringify(item.selectedCustomizations) ===
              JSON.stringify(newItem.selectedCustomizations),
        );

        set((state) => {
          if (existingItemIndex > -1) {
            // If item exists, increase quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          // If item doesn't exist, add new item
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      clearCart: () => set({ items: [] }),

      incrementQuantity: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        })),

      decrementQuantity: (itemId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
);
