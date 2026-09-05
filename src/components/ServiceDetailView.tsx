import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Smartphone, 
  AlertCircle, 
  Calendar, 
  Clock, 
  FileText, 
  Key, 
  Barcode, 
  CheckCircle, 
  MessageSquare, 
  Printer, 
  Edit3, 
  Eye, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { ServiceRecord, ServiceStatus } from '../types';
import { whatsappService } from '../services/whatsappService';

interface ServiceDetailViewProps {
  service: ServiceRecord;
  onBack: () => void;
  onOpenStatusUpdate: () => void;
  onOpenEdit: () => void;
  onOpenReceipt: () => void;
  onOpenCustomerStatusView: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  service,
  onBack,
  onOpenStatusUpdate,
  onOpenEdit,
  onOpenReceipt,
  onOpenCustomerStatusView
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'kabul':
        return {
          label: 'Kabul',
          className: 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
        };
      case 'onarimda':
        return {
          label: 'Onarımda',
          className: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
        };
      case 'hazir':
        return {
          label: 'Hazır',
          className: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
        };
      case 'teslim_edildi':
        return {
          label: 'Teslim Edildi',
          className: 'bg-slate-700 text-white shadow-sm'
        };
      case 'iade_iptal':
        return {
          label: 'İade / İptal',
          className: 'bg-rose-600 text-white shadow-sm'
        };
    }
  };

  const badge = getStatusBadge(service.status);

  // Doğrudan WhatsApp bildirim gönder
  const handleQuickWhatsApp = () => {
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

  return (
    <div className="space-y-4 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            id="service-detail-back-btn"
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Servis Detayı
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Teknik servis işlem ve cihaz kartı</p>
          </div>
        </div>

        {/* Quick External Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReceipt}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition shadow-sm"
            title="Termal Fiş Yazdır"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fiş Yazdır</span>
          </button>

          <button
            onClick={onOpenCustomerStatusView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-sm"
            title="Müşteri Takip Ekranı"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Müşteri Ekranı</span>
          </button>
        </div>
      </div>

      {/* ANA SERVİS KARTI */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 space-y-5">
        {/* Service ID & Status Tag */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Takip Fiş No</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {service.id}
            </span>
          </div>
          <span className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* Müşteri ve Cihaz Bilgileri Listesi (Görseldeki sade yapı) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Müşteri */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Müşteri</div>
              <div className="font-bold text-slate-900 dark:text-white">{service.customerName}</div>
            </div>
          </div>

          {/* Telefon */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-400">Telefon</div>
                <div className="font-bold text-slate-900 dark:text-white">{service.customerPhone}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${service.customerPhone.replace(/\s/g, '')}`}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  title="Ara"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                </a>
                <button
                  onClick={handleQuickWhatsApp}
                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                  title="WhatsApp Mesajı Gönder"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Model */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Model</div>
              <div className="font-bold text-slate-900 dark:text-white">
                {service.deviceBrand} {service.deviceModel}
              </div>
            </div>
          </div>

          {/* Sorun */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Sorun / Şikayet</div>
              <div className="font-bold text-slate-900 dark:text-white">{service.issueDescription}</div>
            </div>
          </div>

          {/* Kabul Tarihi */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Kabul Tarihi</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(service.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            </div>
          </div>

          {/* Tahmini Teslim */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Tahmini Teslim</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {service.estimatedDeliveryDate 
                  ? new Date(service.estimatedDeliveryDate).toLocaleDateString('tr-TR')
                  : 'Belirlenmedi'}
              </div>
            </div>
          </div>

          {/* IMEI / Seri No (Kritik GSM Alanı) */}
          {service.imeiOrSerial && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Barcode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">IMEI / Seri No</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                  {service.imeiOrSerial}
                </div>
              </div>
            </div>
          )}

          {/* Ekran Kilidi / PIN */}
          {service.devicePassword && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                <Key className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">Ekran Kilidi / PIN</div>
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {service.devicePassword}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notlar */}
        {service.technicianNotes && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm">
            <div className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Teknisyen Notları:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{service.technicianNotes}</p>
          </div>
        )}

        {/* Maliyet ve Fiyat Özeti */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-indigo-900/70 dark:text-indigo-300 font-medium">Servis Tutarı</span>
            <div className="text-lg sm:text-xl font-black text-indigo-900 dark:text-indigo-200">
              {service.finalCostTRY || service.estimatedCostTRY} TL
            </div>
          </div>
          {service.depositTRY ? (
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alınan Kapora</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {service.depositTRY} TL
              </div>
            </div>
          ) : null}
        </div>

        {/* FOTOĞRAFLAR (Kabul) - Görseldeki galeri formatı */}
        <div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
            Fotoğraflar (Kabul)
          </div>
          {service.photos && service.photos.length > 0 ? (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {service.photos.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(imgUrl)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 active:scale-95 transition shrink-0 relative group shadow-sm"
                >
                  <img
                    src={imgUrl}
                    alt={`Cihaz Kabul Fotoğrafı ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic py-2">
              Kabul anında fotoğraf eklenmemiş.
            </div>
          )}
        </div>

        {/* BUTONLAR (DÜZENLE ve DURUMU GÜNCELLE) - Görseldeki gibi */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            id="btn-edit-service"
            onClick={onOpenEdit}
            className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>DÜZENLE</span>
          </button>

          <button
            id="btn-update-status"
            onClick={onOpenStatusUpdate}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm active:scale-95 transition flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25"
          >
            <CheckCircle className="w-4 h-4" />
            <span>DURUMU GÜNCELLE</span>
          </button>
        </div>
      </div>

      {/* SERVİS GEÇMİŞİ ZAMAN ÇİZELGESİ (TIMELINE) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Servis Geçmişi
        </h2>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {service.timeline.map((item, idx) => {
            const isLast = idx === service.timeline.length - 1;
            const nodeColor = item.status === 'hazir' 
              ? 'bg-emerald-500' 
              : item.status === 'onarimda' 
              ? 'bg-amber-500' 
              : 'bg-indigo-600';

            return (
              <div key={item.id || idx} className="relative group">
                {/* Node icon / dot */}
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full ${nodeColor} text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-slate-800 shadow-sm`}>
                  ✓
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>

                  {item.note && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.note}
                    </p>
                  )}

                  <div className="text-[10px] text-slate-400 mt-0.5">
                    İşlemi Yapan: <span className="font-semibold">{item.updatedBy || 'Osman Usta'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fotoğraf Büyütme Modal (Lightbox) */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
            <img
              src={selectedPhoto}
              alt="Büyük Görsel"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
