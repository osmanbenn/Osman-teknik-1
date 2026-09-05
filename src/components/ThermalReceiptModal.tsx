import React from 'react';
import { X, Printer, Wrench, Barcode, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ServiceRecord } from '../types';

interface ThermalReceiptModalProps {
  service: ServiceRecord;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  service,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const balance = (service.finalCostTRY || service.estimatedCostTRY) - (service.depositTRY || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Termal Servis Fişi (80mm)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950 flex justify-center print:p-0 print:bg-white">
          <div
            id="printable-thermal-receipt"
            className="w-full max-w-[340px] bg-white text-black p-5 rounded-xl shadow-md border border-slate-200 font-mono text-xs space-y-3.5 print:shadow-none print:border-none print:w-full print:p-0"
          >
            {/* Shop Header */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-black">
              <div className="font-extrabold text-base tracking-wider uppercase">OSMANTEKNİK</div>
              <div className="text-[11px] font-sans">Cep Telefonu Tamir & Bilişim Hizmetleri</div>
              <div className="text-[10px]">Tel: 0555 123 45 67 • info@osmantechnik.com</div>
              <div className="text-[10px]">Atatürk Cad. No:14/A Merkez/Türkiye</div>
            </div>

            {/* Fiş Başlığı & Barkod */}
            <div className="text-center space-y-1 py-1 border-b border-black">
              <div className="font-extrabold text-sm tracking-tight">CİHAZ TESLİM FİŞİ</div>
              <div className="text-base font-black tracking-widest">{service.id}</div>
              {/* ASCII Barcode Simulation */}
              <div className="py-1 tracking-widest font-bold text-xs select-none">
                |||| | ||||| || |||| |||||| ||||
              </div>
            </div>

            {/* Fiş Bilgileri */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih / Saat:</span>
                <span className="font-bold">
                  {new Date(service.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Müşteri:</span>
                <span className="font-bold">{service.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefon:</span>
                <span className="font-bold">{service.customerPhone}</span>
              </div>
            </div>

            {/* Cihaz Bilgileri */}
            <div className="py-2 border-y border-dashed border-black space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Cihaz:</span>
                <span className="font-bold">{service.deviceBrand} {service.deviceModel}</span>
              </div>
              {service.imeiOrSerial && (
                <div className="flex justify-between">
                  <span className="text-gray-600">IMEI/Seri:</span>
                  <span className="font-bold">{service.imeiOrSerial}</span>
                </div>
              )}
              {service.devicePassword && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilit / PIN:</span>
                  <span className="font-bold">{service.devicePassword}</span>
                </div>
              )}
              <div className="pt-1">
                <span className="text-gray-600 block">Şikayet / Arıza:</span>
                <span className="font-bold block">{service.issueDescription}</span>
              </div>
              {service.physicalCondition && (
                <div className="pt-0.5 text-[10px]">
                  <span className="text-gray-600">Fiziksel Durum:</span> {service.physicalCondition}
                </div>
              )}
            </div>

            {/* Ücret Tablosu */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Tahmini Tutar:</span>
                <span className="font-bold">{service.estimatedCostTRY} TL</span>
              </div>
              {service.depositTRY ? (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Alınan Kapora:</span>
                  <span>- {service.depositTRY} TL</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                <span>KALAN BAKİYE:</span>
                <span>{balance} TL</span>
              </div>
            </div>

            {/* Garanti ve Yasal Şartlar (GSM Dükkânı için standart) */}
            <div className="text-[9px] text-gray-700 leading-tight space-y-1 pt-2 border-t border-dashed border-black">
              <p>1. 60 gün içinde teslim alınmayan cihazların hurda/tasfiye hakkı dükkânımıza aittir.</p>
              <p>2. Cihaz içindeki verilerin (rehber, fotoğraf) yedek sorumluluğu müşteriye aittir.</p>
              <p>3. Sıvı temaslı ve darbe görmüş cihazlarda anakart garantisi verilmez.</p>
              <p>4. Fişsiz cihaz teslimi yapılmamaktadır.</p>
            </div>

            {/* İmza Alanı */}
            <div className="grid grid-cols-2 gap-4 pt-4 text-center text-[10px]">
              <div className="border-t border-black pt-1">
                <div className="font-bold">Teslim Eden</div>
                <div className="text-gray-500">(Müşteri İmza)</div>
              </div>
              <div className="border-t border-black pt-1">
                <div className="font-bold">Teslim Alan</div>
                <div className="text-gray-500">(Osman Usta)</div>
              </div>
            </div>

            <div className="text-center text-[9px] text-gray-500 pt-2">
              *** Bizi tercih ettiğiniz için teşekkür ederiz ***
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
