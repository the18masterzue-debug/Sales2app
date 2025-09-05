import React, { useMemo } from 'react';
import type { Product, Sale } from '../../types';
import { ArrowUpIcon } from '../icons/Icons';

interface DashboardProps {
    products: Product[];
    sales: Sale[];
    salesGoal: number;
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales, salesGoal }) => {

    const totalRevenue = useMemo(() =>
        sales.reduce((acc, sale) => acc + sale.total_price, 0),
        [sales]
    );

    const lowStockItems = useMemo(() =>
        products.filter(p => p.quantity <= 5).length,
        [products]
    );

    const goalProgressPercentage = useMemo(() => {
        if (salesGoal <= 0) return 0;
        return Math.min((totalRevenue / salesGoal) * 100, 100);
    }, [totalRevenue, salesGoal]);

    return (
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
            {/* Card de Receita Total */}
            <div className="w-80 flex-shrink-0 bg-lime-card text-black p-6 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center text-sm font-medium">
                    <div className="bg-black text-white rounded-full p-2">
                        <ArrowUpIcon className="w-4 h-4" />
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-5xl font-bold tracking-tight">
                        R$ {totalRevenue.toFixed(2).replace('.',',')}
                    </p>
                    <p className="text-sm font-medium mt-1">Receita Total</p>
                </div>
            </div>

            {/* Card de Meta Mensal */}
            <div className="w-80 flex-shrink-0 bg-white text-black p-6 rounded-3xl shadow-lg">
                <p className="text-sm font-medium text-slate-600">Meta Mensal</p>
                <div className="mt-2">
                    <span className="text-4xl font-bold">R$ {totalRevenue.toFixed(2).replace('.',',')}</span>
                    <span className="text-lg text-slate-500"> / R$ {salesGoal.toFixed(2).replace('.',',')}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                  <div className="bg-teal-pill h-2.5 rounded-full" style={{ width: `${goalProgressPercentage}%` }}></div>
                </div>
                 <p className="text-right text-sm font-medium mt-1 text-slate-600">{goalProgressPercentage.toFixed(0)}%</p>
            </div>

            {/* Card de Estoque Baixo */}
            <div className="w-80 flex-shrink-0 bg-purple-card text-white p-6 rounded-3xl shadow-lg">
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