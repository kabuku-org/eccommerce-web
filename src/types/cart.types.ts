export type CartItem = {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
}

export type Cart = {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
}