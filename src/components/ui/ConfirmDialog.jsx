import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Modern confirm dialog component matching app theme
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {string} props.type - 'danger' | 'warning' | 'info'
 * @param {Function} props.onConfirm - Confirm callback
 * @param {Function} props.onCancel - Cancel callback
 */
export default function ConfirmDialog({
    isOpen,
    title = 'Konfirmasi',
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'danger',
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    const iconConfig = {
        danger: { Icon: Trash2, bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
        warning: { Icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
        info: { Icon: AlertTriangle, bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' }
    };

    const { Icon, bg, text } = iconConfig[type] || iconConfig.danger;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                    <X size={16} className="sm:w-4 sm:h-4" />
                </button>

                {/* Content */}
                <div className="p-4 sm:p-6 pt-6 sm:pt-8 text-center">
                    {/* Icon */}
                    <div className={clsx("w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4", bg)}>
                        <Icon size={20} className={clsx(text, "sm:w-6 sm:h-6")} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5 sm:mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3 p-3 sm:p-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={clsx(
                            "flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-colors",
                            type === 'danger'
                                ? "bg-rose-600 text-white hover:bg-rose-700"
                                : "bg-amber-600 text-white hover:bg-amber-700"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
