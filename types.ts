export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantitySold: number;
  totalPrice: number;
  date: string;
}

export enum ViewEnum {
    DASHBOARD = 'dashboard',
    VENDAS = 'vendas',
    PRODUCTS = 'produtos',
    HISTORY = 'histórico',
    CONFIGURACOES = 'configurações'
}

export type View = ViewEnum;