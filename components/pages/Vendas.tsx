import React, { useMemo } from 'react';
import type { Product } from '../../types';

interface SaleProductCardProps {
    product: Product;
    onClick: () => void;
}

const SaleProductCard: React.FC<SaleProductCardProps> = ({ product, onClick }) => {
    const { stockColor, stockBgColor } = useMemo(() => {
        if (product.quantity <= 5) return { stockColor: 'text-red-700', stockBgColor: 'bg-red-100' };
        if (product.quantity <= 10) return { stockColor: 'text-amber-700', stockBgColor: 'bg-amber-100' };
        return { stockColor: 'text-green-700', stockBgColor: 'bg-green-100' };
    }, [product.quantity]);

    return (
        <button
            onClick={onClick}
            className="w-full bg-white text-secondary p-6 rounded-3xl shadow-lg text-left transition-transform transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-main-dark-green focus:ring-primary"
            aria-label={`Vender ${product.name}`}
        >
            <h3 className="font-bold text-2xl">{product.name}</h3>
            {product.description && <p className="text-sm text-slate-500 mt-1">{product.description}</p>}

            <div className="mt-4">
                <p className="text-4xl font-bold tracking-tight text-primary">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
                 <p className="text-sm font-medium text-slate-500 mt-1">Preço por unidade</p>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${stockColor} ${stockBgColor}`}>
                    {product.quantity} em estoque
                </span>
                <div className="text-sm font-medium text-primary flex items-center gap-1.5" aria-hidden="true">
                    Vender
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
            </div>
        </button>
    );
};

interface VendasProps {
    products: Product[];
    onInitiateSale: (product: Product) => void;
}

const Vendas: React.FC<VendasProps> = ({ products, onInitiateSale }) => {
    const availableProducts = products.filter(p => p.quantity > 0);

    return (
         <div>
            {availableProducts.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md text-secondary">
                    <p className="text-slate-500">Nenhum produto com estoque disponível para venda.</p>
                     <p className="text-sm text-slate-400 mt-2">Cadastre novos produtos ou atualize o estoque na aba 'Produtos'.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {availableProducts.sort((a,b) => a.name.localeCompare(b.name)).map(product => (
                        <SaleProductCard 
                            key={product.id} 
                            product={product} 
                            onClick={() => onInitiateSale(product)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Vendas;