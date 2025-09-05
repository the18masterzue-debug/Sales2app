import React, { useState } from 'react';
import type { Product } from '../../types';
import ProductsList from './ProductsList';
import { PlusIcon } from '../icons/Icons';

interface ConfiguracoesProps {
    currentGoal: number;
    onSave: (newGoal: number) => void;
    products: Product[];
    onAddProduct: () => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

const Configuracoes: React.FC<ConfiguracoesProps> = ({ currentGoal, onSave, products, onAddProduct, onEditProduct, onDeleteProduct }) => {
    const [goal, setGoal] = useState(currentGoal.toString());
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const newGoal = parseFloat(goal);
        if (!isNaN(newGoal) && newGoal >= 0) {
            onSave(newGoal);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000); // Mensagem de sucesso some após 2s
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-secondary">
                <h2 className="text-lg font-bold mb-4">Meta de Faturamento</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="salesGoal" className="block text-sm font-medium text-slate-700">
                            Valor Mensal (R$)
                        </label>
                        <input
                            type="number"
                            id="salesGoal"
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900"
                            placeholder="Ex: 5000.00"
                        />
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        {saved && <p className="text-sm text-green-600">Meta salva com sucesso!</p>}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Salvar Meta
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-secondary">Gerenciar Produtos</h2>
                     <button onClick={onAddProduct} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
                        <PlusIcon />
                        <span>Adicionar</span>
                    </button>
                </div>
                <ProductsList 
                    products={products} 
                    onEdit={onEditProduct} 
                    onDelete={onDeleteProduct} 
                />
            </div>
        </div>
    );
};

export default Configuracoes;