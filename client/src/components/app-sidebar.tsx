import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboardIcon, FolderIcon, UsersIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/lib/api-endpoints";
import { toast } from "sonner";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: <FolderIcon />,
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: <UsersIcon />,
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (!user) {
      navigate({ to: "/sign-in" });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    const promise = logout().then(() => {
      navigate({ to: "/sign-in" });
    });

    toast.promise(promise, {
      loading: "Logging out...",
      success: "Logged out successfully 👋",
      error: "Failed to logout",
    });
  };

  if (!user) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <Avatar className="rounded-sm">
                  <AvatarImage src={Logo} />
                </Avatar>
                <span className="text-base font-semibold">Ajeya AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} handleLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
