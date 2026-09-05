import React, { useState } from 'react';
import { X, Check, Wrench, CheckCircle, Package, AlertOctagon, MessageSquare, Clock } from 'lucide-react';
import { ServiceRecord, ServiceStatus } from '../types';
import { whatsappService } from '../services/whatsappService';

interface StatusUpdateModalProps {
  service: ServiceRecord;
  onClose: () => void;
  onUpdate: (serviceId: string, newStatus: ServiceStatus, note?: string) => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  service,
  onClose,
  onUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus>(
    service.status === 'kabul' ? 'onarimda' : service.status === 'onarimda' ? 'hazir' : service.status
  );
  const [note, setNote] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  const statuses: { id: ServiceStatus; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'kabul',
      label: 'Kabul Edildi',
      icon: Package,
      color: 'border-violet-500 text-violet-600 bg-violet-50 dark:bg-violet-950/50',
      desc: 'Cihaz teslim alındı, test ve sıra bekliyor.'
    },
    {
      id: 'onarimda',
      label: 'Onarımda',
      icon: Wrench,
      color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/50',
      desc: 'Teknisyen masasında, parça değişimi yapılıyor.'
    },
    {
      id: 'hazir',
      label: 'Hazır (Teslimata)',
      icon: CheckCircle,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
      desc: 'Tüm testler geçti, müşteri gelip alabilir.'
    },
    {
      id: 'teslim_edildi',
      label: 'Teslim Edildi',
      icon: Check,
      color: 'border-slate-500 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800',
      desc: 'Ödeme alındı, cihaz müşteriye verildi.'
    },
    {
      id: 'iade_iptal',
      label: 'İade / İptal',
      icon: AlertOctagon,
      color: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/50',
      desc: 'Müşteri onayı alınamadı veya tamir edilemedi.'
    }
  ];

  const handleSave = () => {
    onUpdate(service.id, selectedStatus, note);

    if (sendWhatsApp && (selectedStatus === 'onarimda' || selectedStatus === 'hazir' || selectedStatus === 'teslim_edildi')) {
      const template = selectedStatus === 'hazir' ? 'hazir' : selectedStatus === 'onarimda' ? 'onarimda' : 'teslim_edildi';
      const msg = whatsappService.generateMessage(service, template);
      whatsappService.sendMessage({
        recipientPhone: service.customerPhone,
        messageText: msg,
        serviceId: service.id,
        templateType: template
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Durumu Güncelle
            </h2>
            <p className="text-xs text-slate-500 font-mono">{service.id} • {service.customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Selection Cards */}
        <div className="space-y-2">
          {statuses.map(item => {
            const isSelected = selectedStatus === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedStatus(item.id)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? `${item.color} shadow-sm font-bold`
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-900 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-current bg-current text-white' : 'border-slate-300'}`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note input */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            İşlem Notu (Zaman çizelgesine eklenir)
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Örn: Orijinal OLED ekran takıldı, testleri yapıldı."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* WhatsApp checkbox */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5">
          <input
            id="status-send-whatsapp"
            type="checkbox"
            checked={sendWhatsApp}
            onChange={e => setSendWhatsApp(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded"
          />
          <label htmlFor="status-send-whatsapp" className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 cursor-pointer">
            Müşteriye otomatik WhatsApp durum bildirimi mesajı açılsın.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 active:scale-95 transition"
          >
            Kaydet & Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};
