import React, { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, Wallet, Search, Edit3, Trash2, Check } from 'lucide-react';
import { useBalance } from '../hooks/useBalance';
import { useToast } from '../hooks/useToast';
import { db } from '../db';
import TransactionForm from './TransactionForm';
import Toast from './Toast';
import ConfirmDialog from './ui/ConfirmDialog';
import clsx from 'clsx';

export default function TransactionHistory({ activeFundId }) {
  const { allTransactions } = useBalance(activeFundId);
  const transactions = allTransactions
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 100);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSelectAll = () => {
    if (selectedIds.size === transactions?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(transactions?.map(tx => tx.id) || []));
    }
  };

  const handleSelectTransaction = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    try {
      // Delete selected transactions from database
      for (const id of selectedIds) {
        await db.transactions.delete(id);
      }
      
      const deletedCount = selectedIds.size;
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
      showToast(`${deletedCount} transaksi berhasil dihapus`, 'success');
    } catch (error) {
      showToast('Gagal menghapus transaksi', 'error');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-5 py-4 sm:py-5 pb-24 sm:pb-24 space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <label className="relative flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={selectedIds.size > 0 && selectedIds.size === transactions?.length}
              onChange={handleSelectAll}
              className={clsx(
                "appearance-none w-5 h-5 border-2 rounded-lg bg-white cursor-pointer hover:border-emerald-500 transition-colors flex-shrink-0",
                selectedIds.size > 0 && selectedIds.size === transactions?.length
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-emerald-300'
              )}
            />
            {selectedIds.size > 0 && selectedIds.size === transactions?.length && (
              <Check size={12} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-bold text-white" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'}} />
            )}
          </label>
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
            {selectedIds.size > 0 ? `${selectedIds.size} dipilih` : 'Riwayat'}
          </h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 sm:p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors flex items-center gap-1 sm:gap-1.5 flex-shrink-0 text-xs sm:text-sm"
            >
              <Trash2 size={16} className="flex-shrink-0" />
              <span className="font-medium hidden sm:inline">Hapus</span>
            </button>
          )}
          <div className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg text-slate-400 flex-shrink-0">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="w-full space-y-2">
        {transactions?.map(tx => (
          <div
            key={tx.id}
            className="w-full bg-white border border-slate-100 rounded-lg sm:rounded-xl hover:border-slate-200 transition-colors"
            onClick={() => {
              if (selectedIds.size > 0) {
                handleSelectTransaction(tx.id);
              } else {
                setEditingTransaction(tx);
              }
            }}
          >
            {/* Mobile Layout (single column) */}
            <div className="sm:hidden p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <label className="relative flex items-center cursor-pointer mt-1 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tx.id)}
                      onChange={() => handleSelectTransaction(tx.id)}
                      onClick={(e) => e.stopPropagation()}
                      className={clsx(
                        "appearance-none w-5 h-5 border-2 rounded-lg bg-white cursor-pointer hover:border-emerald-500 transition-colors flex-shrink-0",
                        selectedIds.has(tx.id)
                          ? 'border-emerald-600 bg-emerald-600'
                          : 'border-emerald-300'
                      )}
                    />
                    {selectedIds.has(tx.id) && (
                      <Check size={12} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-bold text-white" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'}} />
                    )}
                  </label>
                  <div className={clsx("p-2 rounded-lg flex-shrink-0",
                    tx.category.includes('Transfer') ? 'bg-teal-50 text-teal-600' :
                      tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}>
                    {tx.category.includes('Transfer') ? <Wallet size={16} /> :
                      tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800 text-sm truncate">{tx.category}</div>
                    <div className="text-xs text-slate-500 mt-1">{tx.walletName}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={clsx("font-semibold text-sm whitespace-nowrap",
                    tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingTransaction(tx); }}
                    className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 flex-wrap ml-9">
                <span className="px-1.5 py-0.5 bg-slate-50 rounded">{tx.fundIcon} {tx.fundName}</span>
                <span>•</span>
                <span>{format(new Date(tx.date), 'dd MMM yyyy HH:mm', { locale: id })}</span>
                {tx.note && (
                  <>
                    <span>•</span>
                    <span className="italic truncate max-w-[150px]">{tx.note}</span>
                  </>
                )}
              </div>
            </div>

            {/* Desktop Layout (flex) */}
            <div className="hidden sm:flex p-3.5 items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <label className="relative flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(tx.id)}
                    onChange={() => handleSelectTransaction(tx.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      "appearance-none w-5 h-5 border-2 rounded-lg bg-white cursor-pointer hover:border-emerald-500 transition-colors flex-shrink-0",
                      selectedIds.has(tx.id)
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-emerald-300'
                    )}
                  />
                  {selectedIds.has(tx.id) && (
                    <Check size={12} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-bold text-white" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'}} />
                  )}
                </label>
                <div className={clsx("p-2 rounded-lg flex-shrink-0",
                  tx.category.includes('Transfer') ? 'bg-teal-50 text-teal-600' :
                    tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                )}>
                  {tx.category.includes('Transfer') ? <Wallet size={16} /> :
                    tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-800 text-sm">{tx.category}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 flex-wrap">
                    <span className="px-1.5 py-0.5 bg-slate-50 rounded text-slate-500">{tx.walletName}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 rounded text-emerald-600">{tx.fundIcon} {tx.fundName}</span>
                    <span>•</span>
                    <span>{format(new Date(tx.date), 'dd MMM yyyy HH:mm', { locale: id })}</span>
                    {tx.note && (
                      <>
                        <span>•</span>
                        <span className="italic truncate max-w-[150px]">{tx.note}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={clsx("font-semibold text-sm whitespace-nowrap",
                  tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingTransaction(tx); }}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {transactions?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-slate-300">
            <div className="p-3 bg-slate-50 rounded-full mb-3">
              <Search size={24} />
            </div>
            <p className="text-sm">Belum ada transaksi.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionForm
          editData={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={() => setEditingTransaction(null)}
          activeFundId={activeFundId}
          onShowToast={showToast}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Hapus Transaksi?"
        message={`${selectedIds.size} transaksi akan dihapus. Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
        onConfirm={handleDeleteSelected}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
