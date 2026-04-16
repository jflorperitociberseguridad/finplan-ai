/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Transaction, Budget, Goal } from './types';
import { analyzeFinances } from './services/geminiService';
import { motion } from 'motion/react';
import { LayoutDashboard, Wallet, Target, BrainCircuit, PlusCircle, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'different'>('dashboard');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Transaction) => setTransactions([...transactions, t]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeFinances(transactions);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error(error);
      setAiAnalysis('Error al analizar las finanzas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#6fa6cb] p-6 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">FinPlan AI</h1>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <BrainCircuit size={20} />
          {loading ? 'Analizando...' : 'Analizar con IA'}
        </button>
      </header>

      <nav className="mb-6 flex gap-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`rounded-lg px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'bg-white text-blue-900' : 'bg-blue-800/50 text-white'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('different')}
          className={`rounded-lg px-4 py-2 font-medium ${activeTab === 'different' ? 'bg-white text-blue-900' : 'bg-blue-800/50 text-white'}`}
        >
          Zona Diferente
        </button>
      </nav>

      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><LayoutDashboard size={20} /> Transacciones</h2>
            <button onClick={() => addTransaction({ id: Date.now().toString(), date: new Date().toISOString(), amount: 100, category: 'Comida', type: 'expense', description: 'Compra' })} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <PlusCircle size={20} /> Agregar transacción
            </button>
            <ul className="mt-4 space-y-2">
              {transactions.map(t => (
                <li key={t.id} className="flex justify-between border-b pb-2">
                  <span>{t.description}</span>
                  <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {t.type === 'income' ? '+' : '-'}${t.amount}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Wallet size={20} /> Presupuesto</h2>
            <p className="text-gray-500">Funcionalidad en desarrollo.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Target size={20} /> Metas</h2>
            <p className="text-gray-500">Funcionalidad en desarrollo.</p>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Sparkles size={20} /> Zona Diferente</h2>
          <p className="text-gray-700">Esta es una zona diferente para explorar nuevas funcionalidades.</p>
        </motion.div>
      )}

      {aiAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-blue-900">Análisis de IA</h3>
          <p className="text-blue-800 whitespace-pre-line">{aiAnalysis}</p>
        </motion.div>
      )}
    </div>
  );
}
