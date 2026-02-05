export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean | null;
  is_admin: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ItemForm {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export interface AddressForm {
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: string;
  total_amount: number;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  created_at: string;
  items: OrderItem[];
}
