import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import BottomTabBar from '../components/BottomTabBar'
import FightTab from './tabs/FightTab'
import RankingsTab from './tabs/RankingsTab'
import MenuTab from './tabs/MenuTab'
import { FightIcon, RankingsIcon, MenuIcon } from '../components/icons'

const TABS = [
  { key: 'fight', label: 'Fight', icon: FightIcon, title: 'Nouveau combat' },
  { key: 'rankings', label: 'Rankings', icon: RankingsIcon, title: 'Classements' },
  { key: 'menu', label: 'Menu', icon: MenuIcon, title: 'Menu' },
]

export default function MainApp() {
  const { currentUser, logout } = useApp()
  const [active, setActive] = useState('fight')
  const activeTab = TABS.find((t) => t.key === active)

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : ''

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={activeTab.title}
        subtitle={currentUser?.organization}
        initials={initials}
        onAvatarClick={logout}
      />

      <div className="flex-1 overflow-y-auto">
        {active === 'fight' && <FightTab />}
        {active === 'rankings' && <RankingsTab />}
        {active === 'menu' && <MenuTab />}
      </div>

      <BottomTabBar tabs={TABS} active={active} onChange={setActive} />
    </div>
  )
}
