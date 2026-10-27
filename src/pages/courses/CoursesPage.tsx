import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { CourseCard } from '@/components/course/CourseCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PageHeading } from '@/components/ui/PageHeading'
import { useAuth } from '@/app/AuthContext'
import {
  categoryOptions,
  courses,
  difficultyOptions,
  statusOptions,
} from '@/data/courses'
import { getCourseStatus } from '@/utils/course'
import type { Category, CourseStatus, Difficulty } from '@/types'
import { cn } from '@/utils/cn'

const PAGE_SIZE = 12

type SortKey = 'recommended' | 'popular' | 'newest'

export function CoursesPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') as Category | null) ?? 'all'
  const [category, setCategory] = useState<'all' | Category>(
    categoryOptions.some((option) => option.value === initialCategory) ? initialCategory : 'all',
  )
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all')
  const [status, setStatus] = useState<'all' | CourseStatus>('all')
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [sort, setSort] = useState<SortKey>('recommended')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = courses.filter((course) => {
      if (category !== 'all' && course.category !== category) return false
      if (difficulty !== 'all' && course.difficulty !== difficulty) return false
      if (status !== 'all' && getCourseStatus(user, course) !== status) return false
      if (
        query &&
        !`${course.title} ${course.description} ${course.categoryLabel}`.toLowerCase().includes(query)
      ) {
        return false
      }
      return true
    })

    if (sort === 'popular') result.sort((a, b) => b.learnerCount - a.learnerCount)
    if (sort === 'newest') result.reverse()
    return result
  }, [category, difficulty, status, search, sort, user])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetFilters = () => {
    setCategory('all')
    setDifficulty('all')
    setStatus('all')
    setSearch('')
    setPage(1)
  }

  const updateFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="page-container courses-page">
      <PageHeading
        title="课程学习"
        subtitle="从零开始，找到适合你的学习节奏。"
        actions={
          <label className="search-box courses-search">
            <Search size={17} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="搜索课程名称、知识点"
              aria-label="搜索课程"
            />
            {search && (
              <button type="button" aria-label="清空搜索" onClick={() => setSearch('')}>
                <X size={15} />
              </button>
            )}
          </label>
        }
      />

      <section className="filter-panel" aria-label="课程筛选">
        <div className="filter-row">
          <span className="filter-label">难度</span>
          <div className="filter-options">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn('filter-chip', difficulty === option.value && 'is-active')}
                onClick={() => updateFilter(setDifficulty, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <span className="filter-label">方向</span>
          <div className="filter-options">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn('filter-chip', category === option.value && 'is-active')}
                onClick={() => updateFilter(setCategory, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <span className="filter-label">状态</span>
          <div className="filter-options">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn('filter-chip', status === option.value && 'is-active')}
                onClick={() => updateFilter(setStatus, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="results-toolbar">
        <p>
          共 <strong>{filtered.length}</strong> 门课程 · 这里有你的下一步
        </p>
        <div className="sort-tabs" aria-label="课程排序">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {[
            { key: 'recommended', label: '推荐排序' },
            { key: 'popular', label: '最多学习' },
            { key: 'newest', label: '最新上线' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(sort === item.key && 'is-active')}
              onClick={() => {
                setSort(item.key as SortKey)
                setPage(1)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {pageItems.length ? (
        <>
          <div className="course-grid course-grid-catalog">
            {pageItems.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="pagination" aria-label="课程分页">
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft size={15} /> 上一页
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={cn('pagination-number', currentPage === pageNumber && 'is-active')}
                  onClick={() => {
                    setPage(pageNumber)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                下一页 <ChevronRight size={15} />
              </button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState
          image="/frog/lying-looking-up.png"
          title="这个条件下还没有课程"
          description="换个关键词，或者重置筛选条件再试试。"
          action={<Button onClick={resetFilters}>重置筛选</Button>}
        />
      )}
    </div>
  )
}
