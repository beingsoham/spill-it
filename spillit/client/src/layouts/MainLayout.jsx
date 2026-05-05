import { Outlet } from 'react-router-dom'
import Navbar    from '../components/ui/Navbar'
import BottomNav from '../components/ui/BottomNav'
import PostModal from '../components/features/PostModal'
import FabButton from '../components/ui/FabButton'
import LeftSidebar from '../components/ui/LeftSidebar'
import TrendingSidebar from '../components/features/Trending/TrendingSidebar'
import styles    from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.root}>
      <Navbar />

      <div className={styles.body}>
        <aside className={styles.leftGutter}>
          <LeftSidebar />
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <TrendingSidebar />
          </div>
        </aside>
      </div>

      <BottomNav />
      <FabButton />
      <PostModal />
    </div>
  )
}
