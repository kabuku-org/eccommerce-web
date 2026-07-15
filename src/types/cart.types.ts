export type CartItem = {
    productId: string;
    quantity: number;
    price: number;
    name: string;
}

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}