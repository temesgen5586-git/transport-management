import React from 'react';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';

/**
 * FormCard – Card wrapper for forms with title, subtitle, and actions
 * 
 * @param {string} title - Form title
 * @param {string} subtitle - Form subtitle
 * @param {React.ReactNode} children - Form fields
 * @param {function} onSubmit - Submit handler
 * @param {function} onCancel - Cancel handler
 * @param {string} submitLabel - Submit button label
 * @param {string} cancelLabel - Cancel button label
 * @param {boolean} loading - Loading state
 * @param {string} className - Additional classes
 * 
 * Usage:
 *   <FormCard
 *     title="Create User"
 *     subtitle="Fill in the user details below"
 *     onSubmit={handleSubmit}
 *     onCancel={() => navigate(-1)}
 *     loading={isSubmitting}
 *   >
 *     <Input ... />
 *   </FormCard>
 */
const FormCard = ({
    title,
    subtitle,
    children,
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    loading = false,
    className = '',
    variant = 'default',
}) => {
    return (
        <GlassCard className={`p-6 ${className}`} variant={variant}>
            {title && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
                {children}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <GradientButton
                        type="submit"
                        variant="primary"
                        loading={loading}
                        className="flex-1"
                    >
                        {submitLabel}
                    </GradientButton>
                    {onCancel && (
                        <GradientButton
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            className="flex-1"
                        >
                            {cancelLabel}
                        </GradientButton>
                    )}
                </div>
            </form>
        </GlassCard>
    );
};

export default FormCard;