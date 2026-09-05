import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  Barcode, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Filter, 
  Edit3, 
  Trash2, 
  Smartphone,
  PlusCircle,
  MinusCircle,
  ShoppingCart
} from 'lucide-react';
import { StockItem, StockCategory } from '../types';

interface InventoryViewProps {
  stockList: StockItem[];
  onOpenNewStock: () => void;
  onEditStock: (item: StockItem) => void;
  onDeleteStock: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  onOpenQuickSale: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  stockList,
  onOpenNewStock,
  onEditStock,
  onDeleteStock,
  onAdjustQuantity,
  onOpenQuickSale
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyCritical, setOnlyCritical] = useState(false);

  // İstatistikler
  const totalItemsCount = stockList.reduce((sum, item) => sum + item.stockQuantity, 0);
  const criticalItems = stockList.filter(item => item.stockQuantity <= item.minStockAlert);
  const totalCostTRY = stockList.reduce((sum, item) => sum + (item.costTRY * item.stockQuantity), 0);
  const totalSellValueTRY = stockList.reduce((sum, item) => sum + (item.sellPriceTRY * item.stockQuantity), 0);

  // Filtreleme
  const filteredItems = stockList.filter(item => {
    if (onlyCritical && item.stockQuantity > item.minStockAlert) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    return (
      item.name.toLowerCase().includes(term) ||
      item.barcode.toLowerCase().includes(term) ||
      item.brand.toLowerCase().includes(term) ||
      (item.compatibleModel && item.compatibleModel.toLowerCase().includes(term)) ||
      (item.shelfLocation && item.shelfLocation.toLowerCase().includes(term))
    );
  });

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tüm Stok' },
    { id: 'ekran', label: 'Ekran' },
    { id: 'batarya', label: 'Batarya' },
    { id: 'yedek_parca', label: 'Yedek Parça' },
    { id: 'sarj_aksesuar', label: 'Şarj & Kablo' },
    { id: 'koruma_kilif', label: 'Kırılmaz Cam & Kılıf' },
    { id: 'kulaklik_ses', label: 'Kulaklık & Ses' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Stok & Yedek Parça Yönetimi
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              FAZ 2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ekran, batarya, kılıf, şarj aletleri ve raf yerleşim takibi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickSale}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Hızlı Satış Yap</span>
          </button>

          <button
            onClick={onOpenNewStock}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Parça Ekle</span>
          </button>
        </div>
      </div>

      {/* 4 ÖZET İSTATİSTİK KARTI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Toplam Adet */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Toplam Parça / Ürün</span>
            <Boxes className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalItemsCount} <span className="text-xs font-normal text-slate-400">Adet</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{stockList.length} farklı ürün kalemi</div>
        </div>

        {/* Kritik Stok Uyarısı */}
        <div 
          onClick={() => setOnlyCritical(!onlyCritical)}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer transition ${
            onlyCritical 
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400' 
              : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/60 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Kritik Stok Uyarısı</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {criticalItems.length} <span className="text-xs font-normal text-rose-400">Ürün</span>
          </div>
          <div className="text-[11px] text-rose-500 mt-1">Sipariş verilmeli (Tıkla ve filtrele)</div>
        </div>

        {/* Toplam Alış Maliyeti */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Stok Maliyet Değeri</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalCostTRY.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Bağlanan sermaye (FIFO)</div>
        </div>

        {/* Beklenen Satış Ciro */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Tahmini Satış Değeri</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalSellValueTRY.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">
            +{(totalSellValueTRY - totalCostTRY).toLocaleString('tr-TR')} ₺ Tahmini Brüt Kâr
          </div>
        </div>
      </div>

      {/* ARAMA & FİLTRELER */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Arama Kutusu */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Parça adı, barkod, model (Örn: iPhone 13, 869..., Çekmece 2)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Sadece Kritik Butonu */}
          <button
            onClick={() => setOnlyCritical(!onlyCritical)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              onlyCritical
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sadece Kritik ({criticalItems.length})</span>
          </button>
        </div>

        {/* Kategori Tabları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* STOK LİSTESİ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500">
            {filteredItems.length} Ürün Listeleniyor
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400">
            <Boxes className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">Aranan kriterlere uygun stok kaydı bulunamadı.</p>
            <button
              onClick={onOpenNewStock}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Yeni Stok Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const isCritical = item.stockQuantity <= item.minStockAlert;
              const profitTRY = item.sellPriceTRY - item.costTRY;
              const profitMargin = item.costTRY > 0 ? Math.round((profitTRY / item.costTRY) * 100) : 100;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border bg-white dark:bg-slate-800/90 transition shadow-xs flex flex-col justify-between gap-3 ${
                    isCritical
                      ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20'
                      : 'border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    {/* Üst Bilgi Satırı */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.brand}
                        </span>
                        {item.compatibleModel && (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            • {item.compatibleModel}
                          </span>
                        )}
                      </div>

                      {/* Stok Adet Rozeti */}
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                          isCritical
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                        }`}
                      >
                        {isCritical && <AlertTriangle className="w-3 h-3" />}
                        {item.stockQuantity} Adet
                      </span>
                    </div>

                    {/* Ürün Başlığı */}
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>

                    {/* Barkod ve Raf Konumu */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span className="font-mono flex items-center gap-1">
                        <Barcode className="w-3.5 h-3.5 text-slate-400" />
                        {item.barcode}
                      </span>
                      {item.shelfLocation && (
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.shelfLocation}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fiyat & Hızlı Stok Ayarı Satırı */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs">
                        <span className="text-slate-400 text-[11px]">Alış: {item.costTRY}₺ </span>
                        <span className="font-black text-sm text-slate-900 dark:text-white ml-1">
                          Satış: {item.sellPriceTRY} ₺
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Kâr: +{profitTRY}₺ (%{profitMargin})
                      </span>
                    </div>

                    {/* Hızlı Artır / Azalt & Aksiyonlar */}
                    <div className="flex items-center gap-1">
                      <button
                        title="1 Adet Düşür"
                        onClick={() => onAdjustQuantity(item.id, -1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>

                      <button
                        title="1 Adet Ekle"
                        onClick={() => onAdjustQuantity(item.id, 1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>

                      <button
                        title="Düzenle"
                        onClick={() => onEditStock(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition ml-1"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        title="Sil"
                        onClick={() => {
                          if (window.confirm(`"${item.name}" stoktan silinsin mi?`)) {
                            onDeleteStock(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
