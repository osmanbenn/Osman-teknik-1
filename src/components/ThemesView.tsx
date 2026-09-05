import React from 'react';
import { Palette, Check, Sparkles, Sun, Moon, Monitor, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AppThemeConfig } from '../types';

interface ThemesViewProps {
  themes: AppThemeConfig[];
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const ThemesView: React.FC<ThemesViewProps> = ({
  themes,
  activeThemeId,
  onSelectTheme,
  darkMode,
  setDarkMode
}) => {
  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Görsel Temalar & Renk Paletleri</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              KİŞİSELLEŞTİRME
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dükkânınızın ve çalışma ortamınızın göz konforuna uygun profesyonel renk paletini seçin
          </p>
        </div>

        {/* Hızlı Açık/Koyu Mod Düğmesi */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              !darkMode
                ? 'bg-amber-100 text-amber-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Gündüz (Açık)</span>
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              darkMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Gece (Koyu)</span>
          </button>
        </div>
      </div>

      {/* CANLI TEMA ÖNİZLEME VİTRİNİ */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Aktif Tema Canlı Önizleme: <span className="text-indigo-600 dark:text-indigo-400">{activeTheme.name}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400">Anında uygulanır, ayarlarınız kaydedilir</span>
        </div>

        {/* Demo Mini Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Örnek Buton</span>
            <button
              style={{ backgroundColor: activeTheme.primaryColorHex }}
              className="w-full py-2 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition"
            >
              Hızlı İşlem Yap
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vurgu & Metin</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Kabul Fişi</span>
              <span
                style={{ color: activeTheme.primaryColorHex }}
                className="text-xs font-black font-mono"
              >
                TR-2026-2157
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Renk Tonu</span>
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: activeTheme.primaryColorHex }}
                className="w-6 h-6 rounded-lg shadow-xs"
              ></div>
              <div
                style={{ backgroundColor: activeTheme.secondaryColorHex }}
                className="w-6 h-6 rounded-lg shadow-xs"
              ></div>
              <span className="text-xs font-mono font-semibold text-slate-500">{activeTheme.primaryColorHex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TEMA SEÇİM KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map(theme => {
          const isSelected = theme.id === activeThemeId;

          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`p-5 rounded-3xl border text-left cursor-pointer transition relative overflow-hidden group ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-400 bg-white dark:bg-slate-800/95 ring-2 ring-indigo-500/20 shadow-lg'
                  : 'border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
              }`}
            >
              {/* Badge & Check Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {theme.badge}
                </span>

                {isSelected ? (
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm animate-scaleUp">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    Seç
                  </span>
                )}
              </div>

              {/* Renk Swatch'ları */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  style={{ backgroundColor: theme.primaryColorHex }}
                  className="w-8 h-8 rounded-xl shadow-xs"
                ></div>
                <div
                  style={{ backgroundColor: theme.secondaryColorHex }}
                  className="w-8 h-8 rounded-xl shadow-xs"
                ></div>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    style={{
                      width: '65%',
                      backgroundColor: theme.primaryColorHex
                    }}
                    className="h-full rounded-full"
                  ></div>
                </div>
              </div>

              {/* Başlık ve Açıklama */}
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1">
                {theme.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {theme.description}
              </p>

              {/* Uygula Butonu */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  {isSelected ? '✓ Aktif Tema' : 'Bu Temaya Geç'}
                </span>
                <span
                  style={{ color: theme.primaryColorHex }}
                  className="font-extrabold"
                >
                  Uygula →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
