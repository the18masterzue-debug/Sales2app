import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';

interface RecordSaleFormProps {
    products: Product[];
    onRecordSale: (sale: { productId: string; quantitySold: number; totalPrice: number; }) => boolean;
    onClose: () => void;
    initialProduct: Product | null;
}

const RecordSaleForm: React.FC<RecordSaleFormProps> = ({ products, onRecordSale, onClose, initialProduct }) => {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    const availableProducts = products.filter(p => p.quantity > 0);
    const selectedProduct = products.find(p => p.id === productId);

    useEffect(() => {
        if (initialProduct) {
            setProductId(initialProduct.id);
        } else if(availableProducts.length > 0 && !productId) {
            setProductId(availableProducts[0].id)
        }
    }, [availableProducts, productId, initialProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedProduct) {
            setError('Produto inválido.');
            return;
        }

        if (quantity > selectedProduct.quantity) {
            setError(`Estoque insuficiente. Disponível: ${selectedProduct.quantity}`);
            return;
        }

        const success = onRecordSale({
            productId,
            quantitySold: quantity,
            totalPrice: selectedProduct.price * quantity,
        });
        
        if (success) {
            onClose();
        } else {
            setError('Falha ao registrar a venda.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="product" className="block text-sm font-medium text-slate-700">Produto</label>
                <select id="product" value={productId} onChange={e => setProductId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-slate-900">
                    {availableProducts.length === 0 ? (
                        <option disabled>Nenhum produto com estoque</option>
                    ) : (
                        availableProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Estoque: {p.quantity})</option>
                        ))
                    )}
                </select>
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantidade</label>
                <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} required min="1" max={selectedProduct?.quantity || 1} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"/>
            </div>

            {selectedProduct && (
                <div className="text-right font-bold text-lg text-secondary">
                    Total: R$ {(selectedProduct.price * (quantity || 0)).toFixed(2)}
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
                <button type="submit" disabled={!productId || availableProducts.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400">Registrar Venda</button>
            </div>
        </form>
    );
};

export default RecordSaleForm;