import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

type InfoKey = 'terms' | 'privacy' | 'help'

const infoContent: Record<InfoKey, { title: string; body: string[] }> = {
  terms: {
    title: '用户协议',
    body: [
      '欢迎来到奶蛙 Python 学习平台。本原型用于课程作业与体验演示，所有账号、课程和学习数据均为演示数据，不会用于真实商业服务。',
      '使用平台时，请保持友善与尊重。你在编辑器中输入的代码只保存在当前浏览器的本地存储中，不会被发送到服务器。',
      '课程内容、品牌形象与界面设计仅用于本项目演示。',
    ],
  },
  privacy: {
    title: '隐私政策',
    body: [
      '本原型不收集真实手机号、邮箱或密码。登录页与注册页展示的校验逻辑仅用于交互演示，演示账号为本地模拟数据。',
      '学习进度、草稿、收藏和设置会写入浏览器的 localStorage，以便刷新后继续体验。你可以随时退出登录或清理浏览器数据。',
      '我们不会将本地数据上传到第三方服务。',
    ],
  },
  help: {
    title: '帮助中心',
    body: [
      '想快速体验全部页面？在登录页点击「使用演示账号」，即可进入已有学习记录的林同学视角。',
      '遇到代码题时，可以先点击「运行」自测，再提交判题。页面会模拟 Python 输出、常见报错提示和奶蛙的鼓励。',
      '所有主要页面均可通过顶部导航、课程卡片、题目列表、个人中心侧边栏互相到达。',
    ],
  },
}

export function SiteFooter() {
  const [info, setInfo] = useState<InfoKey | null>(null)

  return (
    <>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>奶蛙 Python · 慢慢来，每个小白都能学会 Python。</p>
          <div className="footer-links">
            <button type="button" onClick={() => setInfo('terms')}>
              用户协议
            </button>
            <button type="button" onClick={() => setInfo('privacy')}>
              隐私政策
            </button>
            <button type="button" onClick={() => setInfo('help')}>
              帮助中心
            </button>
          </div>
        </div>
      </footer>
      <Modal
        open={Boolean(info)}
        onClose={() => setInfo(null)}
        title={info ? infoContent[info].title : ''}
        size="md"
        footer={
          <Button onClick={() => setInfo(null)}>
            我知道啦
          </Button>
        }
      >
        <div className="prose">
          {info &&
            infoContent[info].body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </Modal>
    </>
  )
}
