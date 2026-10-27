import type { ReactNode } from 'react'

interface StatusPageProps {
  code: string
  tag: string
  title: string
  description: ReactNode
  image: string
  imageAlt: string
  actions: ReactNode
  footnote: string
}

export function StatusPage({
  code,
  tag,
  title,
  description,
  image,
  imageAlt,
  actions,
  footnote,
}: StatusPageProps) {
  return (
    <div className="status-page page-container">
      <div className="status-visual">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="status-copy">
        <span className="status-tag">
          {code} · {tag}
        </span>
        <h1>{title}</h1>
        <div className="status-description">{description}</div>
        <div className="status-actions">{actions}</div>
        <p className="status-footnote">{footnote}</p>
      </div>
    </div>
  )
}
