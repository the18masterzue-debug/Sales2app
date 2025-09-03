
import { GoogleGenAI } from '@google/genai';
import type { Product, Sale } from '../types';

export const getSalesInsights = async (products: Product[], sales: Sale[]): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const productDetails = products.map(p => `- ${p.name} (ID: ${p.id}): ${p.quantity} em estoque, Preço: R$${p.price.toFixed(2)}`).join('\n');
    const salesDetails = sales.map(s => {
        const product = products.find(p => p.id === s.productId);
        return `- Venda de ${s.quantitySold} unidade(s) de ${product ? product.name : `Produto ID ${s.productId}`} por R$${s.totalPrice.toFixed(2)} em ${new Date(s.date).toLocaleDateString('pt-BR')}`;
    }).join('\n');

    const prompt = `
      Você é um assistente de negócios especialista em análise de dados de vendas para pequenos empreendedores.
      Analise os seguintes dados de um pequeno negócio e forneça insights acionáveis.

      **Dados de Produtos em Estoque:**
      ${productDetails || "Nenhum produto em estoque."}

      **Histórico de Vendas:**
      ${salesDetails || "Nenhuma venda registrada."}

      **Sua Tarefa:**
      Com base nos dados fornecidos, gere um relatório conciso com as seguintes seções:
      1.  **Resumo de Desempenho:** Um breve resumo das vendas totais e do estado geral do negócio.
      2.  **Produtos Mais Vendidos:** Identifique os produtos com melhor desempenho.
      3.  **Produtos com Baixo Estoque:** Liste os produtos que precisam de reposição urgente (5 unidades ou menos).
      4.  **Sugestões Estratégicas:** Ofereça 2-3 sugestões claras e práticas para aumentar as vendas ou melhorar a gestão de estoque. Por exemplo, sugerir promoções para produtos parados, combos de produtos populares, ou ajustar preços.

      Formate sua resposta de forma clara e fácil de ler, usando títulos para cada seção. A linguagem deve ser encorajadora e direta.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get insights from AI. The API call failed.");
    }
};
