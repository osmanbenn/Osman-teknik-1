import React, { useState } from 'react';
import { X, Save, Boxes, Barcode, MapPin, DollarSign, Tag, Smartphone, AlertCircle } from 'lucide-react';
import { StockItem, StockCategory } from '../types';

interface StockItemModalProps {
  item?: StockItem | null;
  onClose: () => void;
  onSave: (data: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const StockItemModal: React.FC<StockItemModalProps> = ({
  item,
  onClose,
  onSave
}) => {
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState<StockCategory>(item?.category || 'yedek_parca');
  const [brand, setBrand] = useState(item?.brand || 'Apple');
  const [compatibleModel, setCompatibleModel] = useState(item?.compatibleModel || '');
  const [barcode, setBarcode] = useState(item?.barcode || '');
  const [stockQuantity, setStockQuantity] = useState<number>(item?.stockQuantity ?? 5);
  const [minStockAlert, setMinStockAlert] = useState<number>(item?.minStockAlert ?? 2);
  const [costUSD, setCostUSD] = useState<number>(item?.costUSD ?? 15);
  const [costTRY, setCostTRY] = useState<number>(item?.costTRY ?? 525);
  const [sellPriceTRY, setSellPriceTRY] = useState<number>(item?.sellPriceTRY ?? 1200);
  const [shelfLocation, setShelfLocation] = useState(item?.shelfLocation || '');

  // Otomatik rastgele EAN-13 benzeri barkod üret
  const generateBarcode = () => {
    const randomCode = '869' + Math.floor(100000000 + Math.random() * 900000000).toString();
    setBarcode(randomCode);
  };

  const handleCostUSDChange = (usd: number) => {
    setCostUSD(usd);
    // 35 TL kur varsayımıyla TL maliyeti güncelle
    const calculatedTRY = Math.round(usd * 35);
    setCostTRY(calculatedTRY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      brand: brand.trim(),
      compatibleModel: compatibleModel.trim() || undefined,
      barcode: barcode.trim() || '869' + Date.now().toString().slice(-9),
      stockQuantity: Number(stockQuantity),
      minStockAlert: Number(minStockAlert),
      costUSD: Number(costUSD),
      costTRY: Number(costTRY),
      sellPriceTRY: Number(sellPriceTRY),
      shelfLocation: shelfLocation.trim() || undefined
    });
    onClose();
  };

  const categories: { id: StockCategory; label: string }[] = [
    { id: 'ekran', label: 'Ekran & Dokunmatik' },
    { id: 'batarya', label: 'Batarya & Pil' },
    { id: 'yedek_parca', label: 'Yedek Parça & Entegre' },
    { id: 'sarj_aksesuar', label: 'Şarj Aleti & Kablo' },
    { id: 'koruma_kilif', label: 'Kırılmaz Cam & Kılıf' },
    { id: 'kulaklik_ses', label: 'Kulaklık & Ses' },
    { id: 'diger', label: 'Diğer' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {item ? 'Parça / Ürünü Düzenle' : 'Yeni Stok & Parça Girişi'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Teknik servis ve dükkân stok bilgileri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Ürün Adı */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ürün / Parça Adı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: iPhone 13 Orijinal Revize Ekran"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Kategori & Marka */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as StockCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Marka
              </label>
              <input
                type="text"
                placeholder="Örn: Apple, Samsung, Deji..."
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>

          {/* Uyumlu Model & Raf / Çekmece */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Uyumlu Model</span>
              </label>
              <input
                type="text"
                placeholder="Örn: iPhone 13, Galaxy S23"
                value={compatibleModel}
                onChange={e => setCompatibleModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Raf / Çekmece Kodu</span>
              </label>
              <input
                type="text"
                placeholder="Örn: A1-Çekmece 2, Stand-3"
                value={shelfLocation}
                onChange={e => setShelfLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>
          </div>

          {/* Barkod Alanı */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5 text-slate-400" />
                <span>Barkod / Seri No</span>
              </label>
              <button
                type="button"
                onClick={generateBarcode}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Otomatik Barkod Üret
              </button>
            </div>
            <input
              type="text"
              placeholder="Barkod okutun veya girin (Örn: 869001001001)"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Stok Adetleri */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mevcut Stok Adedi
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={e => setStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Kritik Uyarı Limiti</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={minStockAlert}
                onChange={e => setMinStockAlert(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Fiyatlandırma & Maliyet (FIFO / Kur Hazır) */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
              <span>Maliyet & Satış Fiyatı</span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">1 USD ≈ 35.00 TL</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Alış ($ USD)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={costUSD}
                  onChange={e => handleCostUSDChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Alış (₺ TL)
                </label>
                <input
                  type="number"
                  min="0"
                  value={costTRY}
                  onChange={e => setCostTRY(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                  Satış Fiyatı (₺)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={sellPriceTRY}
                  onChange={e => setSellPriceTRY(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>

            {/* Kâr Özeti */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
              <span className="text-slate-500 dark:text-slate-400">Birim Net Kâr:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                +{sellPriceTRY - costTRY} TL (%{costTRY > 0 ? Math.round(((sellPriceTRY - costTRY) / costTRY) * 100) : 100})
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{item ? 'Değişiklikleri Kaydet' : 'Stoka Ekle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
