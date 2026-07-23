import { type ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => (
    <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
  )
);
Button.displayName = "Button";