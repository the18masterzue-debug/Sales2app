
import React from 'react';
import type { Sale, Product } from '../../types';

interface SaleListItemProps {
    sale: Sale;
    productName: string;
}

const SaleListItem: React.FC<SaleListItemProps> = ({ sale, productName }) => (
    <div className="bg-white p-3 rounded-lg shadow-md flex justify-between items-center">
        <div>
            <p className="font-bold text-secondary">{productName}</p>
            <p className="text-sm text-slate-500">{sale.quantitySold} unidade(s) &bull; {new Date(sale.date).toLocaleString('pt-BR')}</p>
        </div>
        <p className="font-semibold text-green-600">R$ {sale.totalPrice.toFixed(2)}</p>
    </div>
);

interface SalesHistoryProps {
    sales: Sale[];
    products: Product[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, products }) => {
    const getProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Produto Excluído';
    };

    return (
        <div className="space-y-3">
            {sales.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                    <p className="text-slate-500">Nenhuma venda registrada.</p>
                    <p className="text-sm text-slate-400 mt-2">Clique no botão '+' para registrar uma nova venda.</p>
                </div>
            ) : (
                sales.map(sale => (
                    <SaleListItem key={sale.id} sale={sale} productName={getProductName(sale.productId)} />
                ))
            )}
        </div>
    );
};

export default SalesHistory;
