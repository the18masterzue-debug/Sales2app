import React, { useState } from 'react';
import type { Product, Sale, View } from './types';
import { ViewEnum } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import Dashboard from './components/pages/Dashboard';
import Configuracoes from './components/pages/Configuracoes';
import Vendas from './components/pages/Vendas';
import Modal from './components/Modal';
import RecordSaleForm from './components/forms/RecordSaleForm';
import AddProductForm from './components/forms/AddProductForm';

const sampleProducts: Product[] = [
    { id: '1', name: 'Brigadeiro Gourmet', price: 4.50, quantity: 50, description: 'Clássico brigadeiro com chocolate belga.', imageUrl: 'https://placehold.co/400x300/EAD5BC/5C3D2E?text=Brigadeiro' },
    { id: '2', name: 'Beijinho de Coco', price: 3.00, quantity: 35, description: 'Doce de coco cremoso e irresistível.', imageUrl: 'https://placehold.co/400x300/FFFFFF/5C3D2E?text=Beijinho' },
    { id: '3', name: 'Bolo de Pote - Ninho com Nutella', price: 12.00, quantity: 15, description: 'Creme de Ninho com Nutella e massa fofinha.', imageUrl: 'https://placehold.co/400x300/FDF5E6/5C3D2E?text=Bolo+de+Pote' },
    { id: '4', name: 'Cookie com Gotas de Chocolate', price: 7.00, quantity: 8, description: 'Cookie crocante por fora e macio por dentro.', imageUrl: 'https://placehold.co/400x300/D2B48C/5C3D2E?text=Cookie' },
    { id: '5', name: 'Brownie Recheado', price: 10.00, quantity: 20, description: 'Brownie de chocolate com recheio de doce de leite.', imageUrl: 'https://placehold.co/400x300/8B4513/FFFFFF?text=Brownie' },
];


const App: React.FC = () => {
    const [products, setProducts] = useLocalStorage<Product[]>('products', sampleProducts);
    const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
    const [activeView, setActiveView] = useState<View>(ViewEnum.DASHBOARD);
    const [salesGoal, setSalesGoal] = useLocalStorage<number>('salesGoal', 1000);
    
    // State for sales modal
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [selectedProductForSale, setSelectedProductForSale] = useState<Product | null>(null);

    // State for product add/edit modal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
    
    const handleInitiateSale = (product: Product) => {
        setSelectedProductForSale(product);
        setIsSaleModalOpen(true);
    };

    const handleCloseSaleModal = () => {
        setIsSaleModalOpen(false);
        setSelectedProductForSale(null);
    };

    const handleRecordSale = (saleData: { productId: string; quantitySold: number; totalPrice: number; }) => {
        const productSold = products.find(p => p.id === saleData.productId);
        if (!productSold || productSold.quantity < saleData.quantitySold) {
            console.error("Estoque insuficiente ou produto não encontrado.");
            return false;
        }

        const newSale: Sale = {
            id: new Date().toISOString(),
            ...saleData,
            date: new Date().toISOString()
        };

        const updatedProducts = products.map(p =>
            p.id === saleData.productId
                ? { ...p, quantity: p.quantity - saleData.quantitySold }
                : p
        );

        setSales(prevSales => [newSale, ...prevSales]);
        setProducts(updatedProducts);
        return true;
    };

    // Product CRUD handlers
    const handleOpenProductModal = (product: Product | null = null) => {
        setSelectedProductForEdit(product);
        setIsProductModalOpen(true);
    };
    
    const handleCloseProductModal = () => {
        setSelectedProductForEdit(null);
        setIsProductModalOpen(false);
    };

    const handleAddProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            id: new Date().toISOString(),
            ...productData
        };
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prevProducts =>
            prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
    };

    const handleDeleteProduct = (productId: string) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    };


    const renderView = () => {
        switch (activeView) {
            case ViewEnum.DASHBOARD:
                return <Dashboard products={products} sales={sales} salesGoal={salesGoal} />;
            case ViewEnum.VENDAS:
                return <Vendas products={products} onInitiateSale={handleInitiateSale} />;
            case ViewEnum.CONFIGURACOES:
                return <Configuracoes 
                            currentGoal={salesGoal} 
                            onSave={setSalesGoal}
                            products={products}
                            onAddProduct={() => handleOpenProductModal(null)}
                            onEditProduct={handleOpenProductModal}
                            onDeleteProduct={handleDeleteProduct}
                        />;
            default:
                return <Dashboard products={products} sales={sales} salesGoal={salesGoal} />;
        }
    };
    
    return (
        <div className="min-h-screen font-sans bg-bg-pastel text-secondary pb-20">
            <header className="bg-bg-pastel text-secondary p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-center capitalize">{activeView.replace('_', ' ')}</h1>
            </header>
            
            <main className="p-4">
                {renderView()}
            </main>

            <Modal isOpen={isSaleModalOpen} onClose={handleCloseSaleModal} title="Registrar Venda">
                <RecordSaleForm 
                    products={products}
                    onRecordSale={handleRecordSale}
                    onClose={handleCloseSaleModal}
                    initialProduct={selectedProductForSale}
                />
            </Modal>

            <Modal isOpen={isProductModalOpen} onClose={handleCloseProductModal} title={selectedProductForEdit ? "Editar Produto" : "Adicionar Produto"}>
                <AddProductForm
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    existingProduct={selectedProductForEdit}
                    onClose={handleCloseProductModal}
                />
            </Modal>
            
            <BottomNav activeView={activeView} setActiveView={setActiveView} />
        </div>
    );
};

export default App;