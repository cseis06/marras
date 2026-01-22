import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import gsap from "gsap";

// TYPES & INTERFACES
type InputVariant = "default" | "filled" | "outlined" | "underlined" | "glass";
type InputSize = "sm" | "md" | "lg";
type IconPosition = "left" | "right";

interface FloatingInputColors {
  background?: string;
  backgroundFocus?: string;
  text?: string;
  label?: string;
  labelActive?: string;
  border?: string;
  borderFocus?: string;
  placeholder?: string;
  icon?: string;
  iconFocus?: string;
  error?: string;
  success?: string;
}

interface FloatingInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  variant?: InputVariant;
  size?: InputSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  endIcon?: ReactNode;
  colors?: FloatingInputColors;
  error?: string;
  success?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  borderRadius?: number | string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  animationDuration?: number;
  disableAnimation?: boolean;
}

export interface FloatingInputRef {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  getInputElement: () => HTMLInputElement | null;
}

// DEFAULT THEME COLORS

const defaultColors: Required<FloatingInputColors> = {
  background: "#ffffff",
  backgroundFocus: "#ffffff",
  text: "#1f2937",
  label: "#6b7280",
  labelActive: "#3b82f6",
  border: "#d1d5db",
  borderFocus: "#3b82f6",
  placeholder: "#9ca3af",
  icon: "#6b7280",
  iconFocus: "#3b82f6",
  error: "#ef4444",
  success: "#22c55e",
};

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeConfig = {
  sm: {
    padding: "px-3 py-2",
    paddingWithIcon: "px-9",
    fontSize: "text-sm",
    labelSize: "text-sm",
    labelActiveSize: "text-xs",
    iconSize: 16,
    height: "h-10",
  },
  md: {
    padding: "px-4 py-3",
    paddingWithIcon: "px-11",
    fontSize: "text-base",
    labelSize: "text-base",
    labelActiveSize: "text-xs",
    iconSize: 20,
    height: "h-12",
  },
  lg: {
    padding: "px-5 py-4",
    paddingWithIcon: "px-14",
    fontSize: "text-lg",
    labelSize: "text-lg",
    labelActiveSize: "text-sm",
    iconSize: 24,
    height: "h-14",
  },
};

// ============================================================================
// FLOATING INPUT COMPONENT
// ============================================================================

export const FloatingInput = forwardRef<FloatingInputRef, FloatingInputProps>(
  (
    {
      label,
      variant = "default",
      size = "md",
      icon,
      iconPosition = "left",
      endIcon,
      colors = {},
      error,
      success,
      helperText,
      fullWidth = false,
      borderRadius = 12,
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
      animationDuration = 0.3,
      disableAnimation = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      disabled,
      className,
      ...inputProps
    },
    ref
  ) => {
    // Merge colors with defaults
    const mergedColors = { ...defaultColors, ...colors };

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const endIconRef = useRef<HTMLDivElement>(null);

    // State
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(
      (defaultValue as string) || ""
    );

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as string) : internalValue;
    const hasValue = currentValue.length > 0;
    const isActive = isFocused || hasValue;

    // Size config
    const sizeStyles = sizeConfig[size];

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      getValue: () => currentValue,
      setValue: (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
      },
      getInputElement: () => inputRef.current,
    }));

    // ========================================================================
    // GSAP ANIMATIONS
    // ========================================================================

    useEffect(() => {
      if (disableAnimation || !labelRef.current) return;

      const label = labelRef.current;

      if (isActive) {
        // Animate label to top
        gsap.to(label, {
          y: -24,
          scale: 0.75,
          duration: animationDuration,
          ease: "power2.out",
          color: error
            ? mergedColors.error
            : success
              ? mergedColors.success
              : mergedColors.labelActive,
        });
      } else {
        // Animate label back to center
        gsap.to(label, {
          y: 0,
          scale: 1,
          duration: animationDuration,
          ease: "power2.out",
          color: mergedColors.label,
        });
      }
    }, [
      isActive,
      disableAnimation,
      animationDuration,
      error,
      success,
      mergedColors.labelActive,
      mergedColors.label,
      mergedColors.error,
      mergedColors.success,
    ]);

    // Icon animation on focus
    useEffect(() => {
      if (disableAnimation) return;

      const targets = [iconRef.current, endIconRef.current].filter(Boolean);

      targets.forEach((target) => {
        if (target) {
          gsap.to(target, {
            color: isFocused ? mergedColors.iconFocus : mergedColors.icon,
            scale: isFocused ? 1.1 : 1,
            duration: animationDuration * 0.5,
            ease: "power2.out",
          });
        }
      });
    }, [
      isFocused,
      disableAnimation,
      animationDuration,
      mergedColors.iconFocus,
      mergedColors.icon,
    ]);

    // Container border animation
    useEffect(() => {
      if (disableAnimation || !containerRef.current) return;

      const borderColor = error
        ? mergedColors.error
        : success
          ? mergedColors.success
          : isFocused
            ? mergedColors.borderFocus
            : mergedColors.border;

      gsap.to(containerRef.current, {
        borderColor,
        boxShadow: isFocused
          ? `0 0 0 3px ${borderColor}25`
          : "0 0 0 0px transparent",
        duration: animationDuration * 0.5,
        ease: "power2.out",
      });
    }, [
      isFocused,
      error,
      success,
      disableAnimation,
      animationDuration,
      mergedColors.borderFocus,
      mergedColors.border,
      mergedColors.error,
      mergedColors.success,
    ]);

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    // ========================================================================
    // VARIANT STYLES
    // ========================================================================

    const getVariantStyles = (): string => {
      const baseStyles = "transition-all duration-200";

      switch (variant) {
        case "filled":
          return `${baseStyles} border-0 border-b-2`;
        case "outlined":
          return `${baseStyles} border-2`;
        case "underlined":
          return `${baseStyles} border-0 border-b-2 rounded-none`;
        case "glass":
          return `${baseStyles} border backdrop-blur-md`;
        default:
          return `${baseStyles} border`;
      }
    };

    // ========================================================================
    // COMPUTE STYLES
    // ========================================================================

    const borderRadiusStyle =
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

    const containerStyles: React.CSSProperties = {
      backgroundColor:
        variant === "glass"
          ? `${mergedColors.background}80`
          : variant === "filled"
            ? isFocused
              ? mergedColors.backgroundFocus
              : `${mergedColors.background}f0`
            : mergedColors.background,
      borderColor: error
        ? mergedColors.error
        : success
          ? mergedColors.success
          : isFocused
            ? mergedColors.borderFocus
            : mergedColors.border,
      borderRadius:
        variant === "underlined" ? "0" : borderRadiusStyle,
    };

    const inputStyles: React.CSSProperties = {
      color: mergedColors.text,
      backgroundColor: "transparent",
      fontWeight: "normal"
    };

    const labelStyles: React.CSSProperties = {
      color: isActive
        ? error
          ? mergedColors.error
          : success
            ? mergedColors.success
            : mergedColors.labelActive
        : mergedColors.label,
      transformOrigin: iconPosition === "left" && icon ? "left center" : "left center",
    };

    // Padding classes based on icons
    const getPaddingClasses = () => {
      let classes = "";

      if (icon && iconPosition === "left") {
        classes += size === "sm" ? " pl-9" : size === "lg" ? " pl-14" : " pl-11";
      } else {
        classes +=
          size === "sm" ? " pl-3" : size === "lg" ? " pl-5" : " pl-4";
      }

      if (endIcon || (icon && iconPosition === "right")) {
        classes += size === "sm" ? " pr-9" : size === "lg" ? " pr-14" : " pr-11";
      } else {
        classes +=
          size === "sm" ? " pr-3" : size === "lg" ? " pr-5" : " pr-4";
      }

      return classes;
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
      <div
        className={`relative ${fullWidth ? "w-full" : "w-72"} ${containerClassName}`}
      >
        {/* Main Input Container */}
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className={`
            relative flex items-center cursor-text
            ${getVariantStyles()}
            ${sizeStyles.height}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className || ""}
          `}
          style={containerStyles}
        >
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div
              ref={iconRef}
              className={`
                absolute left-3 flex items-center justify-center
                pointer-events-none z-10
              `}
              style={{ color: mergedColors.icon }}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
                    size: sizeStyles.iconSize,
                  })
                : icon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={inputRef}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              w-full h-full bg-transparent outline-none
              ${sizeStyles.fontSize}
              ${getPaddingClasses()}
              pt-4 pb-1
              disabled:cursor-not-allowed
              ${inputClassName}
            `}
            style={inputStyles}
            {...inputProps}
          />

          {/* Floating Label */}
          <span
            ref={labelRef}
            className={`
              absolute pointer-events-none
              ${sizeStyles.labelSize}
              ${icon && iconPosition === "left" ? (size === "sm" ? "left-9" : size === "lg" ? "left-14" : "left-11") : (size === "sm" ? "left-3" : size === "lg" ? "left-5" : "left-4")}
              font-medium select-none
              ${labelClassName}
            `}
            style={labelStyles}
          >
            {label}
          </span>

          {/* Right Icon */}
          {(endIcon || (icon && iconPosition === "right")) && (
            <div
              ref={endIconRef}
              className={`
                absolute right-3 flex items-center justify-center
                ${endIcon ? "cursor-pointer" : "pointer-events-none"}
                z-10
              `}
              style={{ color: mergedColors.icon }}
            >
              {endIcon
                ? React.isValidElement(endIcon)
                  ? React.cloneElement(endIcon as React.ReactElement<{ size?: number }>, {
                      size: sizeStyles.iconSize,
                    })
                  : endIcon
                : icon && iconPosition === "right"
                  ? React.isValidElement(icon)
                    ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
                        size: sizeStyles.iconSize,
                      })
                    : icon
                  : null}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(helperText || error) && (
          <p
            className={`
              mt-1.5 text-xs font-medium
              ${error ? "" : ""}
            `}
            style={{
              color: error ? mergedColors.error : mergedColors.label,
            }}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;