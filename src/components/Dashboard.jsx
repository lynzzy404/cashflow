import React from 'react';
import { useBalance } from '../hooks/useBalance';
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Calendar, CreditCard, Banknote, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import clsx from 'clsx';

export default function Dashboard({ onAddTransaction, onViewWallets, activeFundId }) {
  const { totalBalance, filteredBalance, walletBalances, activeFund, incomeThisMonth, expenseThisMonth, recentTransactions } = useBalance(activeFundId);

  return (
    <div className="w-full px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5 pb-24 bg-white">
      {/* Total Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-200/50">
        <div className="absolute top-0 right-0 -mr-8 sm:-mr-4 -mt-8 sm:-mt-4 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 sm:w-24 h-20 sm:h-24 bg-black/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-emerald-100 text-xs mb-1">
            {activeFund ? (
              <>
                <span className="text-sm">{activeFund.icon}</span>
                <span className="truncate">Saldo {activeFund.name}</span>
              </>
            ) : (
              <>
                <Wallet size={14} />
                <span className="truncate">Total Saldo</span>
              </>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3 break-words">
            <span className="text-base sm:text-lg opacity-80 mr-1.5">Rp</span>
            {filteredBalance.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] bg-white/20 w-fit px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
             <Calendar size={10} className="flex-shrink-0" />
             <span className="truncate">{format(new Date(), 'EEEE, dd MMM yyyy', { locale: id })}</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase">Masuk</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-slate-800 break-words">Rp {incomeThisMonth.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowDownLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase">Keluar</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-slate-800 break-words">Rp {expenseThisMonth.toLocaleString('id-ID')}</div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Wallet size={16} className="sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">Saldo Dompet</span>
          </h3>
          <button onClick={onViewWallets} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 flex-shrink-0 whitespace-nowrap">
            Kelola <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="w-full space-y-2">
          {walletBalances?.slice(0, 3).map(wallet => (
            <div key={wallet.id} className="w-full bg-white p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-100 flex justify-between items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={clsx(
                  "p-1.5 sm:p-2 rounded-lg flex-shrink-0",
                  wallet.type === 'bank' ? "bg-sky-50 text-sky-600" : 
                  wallet.type === 'ewallet' ? "bg-teal-50 text-teal-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {wallet.type === 'bank' ? <CreditCard size={14} className="sm:w-4 sm:h-4" /> : 
                   wallet.type === 'ewallet' ? <Wallet size={14} className="sm:w-4 sm:h-4" /> : <Banknote size={14} className="sm:w-4 sm:h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-700 text-xs sm:text-sm truncate">{wallet.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 capitalize">{wallet.type === 'ewallet' ? 'E-Wallet' : wallet.type}</div>
                </div>
              </div>
              <span className={clsx("font-semibold text-xs sm:text-sm flex-shrink-0 whitespace-nowrap", wallet.balance >= 0 ? "text-slate-800" : "text-rose-600")}>
                Rp {wallet.balance.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
          {walletBalances?.length > 3 && (
            <button onClick={onViewWallets} className="w-full text-center text-xs text-slate-400 hover:text-emerald-600 py-2">
              +{walletBalances.length - 3} dompet lainnya
            </button>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
           <h3 className="font-semibold text-slate-800 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 min-w-0">
             <TrendingUp size={16} className="sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />
             <span className="truncate">Transaksi Terakhir</span>
           </h3>
        </div>
        
        <div className="w-full space-y-2">
          {recentTransactions.length === 0 ? (
            <div className="text-center text-slate-400 py-8 sm:py-10 bg-white rounded-lg sm:rounded-xl border border-dashed border-slate-200">
              <p className="text-xs sm:text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            recentTransactions.map(tx => (
              <div key={tx.id} className="w-full bg-white p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-100">
                {/* Top Row - Category, Icon, Amount */}
                <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                      tx.category.includes('Transfer') ? 'bg-teal-50 text-teal-600' :
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.category.includes('Transfer') ? <Wallet size={14} className="sm:w-4 sm:h-4" /> : 
                       tx.type === 'income' ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownLeft size={14} className="sm:w-4 sm:h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 text-xs sm:text-sm truncate">{tx.category}</div>
                    </div>
                  </div>
                  <span className={`font-semibold text-xs sm:text-sm flex-shrink-0 whitespace-nowrap ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                
                {/* Bottom Row - Wallet, Dana, Tanggal, Waktu, Catatan */}
                <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1 flex-wrap pl-8 sm:pl-9">
                  <span className="px-1 py-0.5 bg-slate-50 rounded text-slate-500 truncate max-w-[80px]">{tx.walletName}</span>
                  <span>•</span>
                  <span className="px-1 py-0.5 bg-emerald-50 rounded text-emerald-600 truncate max-w-[70px]">{tx.fundIcon} {tx.fundName}</span>
                  <span>•</span>
                  <span>{format(new Date(tx.date), 'dd MMM HH:mm', { locale: id })}</span>
                  {tx.note && (
                    <>
                      <span>•</span>
                      <span className="italic truncate max-w-[100px]">{tx.note}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
