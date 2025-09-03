
import React, { useMemo } from 'react';
import type { Product, Sale } from '../../types';

interface DashboardProps {
    products: Product[];
    sales: Sale[];
}

const DashboardMetric: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${color}`}>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="text-2xl font-bold text-secondary mt-1">{value}</p>
    </div>
);

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
        <div className="grid grid-cols-2 gap-4">
            <DashboardMetric 
                title="Receita Total" 
                value={`R$ ${totalRevenue.toFixed(2)}`} 
                color="border-blue-500"
            />
            <DashboardMetric 
                title="Itens Vendidos" 
                value={totalProductsSold} 
                color="border-green-500"
            />
            <DashboardMetric 
                title="Tipos de Produto" 
                value={products.length} 
                color="border-purple-500"
            />
            <DashboardMetric 
                title="Estoque Baixo" 
                value={lowStockItems} 
                color="border-red-500"
            />
        </div>
    );
};

export default Dashboard;
