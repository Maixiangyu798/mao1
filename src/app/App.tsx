import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { CoursesPage } from '@/pages/courses/CoursesPage'
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage'
import { LearnPage } from '@/pages/learn/LearnPage'
import { PracticePage } from '@/pages/practice/PracticePage'
import { ProblemDetailPage } from '@/pages/practice/ProblemDetailPage'
import { RankingPage } from '@/pages/ranking/RankingPage'
import { ProfileOverviewPage } from '@/pages/profile/ProfileOverviewPage'
import { RecordsPage } from '@/pages/profile/RecordsPage'
import { AchievementsPage } from '@/pages/profile/AchievementsPage'
import { FavoritesPage } from '@/pages/profile/FavoritesPage'
import { SettingsPage } from '@/pages/profile/SettingsPage'
import { MessagesPage } from '@/pages/messages/MessagesPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import { ServerErrorPage } from '@/pages/errors/ServerErrorPage'
import { SiteLayout } from '@/layouts/SiteLayout'
import { ProfileLayout } from '@/layouts/ProfileLayout'
import { GuestOnly, RequireAuth } from '@/app/guards'
import { ScrollToTop } from '@/app/ScrollToTop'

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />

          <Route
            path="login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="register"
            element={
              <GuestOnly>
                <RegisterPage />
              </GuestOnly>
            }
          />
          <Route
            path="forget"
            element={
              <GuestOnly>
                <ForgotPasswordPage />
              </GuestOnly>
            }
          />

          <Route path="courses" element={<CoursesPage />} />
          <Route path="course/:courseId" element={<CourseDetailPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="practice/:problemId" element={<ProblemDetailPage />} />
          <Route path="ranking" element={<RankingPage />} />

          <Route
            path="onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="messages"
            element={
              <RequireAuth>
                <MessagesPage />
              </RequireAuth>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <ProfileLayout />
              </RequireAuth>
            }
          >
            <Route index element={<ProfileOverviewPage />} />
            <Route path="records" element={<RecordsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="404" element={<NotFoundPage />} />
          <Route path="500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/learn/:courseId/:lessonId"
          element={
            <RequireAuth>
              <LearnPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}
