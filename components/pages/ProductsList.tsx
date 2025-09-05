import React, { useMemo } from 'react';
import type { Product } from '../../types';
import { EditIcon, TrashIcon, PackageIcon } from '../icons/Icons';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const { stockColor, stockBgColor } = useMemo(() => {
        if (product.quantity <= 5) return { stockColor: 'text-red-700', stockBgColor: 'bg-red-100' };
        if (product.quantity <= 10) return { stockColor: 'text-amber-700', stockBgColor: 'bg-amber-100' };
        return { stockColor: 'text-green-700', stockBgColor: 'bg-green-100' };
    }, [product.quantity]);

    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
            onDelete(product.id);
        }
    }

    return (
        <div className="bg-white text-secondary p-4 rounded-xl shadow-md flex gap-4 items-center">
            <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <PackageIcon />
                )}
            </div>
            <div className="flex-grow flex flex-col justify-between h-24">
                 <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <span className="font-bold text-primary text-lg whitespace-nowrap">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{product.description || 'Sem descrição'}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className={`font-semibold px-2.5 py-1 rounded-full text-xs ${stockColor} ${stockBgColor}`}>
                        {product.quantity} em estoque
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(product)} className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors" aria-label={`Editar ${product.name}`}>
                            <EditIcon />
                        </button>
                        <button onClick={handleDelete} className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label={`Excluir ${product.name}`}>
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface ProductsListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: number) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onEdit, onDelete }) => {
    return (
        <div>
            {products.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md text-secondary">
                    <p className="text-slate-500">Nenhum produto cadastrado.</p>
                    <p className="text-sm text-slate-400 mt-2">Clique no botão 'Adicionar' para cadastrar seu primeiro produto.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsList;