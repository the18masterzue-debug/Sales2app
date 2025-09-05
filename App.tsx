import React, { useState, useEffect } from 'react';
import type { Product, Sale, View } from './types';
import { ViewEnum } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './components/pages/Dashboard';
import Configuracoes from './components/pages/Configuracoes';
import Vendas from './components/pages/Vendas';
import Modal from './components/Modal';
import RecordSaleForm from './components/forms/RecordSaleForm';
import AddProductForm from './components/forms/AddProductForm';
import { supabase, supabaseError } from './services/supabaseClient';

const sampleProducts: Omit<Product, 'id' | 'created_at'>[] = [
    { name: 'Brigadeiro Gourmet', price: 4.50, quantity: 50, description: 'Clássico brigadeiro com chocolate belga.', image_url: 'https://placehold.co/400x300/EAD5BC/5C3D2E?text=Brigadeiro' },
    { name: 'Beijinho de Coco', price: 3.00, quantity: 35, description: 'Doce de coco cremoso e irresistível.', image_url: 'https://placehold.co/400x300/FFFFFF/5C3D2E?text=Beijinho' },
    { name: 'Bolo de Pote - Ninho com Nutella', price: 12.00, quantity: 15, description: 'Creme de Ninho com Nutella e massa fofinha.', image_url: 'https://placehold.co/400x300/FDF5E6/5C3D2E?text=Bolo+de+Pote' },
    { name: 'Cookie com Gotas de Chocolate', price: 7.00, quantity: 8, description: 'Cookie crocante por fora e macio por dentro.', image_url: 'https://placehold.co/400x300/D2B48C/5C3D2E?text=Cookie' },
    { name: 'Brownie Recheado', price: 10.00, quantity: 20, description: 'Brownie de chocolate com recheio de doce de leite.', image_url: 'https://placehold.co/400x300/8B4513/FFFFFF?text=Brownie' },
];


const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [salesGoal, setSalesGoal] = useState<number>(1000); // Will be replaced by DB value if available
    const [activeView, setActiveView] = useState<View>(ViewEnum.DASHBOARD);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) return;

        const fetchData = async () => {
            setLoading(true);

            // Fetch products and seed if necessary
            const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('name', { ascending: true });
            
            if (productsError) {
                console.error("Error fetching products:", productsError);
            } else if (productsData.length === 0) {
                // Seed database with sample products if it's empty
                const { error: seedError } = await supabase.from('products').insert(sampleProducts);
                if (seedError) {
                    console.error("Error seeding products:", seedError);
                } else {
                    // Refetch after seeding
                    const { data: newProducts } = await supabase.from('products').select('*').order('name', { ascending: true });
                    setProducts(newProducts || []);
                }
            } else {
                setProducts(productsData);
            }

            // Fetch sales
            const { data: salesData, error: salesError } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
            if (salesError) console.error("Error fetching sales:", salesError);
            else setSales(salesData || []);
            
            setLoading(false);
        };

        fetchData();
    }, []);
    
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

    const handleRecordSale = async (saleData: { product_id: number; quantity_sold: number; total_price: number; }) => {
        if (!supabase) return false;
        const productSold = products.find(p => p.id === saleData.product_id);
        if (!productSold || productSold.quantity < saleData.quantity_sold) {
            console.error("Estoque insuficiente ou produto não encontrado.");
            return false;
        }

        // 1. Update product quantity in DB
        const newQuantity = productSold.quantity - saleData.quantity_sold;
        const { error: updateError } = await supabase
            .from('products')
            .update({ quantity: newQuantity })
            .eq('id', saleData.product_id);
        
        if (updateError) {
            console.error("Error updating product quantity:", updateError);
            return false;
        }

        // 2. Insert new sale record
        const { data: newSale, error: insertError } = await supabase
            .from('sales')
            .insert(saleData)
            .select()
            .single();
            
        if (insertError) {
            console.error("Error inserting sale:", insertError);
            // TODO: Revert product quantity update?
            return false;
        }
        
        // 3. Update state
        setProducts(products.map(p => p.id === saleData.product_id ? { ...p, quantity: newQuantity } : p));
        setSales([newSale, ...sales]);
        
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

    const handleAddProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
        if (!supabase) return;
        const { data: newProduct, error } = await supabase.from('products').insert(productData).select().single();
        if (error) console.error("Error adding product:", error);
        else setProducts([...products, newProduct].sort((a,b) => a.name.localeCompare(b.name)));
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        if (!supabase) return;
        const { id, ...updateData } = updatedProduct;
        const { data: newProduct, error } = await supabase.from('products').update(updateData).eq('id', id).select().single();
        if (error) console.error("Error updating product:", error);
        else setProducts(products.map(p => p.id === id ? newProduct : p));
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!supabase) return;
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) console.error("Error deleting product:", error);
        else setProducts(products.filter(p => p.id !== productId));
    };

    if (supabaseError) {
        return (
            <div className="min-h-screen bg-red-50 flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-2xl font-bold text-red-800">Erro de Conexão</h2>
                <p className="text-red-600 mt-2">{supabaseError}</p>
                <p className="text-slate-500 mt-4 text-sm">Por favor, verifique a configuração no seu serviço de hospedagem (ex: Netlify) e atualize a página.</p>
            </div>
        );
    }

    const renderView = () => {
        if(loading) {
            return <div className="text-center p-10">Carregando dados...</div>
        }
        switch (activeView) {
            case ViewEnum.DASHBOARD:
                return <Dashboard products={products} sales={sales} salesGoal={salesGoal} />;
            case ViewEnum.VENDAS:
                return <Vendas products={products} onInitiateSale={handleInitiateSale} />;
            case ViewEnum.CONFIGURACOES:
                return <Configuracoes 
                            currentGoal={salesGoal} 
                            onSave={setSalesGoal} // TODO: Persist goal in DB
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