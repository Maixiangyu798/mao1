import { useState } from 'react'
import { Clock3, KeyRound, LogOut, Pencil, Smartphone } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { Switch } from '@/components/ui/Switch'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { goalOptions } from '@/data/mockData'
import type { GoalKey, UserPreferences } from '@/types'
import { cn } from '@/utils/cn'

interface PasswordFields {
  current: string
  next: string
  confirm: string
}

export function SettingsPage() {
  const { user, updateProfile, updatePreferences, logout } = useAuth()
  const { showToast } = useToast()

  const [editOpen, setEditOpen] = useState(false)
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [editGoals, setEditGoals] = useState<GoalKey[]>(user?.goals ?? [])
  const [profileError, setProfileError] = useState('')

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordFields, setPasswordFields] = useState<PasswordFields>({
    current: '',
    next: '',
    confirm: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const [phoneOpen, setPhoneOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [maskedPhone, setMaskedPhone] = useState('138 **** 0826')

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(
    () =>
      user?.preferences ?? {
        lessonFontSize: 14,
        reminderEnabled: true,
        reminderTime: '20:00',
        achievementNotify: true,
        defaultHome: 'home',
      },
  )

  if (!user) return null

  const openProfileEditor = () => {
    setNickname(user.nickname)
    setBio(user.bio)
    setEditGoals(user.goals)
    setProfileError('')
    setEditOpen(true)
  }

  const toggleEditGoal = (goal: GoalKey) => {
    if (editGoals.includes(goal)) {
      setEditGoals(editGoals.filter((item) => item !== goal))
      return
    }
    if (goal === 'interest') {
      setEditGoals(['interest'])
      return
    }
    const withoutInterest = editGoals.filter((item) => item !== 'interest')
    if (withoutInterest.length >= 2) {
      showToast('最多选择 2 项学习目标', 'info')
      return
    }
    setEditGoals([...withoutInterest, goal])
  }

  const saveProfile = () => {
    const nextNickname = nickname.trim()
    if (!nextNickname) {
      setProfileError('昵称不能为空')
      return
    }
    if (nextNickname.length > 16) {
      setProfileError('昵称最多 16 个字符')
      return
    }
    updateProfile({
      nickname: nextNickname,
      bio: bio.trim().slice(0, 60),
      goals: editGoals,
    })
    setEditOpen(false)
    showToast('个人资料已更新', 'success')
  }

  const savePassword = () => {
    const nextErrors: Record<string, string> = {}
    if (!passwordFields.current) nextErrors.current = '请输入当前密码'
    if (passwordFields.next.length < 8) nextErrors.next = '新密码至少 8 位'
    else if (!/[A-Za-z]/.test(passwordFields.next) || !/\d/.test(passwordFields.next)) {
      nextErrors.next = '新密码需要同时包含字母和数字'
    }
    if (passwordFields.confirm !== passwordFields.next) {
      nextErrors.confirm = '两次输入的新密码不一致'
    }
    setPasswordErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setPasswordOpen(false)
    setPasswordFields({ current: '', next: '', confirm: '' })
    showToast('密码修改成功（原型演示）', 'success')
  }

  const savePhone = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setPhoneError('请输入 11 位有效手机号')
      return
    }
    setMaskedPhone(`${phone.slice(0, 3)} **** ${phone.slice(-4)}`)
    setPhoneOpen(false)
    setPhone('')
    setPhoneError('')
    showToast('手机号已更新（原型演示）', 'success')
  }

  const savePreferences = () => {
    updatePreferences(preferences)
    showToast('设置已保存，会在之后的学习中生效', 'success')
  }

  const goalLabels = user.goals
    .map((goal) => goalOptions.find((option) => option.value === goal)?.label)
    .filter((label): label is string => Boolean(label))

  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <h1>设置</h1>
        <p>把这里，调整成你喜欢的样子。</p>
      </header>

      <section className="content-card settings-section">
        <h2>个人资料</h2>
        <div className="settings-profile-row">
          <Avatar initial={user.initials} size="xl" />
          <div className="settings-profile-copy">
            <strong>{user.nickname}</strong>
            <p>{user.bio}</p>
            <div className="settings-goal-tags">
              {goalLabels.map((label) => (
                <Tag key={label}>{label}</Tag>
              ))}
              {!goalLabels.length && <span className="settings-muted">还没有设置学习目标</span>}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Pencil size={15} />}
            onClick={openProfileEditor}
          >
            编辑资料
          </Button>
        </div>
      </section>

      <section className="content-card settings-section">
        <h2>账号安全</h2>
        <div className="settings-security-list">
          <div className="settings-security-row">
            <div>
              <strong>登录密码</strong>
              <p>已设置密码，定期更新更安心</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<KeyRound size={15} />}
              onClick={() => {
                setPasswordErrors({})
                setPasswordOpen(true)
              }}
            >
              修改密码
            </Button>
          </div>
          <div className="settings-security-row">
            <div>
              <strong>手机绑定</strong>
              <p>
                {maskedPhone} · 已绑定
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Smartphone size={15} />}
              onClick={() => {
                setPhoneError('')
                setPhoneOpen(true)
              }}
            >
              更换手机号
            </Button>
          </div>
        </div>
      </section>

      <section className="content-card settings-section">
        <h2>通知偏好</h2>
        <div className="settings-toggle-list">
          <div className="settings-toggle-row">
            <div>
              <strong>学习提醒</strong>
              <p>在你方便的时候，轻轻提醒一下</p>
            </div>
            <Switch
              checked={preferences.reminderEnabled}
              label="开启学习提醒"
              onChange={(checked) =>
                setPreferences((current) => ({ ...current, reminderEnabled: checked }))
              }
            />
          </div>
          <div className="settings-toggle-row is-secondary">
            <div>
              <strong>每日提醒时间</strong>
              <p>选择一个你通常会空下来的时间</p>
            </div>
            <label className="time-input-wrap">
              <Clock3 size={15} />
              <input
                type="time"
                value={preferences.reminderTime}
                disabled={!preferences.reminderEnabled}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    reminderTime: event.target.value,
                  }))
                }
                aria-label="每日提醒时间"
              />
            </label>
          </div>
          <div className="settings-toggle-row">
            <div>
              <strong>成就通知</strong>
              <p>获得新成就时，和奶蛙一起庆祝</p>
            </div>
            <Switch
              checked={preferences.achievementNotify}
              label="开启成就通知"
              onChange={(checked) =>
                setPreferences((current) => ({ ...current, achievementNotify: checked }))
              }
            />
          </div>
        </div>
      </section>

      <section className="content-card settings-section">
        <h2>通用</h2>
        <div className="settings-general-list">
          <div className="settings-general-row">
            <div>
              <strong>教程字号</strong>
              <p>调整阅读字号，不影响代码编辑器</p>
            </div>
            <div className="font-size-switcher" role="group" aria-label="教程字号">
              {([12, 14, 16] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={cn(preferences.lessonFontSize === size && 'is-active')}
                  onClick={() =>
                    setPreferences((current) => ({ ...current, lessonFontSize: size }))
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-general-row">
            <div>
              <strong>默认首页</strong>
              <p>下次打开平台时，先去你常去的地方</p>
            </div>
            <select
              className="settings-select"
              value={preferences.defaultHome}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultHome: event.target.value as UserPreferences['defaultHome'],
                }))
              }
              aria-label="默认首页"
            >
              <option value="home">学习首页</option>
              <option value="courses">课程学习</option>
              <option value="practice">题库训练</option>
            </select>
          </div>
        </div>
      </section>

      <div className="settings-footer-actions">
        <Button
          variant="secondary"
          icon={<LogOut size={16} />}
          onClick={() => setLogoutOpen(true)}
        >
          退出登录
        </Button>
        <div>
          <span>设置会在保存后生效</span>
          <Button onClick={savePreferences}>保存设置</Button>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑个人资料"
        description="让奶蛙更了解你一点。"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              取消
            </Button>
            <Button onClick={saveProfile}>保存资料</Button>
          </>
        }
      >
        <div className="settings-modal-form">
          <Field
            label="昵称"
            name="nickname"
            value={nickname}
            maxLength={16}
            onChange={(event) => {
              setNickname(event.target.value)
              setProfileError('')
            }}
            error={profileError}
            placeholder="给自己起一个昵称"
          />
          <label className="field">
            <span className="field-label">个人简介</span>
            <textarea
              className="textarea"
              rows={3}
              maxLength={60}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="写一句想对自己说的话"
            />
            <span className="field-hint">{bio.length} / 60</span>
          </label>
          <div className="field">
            <span className="field-label">学习目标（最多 2 项）</span>
            <div className="settings-goal-picker">
              {goalOptions.map((option) => {
                const selected = editGoals.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    className={cn('filter-chip', selected && 'is-active')}
                    onClick={() => toggleEditGoal(option.value)}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="修改密码"
        description="原型不会保存真实密码，验证仅用于演示。"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPasswordOpen(false)}>
              取消
            </Button>
            <Button onClick={savePassword}>确认修改</Button>
          </>
        }
      >
        <div className="settings-modal-form">
          <Field
            label="当前密码"
            type="password"
            name="current-password"
            value={passwordFields.current}
            onChange={(event) => {
              setPasswordFields((current) => ({ ...current, current: event.target.value }))
              setPasswordErrors((current) => ({ ...current, current: '' }))
            }}
            error={passwordErrors.current}
            placeholder="请输入当前密码"
          />
          <Field
            label="新密码"
            type="password"
            name="new-password"
            value={passwordFields.next}
            onChange={(event) => {
              setPasswordFields((current) => ({ ...current, next: event.target.value }))
              setPasswordErrors((current) => ({ ...current, next: '' }))
            }}
            error={passwordErrors.next}
            hint="至少 8 位，同时包含字母和数字"
            placeholder="设置一个新密码"
          />
          <Field
            label="确认新密码"
            type="password"
            name="confirm-password"
            value={passwordFields.confirm}
            onChange={(event) => {
              setPasswordFields((current) => ({ ...current, confirm: event.target.value }))
              setPasswordErrors((current) => ({ ...current, confirm: '' }))
            }}
            error={passwordErrors.confirm}
            placeholder="再输入一次新密码"
          />
        </div>
      </Modal>

      <Modal
        open={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        title="更换手机号"
        description="换一个常用的号码，提醒就不会错过啦。"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPhoneOpen(false)}>
              取消
            </Button>
            <Button onClick={savePhone}>确认更换</Button>
          </>
        }
      >
        <div className="settings-modal-form">
          <Field
            label="新手机号"
            name="phone"
            inputMode="numeric"
            maxLength={11}
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value.replace(/\D/g, ''))
              setPhoneError('')
            }}
            error={phoneError}
            placeholder="请输入 11 位手机号"
            leading={<Smartphone size={16} />}
          />
        </div>
      </Modal>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="今天先学到这里？"
        description="退出不会清除学习进度，下次回来还能接着学。"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              继续学习
            </Button>
            <Button
              onClick={() => {
                logout()
                setLogoutOpen(false)
                window.location.replace('/')
              }}
            >
              确认退出
            </Button>
          </>
        }
      />
    </div>
  )
}
