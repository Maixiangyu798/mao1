import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'

interface BrandProps {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link to="/" className="brand" aria-label="奶蛙 Python 首页">
      <span className="brand-mark" aria-hidden="true">
        <Code2 size={19} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="brand-name">
          奶蛙 <strong>Python</strong>
        </span>
      )}
    </Link>
  )
}
