import React from 'react';
import type { View } from '../types';
import { ViewEnum } from '../types';
import { HomeIcon, PackageIcon, HistoryIcon, ShoppingCartIcon, SettingsIcon } from './icons/Icons';

interface BottomNavProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'text-primary';
    const inactiveClasses = 'text-slate-500';
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
            {icon}
            <span className={`text-xs font-medium capitalize ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] h-16 grid grid-cols-5 z-20">
            <NavItem
                icon={<HomeIcon />}
                label={ViewEnum.DASHBOARD}
                isActive={activeView === ViewEnum.DASHBOARD}
                onClick={() => setActiveView(ViewEnum.DASHBOARD)}
            />
             <NavItem
                icon={<ShoppingCartIcon />}
                label={ViewEnum.VENDAS}
                isActive={activeView === ViewEnum.VENDAS}
                onClick={() => setActiveView(ViewEnum.VENDAS)}
            />
            <NavItem
                icon={<PackageIcon />}
                label={ViewEnum.PRODUCTS}
                isActive={activeView === ViewEnum.PRODUCTS}
                onClick={() => setActiveView(ViewEnum.PRODUCTS)}
            />
            <NavItem
                icon={<HistoryIcon />}
                label={ViewEnum.HISTORY}
                isActive={activeView === ViewEnum.HISTORY}
                onClick={() => setActiveView(ViewEnum.HISTORY)}
            />
             <NavItem
                icon={<SettingsIcon />}
                label={ViewEnum.CONFIGURACOES}
                isActive={activeView === ViewEnum.CONFIGURACOES}
                onClick={() => setActiveView(ViewEnum.CONFIGURACOES)}
            />
        </nav>
    );
};

export default BottomNav;