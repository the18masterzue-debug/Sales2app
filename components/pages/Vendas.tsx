import React from 'react';
import type { Product } from '../../types';

interface SaleProductCardProps {
    product: Product;
    onClick: () => void;
}

const SaleProductCard: React.FC<SaleProductCardProps> = ({ product, onClick }) => {
    const stockColor = product.quantity <= 5 ? 'text-red-500' : product.quantity <= 10 ? 'text-amber-500' : 'text-green-600';
    return (
        <button onClick={onClick} className="bg-white text-secondary p-3 rounded-lg shadow-md flex flex-col justify-between text-left h-full">
            <div>
                <h3 className="font-bold text-base leading-tight">{product.name}</h3>
                <p className={`text-xs font-semibold ${stockColor} mt-1`}>
                    {product.quantity} em estoque
                </p>
            </div>
            <p className="font-bold text-primary text-right mt-2 text-lg">
                R$ {product.price.toFixed(2)}
            </p>
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
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                    <p className="text-slate-500">Nenhum produto com estoque disponível para venda.</p>
                     <p className="text-sm text-slate-400 mt-2">Cadastre novos produtos ou atualize o estoque na aba 'Produtos'.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {availableProducts.map(product => (
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