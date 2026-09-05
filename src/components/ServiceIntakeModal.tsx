import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Smartphone, 
  User, 
  Phone, 
  Barcode, 
  Key, 
  Calendar, 
  Coins, 
  FileText, 
  Check, 
  Printer, 
  Trash2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Customer, ServiceRecord } from '../types';
import { storageService } from '../services/storageService';
import { whatsappService } from '../services/whatsappService';

interface ServiceIntakeModalProps {
  onClose: () => void;
  onSuccess: (newService: ServiceRecord) => void;
  customers: Customer[];
}

export const ServiceIntakeModal: React.FC<ServiceIntakeModalProps> = ({
  onClose,
  onSuccess,
  customers
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState('');
  const [imeiOrSerial, setImeiOrSerial] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [physicalCondition, setPhysicalCondition] = useState('Ekran kırık, kasada normal kullanım izleri var.');
  const [issueDescription, setIssueDescription] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [estimatedCostTRY, setEstimatedCostTRY] = useState<number | ''>(2500);
  const [depositTRY, setDepositTRY] = useState<number | ''>(0);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80'
  ]);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Marka Hızlı Seçim
  const popularBrands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Diğer'];

  // Hızlı Arıza Şablonları
  const quickIssues = [
    'Ekran / Dokunmatik Kırık',
    'Batarya Değişimi',
    'Şarj Soketi / Temassızlık',
    'Kamera / Titreme Arızası',
    'Sıvı Teması / Açılmıyor',
    'Yazılım / Logoda Kalıyor'
  ];

  // Müşteri seçildiğinde otomatik doldur
  const handleSelectExistingCustomer = (c: Customer) => {
    setCustomerName(c.fullName);
    setCustomerPhone(c.phone);
  };

  // Fotoğraf Yükleme / Çekme
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Lütfen müşteri adını giriniz.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMsg('Lütfen müşteri telefon numarasını giriniz.');
      return;
    }

    if (!deviceModel.trim()) {
      setErrorMsg('Lütfen cihaz modelini (örn: iPhone 13) giriniz.');
      return;
    }

    if (!issueDescription.trim()) {
      setErrorMsg('Lütfen arıza veya şikayet açıklamasını giriniz.');
      return;
    }

    // 1. Müşteri bul veya kaydet
    const customer = storageService.findOrCreateCustomer(customerName, customerPhone);

    // 2. Servis Kaydı Oluştur
    const newService = storageService.createService({
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      deviceBrand,
      deviceModel: deviceModel.trim(),
      imeiOrSerial: imeiOrSerial.trim() || undefined,
      devicePassword: devicePassword.trim() || undefined,
      physicalCondition: physicalCondition.trim() || undefined,
      issueDescription: issueDescription.trim(),
      technicianNotes: technicianNotes.trim() || undefined,
      status: 'kabul',
      estimatedCostTRY: Number(estimatedCostTRY) || 0,
      depositTRY: Number(depositTRY) || 0,
      estimatedDeliveryDate: estimatedDeliveryDate || undefined,
      photos
    });

    // 3. İstenirse WhatsApp bildirim linkini aç
    if (sendWhatsApp) {
      const msg = whatsappService.generateMessage(newService, 'kabul');
      whatsappService.sendMessage({
        recipientPhone: newService.customerPhone,
        messageText: msg,
        serviceId: newService.id,
        templateType: 'kabul'
      });
    }

    onSuccess(newService);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Yeni Cihaz Servis Kabulü
              </h2>
              <p className="text-xs text-slate-500">TR-{new Date().getFullYear()}-XXXX fiş numarası otomatik atanır</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              {errorMsg}
            </div>
          )}

          {/* 1. MÜŞTERİ BİLGİLERİ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>1. Müşteri Bilgileri</span>
              </label>
              {customers.length > 0 && (
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                  Kayıtlı {customers.length} müşteri
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Müşteri Adı Soyadı *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Telefon Numarası (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="Örn: 0555 123 45 67"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick customer pick chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 shrink-0">Hızlı Seç:</span>
              {customers.slice(0, 3).map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleSelectExistingCustomer(c)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition"
                >
                  {c.fullName}
                </button>
              ))}
            </div>
          </div>

          {/* 2. CİHAZ BİLGİLERİ */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>2. Cihaz Bilgileri</span>
            </label>

            {/* Marka Butonları */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Marka
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {popularBrands.map(b => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setDeviceBrand(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      deviceBrand === b
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Model Adı *
                </label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={e => setDeviceModel(e.target.value)}
                  placeholder="Örn: iPhone 13 / A54"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  IMEI / Seri No (Yasal)
                </label>
                <div className="relative">
                  <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={imeiOrSerial}
                    onChange={e => setImeiOrSerial(e.target.value)}
                    placeholder="15 haneli IMEI"
                    className="w-full pl-9 pr-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Ekran Kilidi / PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={devicePassword}
                    onChange={e => setDevicePassword(e.target.value)}
                    placeholder="Örn: 1453 veya Desen"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Kozmetik & Fiziksel Durum
              </label>
              <input
                type="text"
                value={physicalCondition}
                onChange={e => setPhysicalCondition(e.target.value)}
                placeholder="Örn: Ekranda kırık, kasada derin çizikler mevcut"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. ARIZA & ŞİKAYET */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>3. Arıza & Şikayet</span>
            </label>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Arıza Açıklaması *
              </label>
              <textarea
                required
                rows={2}
                value={issueDescription}
                onChange={e => setIssueDescription(e.target.value)}
                placeholder="Müşteri şikayetini detaylı yazın (örn: Ekranın sol altı basmıyor, görüntü var dokunmatik yok)..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Hızlı arıza butonları */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickIssues.map((issue, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setIssueDescription(issue)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition"
                >
                  + {issue}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Teknisyen Özel Notu
              </label>
              <input
                type="text"
                value={technicianNotes}
                onChange={e => setTechnicianNotes(e.target.value)}
                placeholder="Örn: Orijinal servis ekranı takılacak, vidalarda eksik var."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. FİYAT & TESLİMAT */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-indigo-500" />
              <span>4. Fiyat & Teslimat</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Tahmini Servis Tutarı (TL)
                </label>
                <input
                  type="number"
                  value={estimatedCostTRY}
                  onChange={e => setEstimatedCostTRY(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="2500"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Alınan Kapora (TL)
                </label>
                <input
                  type="number"
                  value={depositTRY}
                  onChange={e => setDepositTRY(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Tahmini Teslim Tarihi
                </label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={e => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. KABUL FOTOĞRAFLARI */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-500" />
                <span>5. Kabul Fotoğrafları ({photos.length})</span>
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Fotoğraf Ekle</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              multiple
              accept="image/*"
              className="hidden"
            />

            {/* Photo List */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {photos.map((p, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl relative overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 group">
                  <img src={p} alt="Kabul" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition shrink-0"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[9px] mt-0.5">+ Ekle</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Bildirim Onay Kutusu */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
            <input
              id="intake-send-whatsapp"
              type="checkbox"
              checked={sendWhatsApp}
              onChange={e => setSendWhatsApp(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="intake-send-whatsapp" className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 cursor-pointer flex-1">
              Kayıt tamamlandığında müşteriye otomatik WhatsApp servis kabul fişi mesajı açılsın.
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition"
            >
              <Check className="w-4 h-4" />
              <span>Servis Kaydını Tamamla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
