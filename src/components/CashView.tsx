import React, { useState } from 'react';
import { 
  CreditCard, 
  Banknote, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Calendar, 
  Clock, 
  Filter, 
  Download, 
  Trash2,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2
} from 'lucide-react';
import { CashTransaction } from '../types';

interface CashViewProps {
  transactions: CashTransaction[];
  onAddTransaction: (tx: Omit<CashTransaction, 'id' | 'date'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const CashView: React.FC<CashViewProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}) => {
  const [filterType, setFilterType] = useState<'all' | 'gelir' | 'gider'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Yeni işlem formu state'leri
  const [txType, setTxType] = useState<'gelir' | 'gider'>('gider');
  const [category, setCategory] = useState<any>('dükkan_gideri');
  const [amountTRY, setAmountTRY] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<'nakit' | 'kredi_karti' | 'havale'>('nakit');
  const [description, setDescription] = useState('');

  // Hesaplamalar
  const totalIncome = transactions
    .filter(t => t.type === 'gelir')
    .reduce((sum, t) => sum + t.amountTRY, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'gider')
    .reduce((sum, t) => sum + t.amountTRY, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amountTRY <= 0) return;

    onAddTransaction({
      type: txType,
      category,
      amountTRY: Number(amountTRY),
      paymentMethod,
      description: description.trim()
    });

    setIsAddModalOpen(false);
    setDescription('');
    setAmountTRY(100);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Kasa & Nakit Akışı
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
              FAZ 2 KASA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Günlük servis ve satış tahsilatları, dükkân giderleri ve net kasa takibi
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Gelir / Gider Ekle</span>
        </button>
      </div>

      {/* 3 KASA ÖZET KARTI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Net Kasa Bakiyesi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Net Kasa Bakiyesi</span>
            <DollarSign className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {netBalance.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Anlık toplam çekmecedeki & hesaptaki para</div>
        </div>

        {/* Toplam Gelirler */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Toplam Gelirler</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            +{totalIncome.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Satış ve servis tahsilatları</div>
        </div>

        {/* Toplam Giderler */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Toplam Giderler</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
            -{totalExpense.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Parça alımı, çay, kargo masrafları</div>
        </div>
      </div>

      {/* KASA HAREKETLERİ LİSTESİ */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            Kasa Hareketleri
            <span className="text-xs font-normal text-slate-400">({filteredTransactions.length} Kayıt)</span>
          </h2>

          {/* Filtre Tabları */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterType('gelir')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filterType === 'gelir'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => setFilterType('gider')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filterType === 'gider'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Giderler
            </button>
          </div>
        </div>

        {/* Hareketler Listesi */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTransactions.map(tx => {
            const isIncome = tx.type === 'gelir';

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {tx.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{new Date(tx.date).toLocaleDateString('tr-TR')} {new Date(tx.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="capitalize">{tx.paymentMethod.replace('_', ' ')}</span>
                      {tx.referenceId && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-indigo-500">{tx.referenceId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-black font-mono text-sm sm:text-base ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{tx.amountTRY.toLocaleString('tr-TR')} ₺
                  </span>

                  <button
                    onClick={() => {
                      if (window.confirm('Bu kasa hareketi silinsin mi?')) {
                        onDeleteTransaction(tx.id);
                      }
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* YENİ İŞLEM MODALI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Yeni Kasa Hareketi Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              {/* Gelir / Gider Tipi */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('gelir')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    txType === 'gelir'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  + Gelir Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('gider')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    txType === 'gider'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  - Gider Ekle
                </button>
              </div>

              {/* Tutar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tutar (₺ TL)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amountTRY}
                  onChange={e => setAmountTRY(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-black font-mono"
                />
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tahtakale Parça Ödemesi, Dükkân Çay Masrafı"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              {/* Ödeme Yöntemi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ödeme Yöntemi
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="nakit">Nakit</option>
                  <option value="kredi_karti">Kredi Kartı</option>
                  <option value="havale">Havale / EFT</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 text-xs font-bold text-white rounded-xl ${
                    txType === 'gelir' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
