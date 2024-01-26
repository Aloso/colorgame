import { ReactNode } from 'react'

interface TextWidgetProps {
  children: ReactNode
}

export function TextWidget({ children }: TextWidgetProps) {
  return <div className="widget text-widget screen-center">{children}</div>
}
