import React from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const stockColor = product.quantity <= 5 ? 'text-red-500' : product.quantity <= 10 ? 'text-amber-500' : 'text-green-600';

    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
            onDelete(product.id);
        }
    }

    return (
        <div className="bg-white text-secondary p-3 rounded-lg shadow-md flex flex-col justify-between space-y-2">
            <div className="flex-grow">
              <h3 className="font-bold text-base">{product.name}</h3>
              <p className="text-sm text-slate-500 break-words">{product.description || 'Sem descrição'}</p>
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
                <span className="font-semibold text-primary text-base">R$ {product.price.toFixed(2)}</span>
                <span className={`font-semibold ${stockColor}`}>Estoque: {product.quantity}</span>
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => onEdit(product)} className="w-full bg-slate-200 text-slate-800 py-1.5 px-3 rounded text-sm hover:bg-slate-300 transition-colors">
                    Editar
                </button>
                <button onClick={handleDelete} className="w-full bg-red-100 text-red-700 py-1.5 px-3 rounded text-sm hover:bg-red-200 transition-colors">
                    Excluir
                </button>
            </div>
        </div>
    );
};


interface ProductsListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onEdit, onDelete }) => {
    return (
        <div>
            {products.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                    <p className="text-slate-500">Nenhum produto cadastrado.</p>
                    <p className="text-sm text-slate-400 mt-2">Clique no botão '+' para adicionar seu primeiro produto.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsList;