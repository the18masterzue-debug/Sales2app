export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Sale {
  id: number;
  product_id: number;
  quantity_sold: number;
  total_price: number;
  created_at: string;
}

export enum ViewEnum {
    DASHBOARD = 'dashboard',
    VENDAS = 'vendas',
    CONFIGURACOES = 'configurações'
}

export type View = ViewEnum;