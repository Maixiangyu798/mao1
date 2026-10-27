import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeadingProps {
  title: string
  description?: string
  link?: { label: string; to: string }
  action?: ReactNode
}

export function SectionHeading({ title, description, link, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
      {link && (
        <Link to={link.to} className="section-link">
          {link.label}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}
