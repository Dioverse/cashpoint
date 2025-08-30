import {
  Home,
  Users,
  DollarSign,
  Network,
  List,
  History,
  Settings,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  {
    title: 'Pricing',
    url: '/pricing',
    icon: DollarSign,
  },
  {
    title: 'Network',
    url: '/network',
    icon: Network,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: List,
  },
  {
    title: 'Histories',
    url: '/histories',
    icon: History,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sidebar-foreground text-lg">
            Cashpoint Hub
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
                      location.pathname === item.url
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : ''
                    }`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
