
import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';

interface AddProductFormProps {
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    existingProduct: Product | null;
    onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct, onUpdateProduct, existingProduct, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (existingProduct) {
            setName(existingProduct.name);
            setPrice(existingProduct.price.toString());
            setQuantity(existingProduct.quantity.toString());
            setDescription(existingProduct.description || '');
        } else {
            setName('');
            setPrice('');
            setQuantity('');
            setDescription('');
        }
    }, [existingProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
            description
        };

        if (existingProduct) {
            onUpdateProduct({ ...productData, id: existingProduct.id });
        } else {
            onAddProduct(productData);
        }
        
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nome do Produto</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700">Preço (R$)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"/>
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantidade</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required min="0" step="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"/>
                </div>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descrição (Opcional)</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">{existingProduct ? "Salvar Alterações" : "Adicionar Produto"}</button>
            </div>
        </form>
    );
};

export default AddProductForm;