import React, { useState, useCallback, useMemo } from 'react';
import type { Product, Sale, View } from './types';
import { ViewEnum } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import Dashboard from './components/pages/Dashboard';
import ProductsList from './components/pages/ProductsList';
import SalesHistory from './components/pages/SalesHistory';
import Vendas from './components/pages/Vendas';
import Configuracoes from './components/pages/Configuracoes';
import Modal from './components/Modal';
import AddProductForm from './components/forms/AddProductForm';
import RecordSaleForm from './components/forms/RecordSaleForm';
import { PlusIcon } from './components/icons/Icons';


const App: React.FC = () => {
    const [products, setProducts] = useLocalStorage<Product[]>('products', []);
    const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
    const [activeView, setActiveView] = useState<View>(ViewEnum.DASHBOARD);
    const [salesGoal, setSalesGoal] = useLocalStorage<number>('salesGoal', 1000);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saleProduct, setSaleProduct] = useState<Product | null>(null);

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    }
    
    const handleDeleteProduct = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }

    const openAddProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleRecordSale = (sale: Omit<Sale, 'id' | 'date'>) => {
        const product = products.find(p => p.id === sale.productId);
        if (product && product.quantity >= sale.quantitySold) {
            const newSale: Sale = { ...sale, id: Date.now().toString(), date: new Date().toISOString() };
            setSales(prev => [newSale, ...prev]);
            setProducts(prev => prev.map(p =>
                p.id === sale.productId ? { ...p, quantity: p.quantity - sale.quantitySold } : p
            ));
            return true;
        }
        return false;
    };
    
    const handleInitiateSale = (product: Product) => {
        setSaleProduct(product);
        setIsSaleModalOpen(true);
    };
    
    const handleCloseSaleModal = () => {
        setIsSaleModalOpen(false);
        setSaleProduct(null);
    };

    const renderView = () => {
        switch (activeView) {
            case ViewEnum.DASHBOARD:
                return <Dashboard products={products} sales={sales} salesGoal={salesGoal} />;
            case ViewEnum.VENDAS:
                return <Vendas products={products} onInitiateSale={handleInitiateSale} />;
            case ViewEnum.PRODUCTS:
                return <ProductsList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct}/>;
            case ViewEnum.HISTORY:
                return <SalesHistory sales={sales} products={products} />;
            case ViewEnum.CONFIGURACOES:
                return <Configuracoes currentGoal={salesGoal} onSave={setSalesGoal} />;
            default:
                return <Dashboard products={products} sales={sales} salesGoal={salesGoal} />;
        }
    };
    
    const FABs: React.FC = () => {
       if (activeView === ViewEnum.PRODUCTS) {
          return (
            <button onClick={openAddProductModal} className="fixed bottom-20 right-5 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110">
                <PlusIcon />
            </button>
          )
       }
       // O botão de adicionar venda foi movido para a própria tela de Vendas (clicando no card)
       return null;
    }

    return (
        <div className="min-h-screen font-sans bg-main-dark-green text-light pb-20">
            <header className="bg-main-dark-green text-light p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-center capitalize">{activeView.replace('_', ' ')}</h1>
            </header>
            
            <main className="p-4">
                {renderView()}
            </main>
            
            <FABs />

            <BottomNav activeView={activeView} setActiveView={setActiveView} />

            <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? "Editar Produto" : "Adicionar Produto"}>
                <AddProductForm 
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    existingProduct={editingProduct}
                    onClose={() => setIsProductModalOpen(false)} 
                />
            </Modal>

            <Modal isOpen={isSaleModalOpen} onClose={handleCloseSaleModal} title="Registrar Venda">
                <RecordSaleForm 
                    products={products}
                    onRecordSale={handleRecordSale}
                    onClose={handleCloseSaleModal}
                    initialProduct={saleProduct}
                />
            </Modal>

        </div>
    );
};

export default App;