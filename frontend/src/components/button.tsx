import React from "react";

interface ButtonProps {
    className?: string,
    type?: "button" | "reset" | "submit" | undefined,
    children?: string,
    disabled?: boolean
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { className, type, children, disabled } = props;
    return <button className={className} type={type} disabled={disabled}>{children}</button>
}