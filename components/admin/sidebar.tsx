'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Music, 
  Package, 
  BarChart, 
  Settings,
  LogOut,
  MonitorPlay
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import useSessionStore from '@/store/useSessionStore';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: BarChart
  },
  {
    title: 'Manage Beats',
    href: '/admin/beats',
    icon: Music
  },
  {
    title: 'Manage Samples',
    href: '/admin/samples',
    icon: Package
  },
  {
    title: 'Manage Ads',
    href: '/admin/ads',
    icon: MonitorPlay
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter()
  const supabase = createClient()
  const {clearSession} = useSessionStore()

async function handleSignOut() {
  supabase.auth.signOut()
  router.refresh()
  clearSession()
}
  return (
    <div className="flex flex-col w-64 bg-zinc-950 border-r border-[#39FF14]/10">
      <div className="p-6">
        <Link href="/admin" className="flex items-center">
          <span className="font-industry text-xl font-bold text-[#39FF14]">
            8KBEATZ Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === item.href 
                ? 'bg-[#39FF14]/10 text-[#39FF14]' 
                : 'text-gray-400 hover:text-[#39FF14] hover:bg-[#39FF14]/5'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[#39FF14]/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-[#39FF14] hover:bg-[#39FF14]/5 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}