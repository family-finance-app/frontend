import ProfileMenu from './ProfileMenu';
import HomeButton from './HomeButton';
import SeacrhInput from './SearchInput';
import Notifications from './Notifications';
import QuickActions from './QuickActions';
import ColorModeSwitcher from './ColorModeSwitcher';

export default function Navigation() {
  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Logo */}
            <HomeButton />

            {/* Search Input - Desktop/Mobile */}
            <SeacrhInput />
          </div>

          <div className="flex items-center">
            {/* Notifications */}
            <Notifications />

            {/* Quick Actions Menu */}
            <QuickActions />

            {/* Light/Dark Mode Switcher */}
            <ColorModeSwitcher />

            {/* Profile Dropdown */}
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
