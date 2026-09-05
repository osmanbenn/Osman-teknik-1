import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Wrench, 
  Package, 
  MessageSquare, 
  Calendar, 
  Smartphone, 
  Hash, 
  Clock, 
  Share2, 
  Copy,
  Printer
} from 'lucide-react';
import { ServiceRecord } from '../types';
import { whatsappService } from '../services/whatsappService';

interface CustomerStatusViewProps {
  service: ServiceRecord;
  onBack: () => void;
  onOpenReceipt: () => void;
}

export const CustomerStatusView: React.FC<CustomerStatusViewProps> = ({
  service,
  onBack,
  onOpenReceipt
}) => {
  const [copied, setCopied] = React.useState(false);

  const getStatusDisplay = () => {
    switch (service.status) {
      case 'hazir':
        return {
          title: 'HAZIR',
          subtitle: 'Cihazınız başarıyla onarıldı ve teslimata hazır!',
          color: 'text-emerald-600 dark:text-emerald-400',
          bgCircle: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
          badgeBg: 'bg-emerald-600',
          icon: CheckCircle2
        };
      case 'onarimda':
        return {
          title: 'ONARIMDA',
          subtitle: 'Cihazınız teknisyenimiz tarafından onarılmaktadır.',
          color: 'text-amber-600 dark:text-amber-400',
          bgCircle: 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
          badgeBg: 'bg-amber-500',
          icon: Wrench
        };
      case 'kabul':
        return {
          title: 'KABUL EDİLDİ',
          subtitle: 'Cihazınız sıraya alındı, arıza tespiti yapılıyor.',
          color: 'text-violet-600 dark:text-violet-400',
          bgCircle: 'bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400',
          badgeBg: 'bg-violet-600',
          icon: Package
        };
      case 'teslim_edildi':
        return {
          title: 'TESLİM EDİLDİ',
          subtitle: 'Cihaz müşteriye teslim edilmiştir.',
          color: 'text-slate-700 dark:text-slate-300',
          bgCircle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
          badgeBg: 'bg-slate-700',
          icon: CheckCircle2
        };
      default:
        return {
          title: 'İŞLEMDE',
          subtitle: 'Cihaz durumu güncelleniyor.',
          color: 'text-indigo-600 dark:text-indigo-400',
          bgCircle: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600',
          badgeBg: 'bg-indigo-600',
          icon: Package
        };
    }
  };

  const statusInfo = getStatusDisplay();
  const IconComponent = statusInfo.icon;

  const handleSendMessage = () => {
    const template = service.status === 'hazir' 
      ? 'hazir' 
      : service.status === 'onarimda' 
      ? 'onarimda' 
      : 'kabul';

    const message = whatsappService.generateMessage(service, template);
    whatsappService.sendMessage({
      recipientPhone: service.customerPhone,
      messageText: message,
      serviceId: service.id,
      templateType: template
    });
  };

  const handleCopyLink = () => {
    const text = `OSMANTEKNİK Servis Takip: ${service.id} - ${service.deviceBrand} ${service.deviceModel} Durumu: ${statusInfo.title}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Cihaz Durumu
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenReceipt}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            title="Fiş Yazdır"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            title="Bilgiyi Kopyala"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {copied && (
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 animate-fadeIn">
          Takip bilgisi panoya kopyalandı!
        </div>
      )}

      {/* ANA DURUM KARTI (Görseldeki 4. Ekran ile Birebir) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-6 shadow-sm">
        {/* Büyük Yuvarlak İkon */}
        <div className="flex justify-center pt-2">
          <div className={`w-20 h-20 rounded-full ${statusInfo.bgCircle} flex items-center justify-center shadow-inner animate-pulse`}>
            <IconComponent className="w-10 h-10" />
          </div>
        </div>

        {/* Başlık ve Açıklama */}
        <div className="space-y-1">
          <h2 className={`text-2xl font-black tracking-tight ${statusInfo.color}`}>
            {statusInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
            {statusInfo.subtitle}
          </p>
        </div>

        {/* Tablo Bilgileri (Görseldeki düzen) */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 text-xs sm:text-sm space-y-3 text-left border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Tamir No</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{service.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Model</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {service.deviceBrand} {service.deviceModel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Kabul Tarihi</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {new Date(service.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Tahmini Teslim</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {service.estimatedDeliveryDate 
                ? new Date(service.estimatedDeliveryDate).toLocaleDateString('tr-TR')
                : 'Belirlenmedi'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 font-bold">
            <span className="text-slate-600 dark:text-slate-400">Toplam Tutar</span>
            <span className="text-base text-indigo-600 dark:text-indigo-400">
              {service.finalCostTRY || service.estimatedCostTRY} TL
            </span>
          </div>
        </div>

        {/* BÜYÜK YEŞİL BUTON: MÜŞTERİYE MESAJ GÖNDER */}
        <button
          id="btn-customer-send-whatsapp"
          onClick={handleSendMessage}
          className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition"
        >
          <MessageSquare className="w-5 h-5" />
          <span>MÜŞTERİYE MESAJ GÖNDER</span>
        </button>
      </div>

      {/* Servis Geçmişi Zaman Çizelgesi */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          Servis Geçmişi
        </h3>

        <div className="space-y-3 text-xs">
          {service.timeline.map((item, idx) => {
            const isCompleted = item.status === 'hazir' || item.status === 'teslim_edildi';
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5`}>
                  ✓
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                    <span className="text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  {item.note && <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
