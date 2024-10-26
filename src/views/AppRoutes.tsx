import {
  BrowserRouter,
  NavigatePreserveHash,
  Route,
  Routes,
} from '@dashboard/router'
import { UserLoading } from '../components/UserLoading'
import { ROUTES } from '../lib/constants'
import { MainPage } from './MainPage'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <UserLoading>
        <Routes>
          <Route path={ROUTES.home} element={<MainPage />} />

          {/* ADD HERE ROUTES THAT REQUIRE USER */}

          <Route path="*" element={<NavigatePreserveHash to={ROUTES.home} />} />
        </Routes>
      </UserLoading>

      <Routes>
        {/* ADD HERE ROUTES THAT DO NOT REQUIRE USER */}
        {/* <Route path={ROUTES.home} element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
