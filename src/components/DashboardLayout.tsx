import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './DashboardLayout.module.css';

/* ── Nav items per role ─────────────────────────────────────────────────── */
const STUDENT_NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/student',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'modules',
    label: 'My Modules',
    path: '/student',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'My Progress',
    path: '/student',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'certificates',
    label: 'Certificates',
    path: '/student',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/student',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
];

const LECTURER_NAV = [
  {
    id: 'progress',
    label: 'Student Progress',
    path: '/lecturer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Upload Content',
    path: '/lecturer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    id: 'tests',
    label: 'Create Tests',
    path: '/lecturer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/lecturer',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21H3"/><path d="M21 3v18"/><path d="M3 21V8l5-5h10v18"/>
        <path d="M9 21v-8"/><path d="M15 21v-5"/>
      </svg>
    ),
  },
];

interface Props {
  children: ReactNode;
  /** Which sidebar item is currently active */
  activeId: string;
  /** Called when user clicks a sidebar nav item */
  onNavClick?: (id: string) => void;
}

export default function DashboardLayout({ children, activeId, onNavClick }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useLocation(); // keep router context active
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLecturer = user?.role === 'lecturer';
  const navItems = isLecturer ? LECTURER_NAV : STUDENT_NAV;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNav = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    onNavClick?.(item.id);
  };

  return (
    <div className={`${styles.shell} ${collapsed ? styles.shellCollapsed : ''}`}>

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>

        {/* Logo / Brand */}
        <div className={styles.brand}>
          <button className={styles.brandBtn} onClick={() => navigate('/')}>
            <span className={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L3 8.5V15.5L12 21L21 15.5V8.5L12 3Z" fill="white" opacity="0.9"/>
                <path d="M12 3L3 8.5L12 14L21 8.5L12 3Z" fill="white"/>
              </svg>
            </span>
            {!collapsed && <span className={styles.brandName}>Fundisa</span>}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>
              }
            </svg>
          </button>
        </div>

        {/* User card */}
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>
                {isLecturer ? 'Lecturer' : 'Student'}
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className={styles.nav} aria-label="Dashboard navigation">
          {!collapsed && (
            <span className={styles.navGroup}>
              {isLecturer ? 'TEACHING' : 'LEARNING'}
            </span>
          )}
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeId === item.id ? styles.navItemActive : ''}`}
              onClick={() => handleNav(item)}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              {!collapsed && activeId === item.id && (
                <span className={styles.navActiveDot} aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className={styles.sidebarBottom}>
          <button
            className={styles.navItem}
            onClick={() => navigate('/')}
            title={collapsed ? 'Home' : undefined}
          >
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            {!collapsed && <span className={styles.navLabel}>Home</span>}
          </button>

          <button
            className={`${styles.navItem} ${styles.navItemLogout}`}
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
          >
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!collapsed && <span className={styles.navLabel}>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────── */}
      <div className={styles.main}>

        {/* Top bar */}
        <header className={styles.topbar}>
          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Page title from active nav */}
          <div className={styles.topbarTitle}>
            {navItems.find(n => n.id === activeId)?.label ?? 'Dashboard'}
          </div>

          {/* Right: user pill + sign out */}
          <div className={styles.topbarRight}>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className={styles.topbarName}>{user?.name.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
