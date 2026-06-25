import React from 'react';
import GradientButton from '../common/GradientButton';

/**
 * Button – Wrapper around GradientButton with form-specific props
 * 
 * @param {React.ReactNode} children - Button text/content
 * @param {string} type - 'button', 'submit', 'reset'
 * @param {string} variant - 'primary', 'success', 'danger', 'warning', 'secondary'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} loading - Loading state
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} icon - Icon component
 * @param {string} className - Additional classes
 * 
 * Usage:
 *   <Button variant="primary" type="submit" loading={isSubmitting}>
 *     Submit
 *   </Button>
 */
const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <GradientButton
            type={type}
            variant={variant}
            size={size}
            loading={loading}
            disabled={disabled}
            onClick={onClick}
            icon={Icon}
            className={className}
            {...props}
        >
            {children}
        </GradientButton>
    );
};

export default Button;