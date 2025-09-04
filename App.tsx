
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Product, Sale, View } from './types';
import { ViewEnum } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import Dashboard from './components/pages/Dashboard';
import ProductsList from './components/pages/ProductsList';
import SalesHistory from './components/pages/SalesHistory';
import Modal from './components/Modal';
import AddProductForm from './components/forms/AddProductForm';
import RecordSaleForm from './components/forms/RecordSaleForm';
import { getSalesInsights } from './services/geminiService';
import { PlusIcon, SparklesIcon } from './components/icons/Icons';


const App: React.FC = () => {
    const [products, setProducts] = useLocalStorage<Product[]>('products', []);
    const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
    const [activeView, setActiveView] = useState<View>(ViewEnum.DASHBOARD);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    const [insights, setInsights] = useState('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [errorInsights, setErrorInsights] = useState('');

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
    
    const fetchInsights = useCallback(async () => {
        if (!process.env.API_KEY) {
            setErrorInsights('A chave da API do Gemini não foi configurada. Por favor, configure a variável de ambiente API_KEY.');
            setIsInsightsModalOpen(true);
            return;
        }
        setIsLoadingInsights(true);
        setErrorInsights('');
        setInsights('');
        setIsInsightsModalOpen(true);
        try {
            const result = await getSalesInsights(products, sales);
            setInsights(result);
        } catch (error) {
            console.error(error);
            setErrorInsights('Falha ao obter insights. Verifique o console para mais detalhes.');
        } finally {
            setIsLoadingInsights(false);
        }
    }, [products, sales]);

    const renderView = () => {
        switch (activeView) {
            case ViewEnum.DASHBOARD:
                return <Dashboard products={products} sales={sales} />;
            case ViewEnum.PRODUCTS:
                return <ProductsList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct}/>;
            case ViewEnum.HISTORY:
                return <SalesHistory sales={sales} products={products} />;
            default:
                return <Dashboard products={products} sales={sales} />;
        }
    };
    
    const FABs: React.FC = () => {
       if (activeView === ViewEnum.DASHBOARD) {
          return (
            <button onClick={fetchInsights} className="fixed bottom-20 right-5 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-110">
                <SparklesIcon />
            </button>
          )
       }
       if (activeView === ViewEnum.PRODUCTS) {
          return (
            <button onClick={openAddProductModal} className="fixed bottom-20 right-5 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110">
                <PlusIcon />
            </button>
          )
       }
       if (activeView === ViewEnum.HISTORY) {
            return (
              <button onClick={() => setIsSaleModalOpen(true)} className="fixed bottom-20 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110">
                  <PlusIcon />
              </button>
            )
       }
       return null;
    }

    return (
        <div className="min-h-screen font-sans bg-main-dark-green text-light pb-16">
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

            <Modal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} title="Registrar Venda">
                <RecordSaleForm 
                    products={products}
                    onRecordSale={handleRecordSale}
                    onClose={() => setIsSaleModalOpen(false)} 
                />
            </Modal>
            
            <Modal isOpen={isInsightsModalOpen} onClose={() => setIsInsightsModalOpen(false)} title="Insights de Vendas com IA">
                {isLoadingInsights && <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-slate-600">Analisando dados... Isso pode levar um momento.</p>
                </div>}
                {errorInsights && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                    <p className="font-bold">Erro</p>
                    <p>{errorInsights}</p>
                </div>}
                {insights && <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap">{insights}</div>}
            </Modal>

        </div>
    );
};

export default App;