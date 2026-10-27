import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CircleCheckBig, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/utils/cn'

type ToastTone = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  text: string
  tone: ToastTone
}

interface ToastContextValue {
  showToast: (text: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const icons = {
  success: CircleCheckBig,
  error: TriangleAlert,
  info: Info,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  const showToast = useCallback((text: string, tone: ToastTone = 'success') => {
    window.clearTimeout(timerRef.current)
    setToast({ id: Date.now(), text, tone })
    timerRef.current = window.setTimeout(
      () => setToast(null),
      tone === 'error' ? 3200 : 2400,
    )
  }, [])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const value = useMemo(() => ({ showToast }), [showToast])
  const Icon = toast ? icons[toast.tone] : null

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="toast-region" aria-live="polite" aria-atomic="true">
          <div className={cn('toast', `toast-${toast.tone}`)} role="status">
            {Icon && <Icon size={18} strokeWidth={2} aria-hidden="true" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
