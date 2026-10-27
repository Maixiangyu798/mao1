import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Check, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Field } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import { cn } from '@/utils/cn'

const steps = ['验证账号', '设置新密码', '完成']

export function ForgotPasswordPage() {
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [account, setAccount] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!countdown) return
    const timer = window.setInterval(() => setCountdown((current) => current - 1), 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  const maskedAccount =
    account.includes('@') || account.length < 7
      ? account
      : `${account.slice(0, 3)} **** ${account.slice(-4)}`

  const sendCode = () => {
    if (!account.trim()) {
      setError('请先输入注册时使用的手机号或邮箱')
      return
    }
    setError('')
    setCountdown(60)
    showToast('验证码已发送（演示：任意 6 位数字）', 'info')
  }

  const handleVerify = (event: FormEvent) => {
    event.preventDefault()
    if (!account.trim()) {
      setError('请输入注册时使用的手机号或邮箱')
      return
    }
    if (!/^\d{6}$/.test(code)) {
      setError('验证码不正确或已过期')
      return
    }
    setError('')
    setStep(1)
  }

  const handleReset = (event: FormEvent) => {
    event.preventDefault()
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || password.length < 8) {
      setError('密码需 8-20 位，且包含字母和数字')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setStep(2)
      showToast('密码已更新，请使用新密码登录')
    }, 500)
  }

  return (
    <div className="forgot-page page-container">
      <header className="forgot-header">
        <h1>把账号找回来</h1>
        <p>别担心，你的学习进度还在这里。</p>
      </header>

      <ol className="stepper" aria-label="找回密码步骤">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              'stepper-item',
              index < step && 'is-complete',
              index === step && 'is-current',
            )}
            aria-current={index === step ? 'step' : undefined}
          >
            <span className="stepper-index">
              {index < step ? <Check size={14} strokeWidth={2.5} /> : index + 1}
            </span>
            <span className="stepper-label">{label}</span>
            {index < steps.length - 1 && <span className="stepper-line" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <section className="forgot-card">
        {step === 0 && (
          <>
            <h2>验证你的账号</h2>
            <form onSubmit={handleVerify} noValidate>
              <Field
                label="手机号或邮箱"
                name="forget-account"
                placeholder="请输入注册时使用的手机号或邮箱"
                value={account}
                onChange={(event) => {
                  setAccount(event.target.value)
                  if (error) setError('')
                }}
              />
              <Field
                label="6 位验证码"
                name="forget-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="请输入验证码"
                value={code}
                error={error}
                hint={
                  countdown > 0 && !error
                    ? `验证码已发送至 ${maskedAccount}`
                    : undefined
                }
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  if (error) setError('')
                }}
                trailing={
                  <button
                    type="button"
                    className="input-code-button"
                    disabled={countdown > 0}
                    onClick={sendCode}
                  >
                    {countdown ? `${countdown} 秒后重发` : '获取验证码'}
                  </button>
                }
              />
              <Button type="submit" fullWidth className="forgot-submit">
                验证并继续
              </Button>
            </form>
            <Link to="/login" className="forgot-back-link">
              想起密码了？返回登录 →
            </Link>
          </>
        )}

        {step === 1 && (
          <>
            <h2>设置一个新密码</h2>
            <span className="account-confirm-chip">
              账号验证成功 · {maskedAccount || '你的账号'}
            </span>
            <form onSubmit={handleReset} noValidate>
              <Field
                label="新密码"
                name="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入 8-20 位新密码"
                autoComplete="new-password"
                value={password}
                leading={<LockKeyhole size={17} />}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) setError('')
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
              <Field
                label="确认新密码"
                name="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="请再次输入新密码"
                autoComplete="new-password"
                value={confirmPassword}
                error={error}
                leading={<ShieldCheck size={17} />}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  if (error) setError('')
                }}
                trailing={
                  <button
                    type="button"
                    className="input-icon-button"
                    onClick={() => setShowConfirm((visible) => !visible)}
                    aria-label={showConfirm ? '隐藏密码' : '显示密码'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <p className="forgot-hint">使用 8–20 位字母和数字组合，请勿与旧密码相同。</p>
              <Button type="submit" fullWidth loading={loading} className="forgot-submit">
                确认重置密码
              </Button>
            </form>
            <button type="button" className="forgot-text-step" onClick={() => setStep(0)}>
              返回上一步
            </button>
            <Link to="/login" className="forgot-back-link">
              想起密码了？返回登录 →
            </Link>
          </>
        )}

        {step === 2 && (
          <div className="forgot-success">
            <div className="forgot-success-image">
              <img src="/frog/belly-laugh.png" alt="奶蛙开心地庆祝密码重置成功" />
            </div>
            <h2>密码已重置，欢迎回来！</h2>
            <p>
              使用新密码登录，就可以接着学习啦。
              <br />
              你的课程、练习与收藏都还在。
            </p>
            <Button to="/login" fullWidth>
              返回登录
            </Button>
            <p className="forgot-success-note">奶蛙已经准备好，陪你继续出发。</p>
          </div>
        )}
      </section>

      <p className="forgot-security">
        <ShieldCheck size={15} /> 我们只会用验证码确认你的身份。
      </p>
    </div>
  )
}
