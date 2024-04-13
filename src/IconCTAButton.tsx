import { Icon } from "@iconify/react";
import { ButtonHTMLAttributes } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
type IconCTAButtonProps = {
  value?: string;
  selected?: boolean;
  iconName?: string;
  className?: string;
  iconClassName?: string;
} & ButtonProps;
export function IconCTAButton(props: IconCTAButtonProps) {
  const {
    value,
    iconName,
    className,
    iconClassName,
    ...rest
  } = props;
  const buttonClassName = `inline-flex border border-borderColor items-center gap-x-1 rounded-sm font-medium ${className} "border-none"`;
  return (
    <button {...rest} className={buttonClassName} type={"button"}>
      {iconName && (
        <Icon
          aria-hidden="true"
          icon={iconName}
          className={iconClassName}
          height={18}
          width={18}
        />
      )}
      {value}
    </button>
  );
}