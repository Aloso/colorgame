import { ButtonHTMLAttributes, ReactNode, RefAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function BigButton({ children, className, ...rest }: BigButtonProps) {
  return (
    <button className={`big ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}

export function BigLink({
  children,
  className,
  ...rest
}: LinkProps & RefAttributes<HTMLAnchorElement>) {
  return (
    <Link className={`big ${className ?? ''}`} {...rest}>
      {children}
    </Link>
  )
}
