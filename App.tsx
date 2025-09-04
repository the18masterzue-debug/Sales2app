
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Product, Sale, View } from './types';
import { ViewEnum } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { supabase } from './services/supabaseClient';
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
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [activeView, setActiveView] = useState<View>(ViewEnum.DASHBOARD);
    const [salesGoal, setSalesGoal] = useLocalStorage<number>('salesGoal', 1000);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saleProduct, setSaleProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('name', { ascending: true });
        if (productsData) setProducts(productsData);
        if (productsError) console.error('Error fetching products:', productsError);

        const { data: salesData, error: salesError } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
        if (salesData) setSales(salesData);
        if(salesError) console.error('Error fetching sales:', salesError);
        
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
        const { error } = await supabase.from('products').insert([product]);
        if (!error) {
            fetchData();
        } else {
            console.error('Error adding product:', error);
        }
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        const { id, created_at, ...updateData } = updatedProduct;
        const { error } = await supabase.from('products').update(updateData).eq('id', updatedProduct.id);
        if (!error) {
            fetchData();
        } else {
            console.error('Error updating product:', error);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    }
    
    const handleDeleteProduct = async (productId: number) => {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) {
          fetchData();
      } else {
          console.error('Error deleting product:', error);
      }
    }

    const openAddProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleRecordSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
        const product = products.find(p => p.id === sale.product_id);
        if (product && product.quantity >= sale.quantity_sold) {
            const { error: saleError } = await supabase.from('sales').insert([sale]);
            if (saleError) {
                console.error('Error recording sale:', saleError);
                return false;
            }

            const newQuantity = product.quantity - sale.quantity_sold;
            const { error: productError } = await supabase.from('products').update({ quantity: newQuantity }).eq('id', sale.product_id);
            
            if (productError) {
                console.error('Error updating product quantity:', productError);
                // Idealmente, a venda inserida seria revertida aqui (transação)
                return false;
            }

            fetchData();
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
        if (loading) {
            return <div className="text-center p-10 text-light">Carregando dados...</div>
        }
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