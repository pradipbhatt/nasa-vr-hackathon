import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

/**
 * Reusable button component that uses Tailwind theme colors
 */
export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold
        bg-secondary text-text hover:bg-primary hover:text-icon
        transition-colors duration-300
        ${className}
      `}
    >
      {children}
    </button>
  );
}
