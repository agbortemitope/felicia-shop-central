import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const id = item.id || Math.random().toString(36).substr(2, 9);
        const existingItem = items.find(i => i.id === id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...item, id }] });
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'tech-store-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
