import React, { useState } from 'react';
import { Settings, Store, Phone, DollarSign, Printer, MessageSquare, ShieldCheck, RefreshCw, Save, Check, Palette, ArrowRight } from 'lucide-react';

interface SettingsViewProps {
  onResetDemo: () => void;
  onOpenThemes?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemo, onOpenThemes }) => {
  const [shopName, setShopName] = useState('OSMANTEKNİK PRO');
  const [shopPhone, setShopPhone] = useState('0555 123 45 67');
  const [shopAddress, setShopAddress] = useState('Atatürk Cad. No:14/A Merkez / Türkiye');
  const [currentUsdRate, setCurrentUsdRate] = useState('35.00');
  const [printerWidth, setPrinterWidth] = useState('80mm');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 md:pb-6 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Sistem & Dükkân Ayarları
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dükkân profili, kur ayarları ve termal fiş yapılandırması
        </p>
      </div>

      {savedToast && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Ayarlar başarıyla kaydedildi.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* DÜKKÂN PROFİLİ */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Dükkân ve İletişim Bilgileri</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Firma / Dükkân Adı
              </label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Dükkân Telefonu & WhatsApp
              </label>
              <input
                type="tel"
                value={shopPhone}
                onChange={e => setShopPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Dükkân Adresi (Fiş üstüne basılır)
            </label>
            <input
              type="text"
              value={shopAddress}
              onChange={e => setShopAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* KUR RİSKİ VE DÖVİZ (KRİTİK İŞ KURALI #1) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kur Riski & Döviz Parametreleri</span>
            </h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
              FAZ 1 Hazır (FIFO Altyapısı)
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Parça maliyetleri USD ve TL cinsinden kaydedilmekte, 3 farklı kâr hesabı (tarihsel, işlem anı, güncel yenileme maliyeti) için veri modelleri hazır tutulmaktadır.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Güncel USD / TRY Kuru
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentUsdRate}
                  onChange={e => setCurrentUsdRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">TL</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Otomatik Kur Güncelleme
              </label>
              <select
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 focus:outline-none"
              >
                <option>TCMB Canlı Kur API (FAZ 2 & 5 ile Aktif)</option>
              </select>
            </div>
          </div>
        </div>

        {/* TERMAL YAZICI AYARLARI */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Termal Fiş Yazıcı Tercihi</span>
          </h2>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="printerWidth"
                value="80mm"
                checked={printerWidth === '80mm'}
                onChange={() => setPrinterWidth('80mm')}
                className="text-indigo-600"
              />
              <span>80mm Standart POS Yazıcı</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="printerWidth"
                value="58mm"
                checked={printerWidth === '58mm'}
                onChange={() => setPrinterWidth('58mm')}
                className="text-indigo-600"
              />
              <span>58mm Mini Mobil Yazıcı</span>
            </label>
          </div>
        </div>

        {/* WHATSAPP İZOLASYON DURUMU (KRİTİK İŞ KURALI #5) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Bildirim Altyapısı</span>
          </h2>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 space-y-1 border border-slate-200/60 dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>IWhatsAppService Soyutlama Katmanı Aktif</span>
            </div>
            <p>Mevcut Mod: <strong>Direct Web/wa.me Link</strong> (Sıfır Ban Riski, 1 tıkla müşteri mesajı açılır).</p>
            <p className="text-[11px] text-slate-400">İleride Meta Cloud API veya bağımsız servis eklenirken UI kodu değişmeden tek satırla entegre edilebilir.</p>
          </div>
        </div>

        {/* GÖRSEL TEMALAR BÖLÜMÜ */}
        {onOpenThemes && (
          <div className="bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 rounded-2xl p-4 sm:p-5 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/30">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Görsel Temalar & Renk Paletleri</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modern GSM, Siber Teknisyen, Usta Tezgahı, Saf Siyah AMOLED renk seçenekleri
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenThemes}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
            >
              <span>Temaları Yönet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDemo}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Örnek Verileri Sıfırla</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-500/25 active:scale-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>Ayarları Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
};
