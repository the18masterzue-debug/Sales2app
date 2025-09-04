
import React from 'react';
import type { Sale, Product } from '../../types';

interface SaleListItemProps {
    sale: Sale;
    productName: string;
}

const SaleListItem: React.FC<SaleListItemProps> = ({ sale, productName }) => (
    <div className="bg-white text-secondary p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg">{productName}</p>
                <p className="text-sm text-slate-500 mt-1">
                    {sale.quantity_sold} {sale.quantity_sold > 1 ? 'unidades' : 'unidade'}
                </p>
            </div>
            <p className="font-bold text-green-600 text-lg whitespace-nowrap">
                + R$ {sale.total_price.toFixed(2).replace('.', ',')}
            </p>
        </div>
        <div className="text-right text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
            {new Date(sale.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
    </div>
);


interface SalesHistoryProps {
    sales: Sale[];
    products: Product[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, products }) => {
    const getProductName = (product_id: number) => {
        return products.find(p => p.id === product_id)?.name || 'Produto Excluído';
    };

    return (
        <div className="space-y-3">
            {sales.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md text-secondary">
                    <p className="text-slate-500">Nenhuma venda registrada.</p>
                    <p className="text-sm text-slate-400 mt-2">Vá para a aba 'Vendas' para registrar uma nova venda.</p>
                </div>
            ) : (
                sales.map(sale => (
                    <SaleListItem key={sale.id} sale={sale} productName={getProductName(sale.product_id)} />
                ))
            )}
        </div>
    );
};

export default SalesHistory;