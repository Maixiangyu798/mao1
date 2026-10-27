import { BookOpen, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusPage } from '@/components/ui/StatusPage'

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      tag="这条小路暂时走不通"
      title="咦，这一页躲到哪里去了？"
      description={
        <>
          <p>可能是地址写错了，或页面已经搬家。</p>
          <p>没关系，奶蛙陪你回到熟悉的地方。</p>
        </>
      }
      image="/frog/lying-looking-up.png"
      imageAlt="奶蛙躺在地上看着你"
      actions={
        <>
          <Button to="/" icon={<Home size={16} />}>
            回首页
          </Button>
          <Button to="/courses" variant="secondary" icon={<BookOpen size={16} />}>
            去课程看看
          </Button>
        </>
      }
      footnote="已经保存的学习记录不会受到影响。"
    />
  )
}
