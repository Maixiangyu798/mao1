import { Home, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusPage } from '@/components/ui/StatusPage'

export function ServerErrorPage() {
  return (
    <StatusPage
      code="500"
      tag="奶蛙遇到了一点小状况"
      title="先歇一下，我们很快回来。"
      description={
        <>
          <p>网络连接或服务暂时出了点问题，不是你的错。</p>
          <p>可以检查一下网络，稍后再试一次。</p>
        </>
      }
      image="/frog/surprised.png"
      imageAlt="奶蛙惊讶地张大了嘴"
      actions={
        <>
          <Button
            icon={<RotateCw size={16} />}
            onClick={() => window.location.reload()}
          >
            重新试试
          </Button>
          <Button to="/" variant="secondary" icon={<Home size={16} />}>
            回首页
          </Button>
        </>
      }
      footnote="若仍无法连接，请稍后重试。已保存的进度不会丢失。"
    />
  )
}
