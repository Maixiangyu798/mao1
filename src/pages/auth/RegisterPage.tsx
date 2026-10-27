import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Smartphone } from 'lucide-react'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { cn } from '@/utils/cn'

type RegisterMode = 'phone' | 'email'
type Policy = 'terms' | 'privacy' | null

const phonePattern = /^1[3-9]\d{9}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function passwordStrength(password: string) {
  if (!password) return { score: 0, label: '等待输入', tone: 'empty' }
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password)
  const valid = password.length >= 8 && password.length <= 20 && hasLetter && hasNumber && !/\s/.test(password)
  if (!valid) return { score: 1, label: '偏弱', tone: 'weak' }
  if (hasSpecial && password.length >= 12) return { score: 3, label: '强', tone: 'strong' }
  return { score: 2, label: '中', tone: 'medium' }
}

export function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<RegisterMode>('phone')
  const [account, setAccount] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [policy, setPolicy] = useState<Policy>(null)

  const strength = useMemo(() => passwordStrength(password), [password])
  const isReady =
    (mode === 'phone' ? phonePattern.test(account) : emailPattern.test(account)) &&
    /^\d{6}$/.test(code) &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    agreed

  useEffect(() => {
    if (!countdown) return
    const timer = window.setInterval(() => setCountdown((current) => current - 1), 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  const switchMode = (nextMode: RegisterMode) => {
    setMode(nextMode)
    setAccount('')
    setCode('')
    setErrors({})
  }

  const sendCode = () => {
    const valid = mode === 'phone' ? phonePattern.test(account) : emailPattern.test(account)
    if (!valid) {
      setErrors({
        account: mode === 'phone' ? '手机号格式不正确，请检查后重试' : '邮箱格式不正确',
      })
      return
    }
    setErrors({})
    setCountdown(60)
    showToast(`验证码已发送至 ${mode === 'phone' ? '手机' : '邮箱'}（演示：任意 6 位数字）`, 'info')
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (mode === 'phone' && !phonePattern.test(account)) {
      nextErrors.account = '手机号格式不正确，请检查后重试'
    }
    if (mode === 'email' && !emailPattern.test(account)) {
      nextErrors.account = '邮箱格式不正确'
    }
    if (!/^\d{6}$/.test(code)) nextErrors.code = '验证码不正确，请重新输入'
    if (password.length < 8 || password.length > 20 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      nextErrors.password = '密码需 8-20 位，且包含字母和数字'
    }
    if (!agreed) nextErrors.agreed = '请先阅读并同意用户协议和隐私政策'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setLoading(true)
    window.setTimeout(() => {
      register(account)
      setLoading(false)
      showToast('注册成功，先让奶蛙认识一下你吧～')
      navigate('/onboarding', { replace: true })
    }, 600)
  }

  return (
    <div className="auth-page page-container">
      <div className="auth-layout">
        <aside className="auth-aside">
          <span className="auth-aside-badge">你的第一行代码，从这里开始</span>
          <div className="auth-frog-frame auth-frog-frame-fun">
            <img src="/frog/belly-laugh.png" alt="奶蛙捧着肚子开心地笑" />
          </div>
          <h1>嗨，新来的学习搭子！</h1>
          <p>
            不用有基础，也不用准备好一切。
            <br />
            带着一点好奇心，就够了。
          </p>
        </aside>

        <section className="auth-card" aria-labelledby="register-title">
          <h2 id="register-title">加入奶蛙 Python</h2>
          <p className="auth-card-subtitle">创建免费账号，保存每一点进步。</p>

          <div className="auth-tabs" role="tablist" aria-label="注册方式">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'phone'}
              className={cn('auth-tab', mode === 'phone' && 'is-active')}
              onClick={() => switchMode('phone')}
            >
              手机号注册
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'email'}
              className={cn('auth-tab', mode === 'email' && 'is-active')}
              onClick={() => switchMode('email')}
            >
              邮箱注册
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Field
              label={mode === 'phone' ? '手机号' : '邮箱'}
              name="account"
              type={mode === 'phone' ? 'tel' : 'email'}
              placeholder={mode === 'phone' ? '请输入手机号' : '请输入邮箱地址'}
              autoComplete={mode === 'phone' ? 'tel' : 'email'}
              value={account}
              error={errors.account}
              leading={mode === 'phone' ? <Smartphone size={17} /> : <Mail size={17} />}
              onChange={(event) => {
                setAccount(event.target.value)
                if (errors.account) setErrors((current) => ({ ...current, account: '' }))
              }}
            />

            <Field
              label="验证码"
              name="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="6 位验证码"
              value={code}
              error={errors.code}
              leading={<ShieldCheck size={17} />}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                if (errors.code) setErrors((current) => ({ ...current, code: '' }))
              }}
              trailing={
                <button
                  type="button"
                  className="input-code-button"
                  disabled={countdown > 0}
                  onClick={sendCode}
                >
                  {countdown ? `${countdown}s 后重发` : '获取验证码'}
                </button>
              }
            />

            <Field
              label="密码"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="设置一个 8-20 位的密码"
              autoComplete="new-password"
              value={password}
              error={errors.password}
              leading={<LockKeyhole size={17} />}
              onChange={(event) => {
                setPassword(event.target.value)
                if (errors.password) setErrors((current) => ({ ...current, password: '' }))
              }}
              trailing={
                <button
                  type="button"
                  className="input-icon-button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="password-strength">
              <div className={cn('strength-bars', `strength-${strength.tone}`)}>
                {[0, 1, 2].map((bar) => (
                  <span key={bar} className={bar < strength.score ? 'is-filled' : ''} />
                ))}
              </div>
              <span>
                强度：{strength.label} · 8–20 位，包含字母与数字
              </span>
            </div>

            <label className={cn('checkbox-label agreement-label', errors.agreed && 'has-error')}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => {
                  setAgreed(event.target.checked)
                  if (errors.agreed) setErrors((current) => ({ ...current, agreed: '' }))
                }}
              />
              <span>
                我已阅读并同意
                <button type="button" className="inline-text-button" onClick={() => setPolicy('terms')}>
                  《用户协议》
                </button>
                和
                <button type="button" className="inline-text-button" onClick={() => setPolicy('privacy')}>
                  《隐私政策》
                </button>
              </span>
            </label>
            {errors.agreed && <p className="field-error agreement-error">{errors.agreed}</p>}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!isReady}
              className="auth-submit"
            >
              免费注册
            </Button>
          </form>

          <p className="auth-switch">
            已有账号？{' '}
            <Link to="/login" className="auth-strong-link">
              去登录 →
            </Link>
          </p>

          {errors.agreed && (
            <InfoBanner tone="warning" className="auth-banner">
              注册前需要同意用户协议与隐私政策。
            </InfoBanner>
          )}
        </section>
      </div>

      <Modal
        open={policy !== null}
        onClose={() => setPolicy(null)}
        title={policy === 'terms' ? '用户协议' : '隐私政策'}
        size="md"
        footer={<Button onClick={() => setPolicy(null)}>我知道啦</Button>}
      >
        <div className="prose">
          <p>
            本原型用于课程作业与交互演示。注册时填写的手机号、邮箱与密码不会被发送或保存到真实服务器；学习状态保存在当前浏览器本地。
          </p>
          <p>
            请使用演示验证码（任意 6 位数字）完成注册。注册成功后，你会进入新手引导并开始自己的学习路线。
          </p>
        </div>
      </Modal>
    </div>
  )
}
