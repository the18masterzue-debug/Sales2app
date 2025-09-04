
import React, { useMemo } from 'react';
import type { Product, Sale } from '../../types';
import { ArrowUpIcon } from '../icons/Icons';

interface DashboardProps {
    products: Product[];
    sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {

    const totalRevenue = useMemo(() =>
        sales.reduce((acc, sale) => acc + sale.totalPrice, 0),
        [sales]
    );

    const totalProductsSold = useMemo(() =>
        sales.reduce((acc, sale) => acc + sale.quantitySold, 0),
        [sales]
    );

    const lowStockItems = useMemo(() =>
        products.filter(p => p.quantity <= 5).length,
        [products]
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Card de Saldo Atual */}
            <div className="bg-lime-card text-black p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center text-sm font-medium">
                    <div className="bg-black text-white rounded-full p-2">
                        <ArrowUpIcon className="w-4 h-4" />
                    </div>
                    <span>+3,51%</span>
                </div>
                <div className="mt-4">
                    <p className="text-5xl font-bold tracking-tight">
                        R$ {totalRevenue.toFixed(2).replace('.',',')}
                    </p>
                    <p className="text-sm font-medium mt-1">Receita Total</p>
                </div>
            </div>

            {/* Card de Progresso */}
            <div className="bg-white text-black p-6 rounded-3xl shadow-lg">
                <p className="text-sm font-medium text-slate-600">Progresso de Vendas</p>
                <div className="flex items-center mt-2">
                    <ArrowUpIcon className="w-10 h-10" />
                    <p className="text-6xl font-bold tracking-tighter">{totalProductsSold}</p>
                </div>
                 <div className="mt-4">
                    <span className="inline-block bg-teal-pill text-white text-xs font-semibold px-3 py-1 rounded-full">
                        +{products.length} tipos de produtos
                    </span>
                </div>
            </div>

            {/* Card de Estoque Baixo */}
            <div className="bg-purple-card text-white p-6 rounded-3xl shadow-lg">
                <p className="text-xs font-semibold tracking-wide">ALERTA</p>
                <p className="text-sm font-medium mt-2">Estoque Baixo</p>
                <p className="text-6xl font-bold tracking-tight mt-1">{lowStockItems}</p>
                <p className="text-xs font-light mt-2">
                   {lowStockItems > 0 ? `${lowStockItems} ${lowStockItems === 1 ? 'item precisa' : 'itens precisam'} de reposição` : 'Nenhum item com estoque baixo'}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;