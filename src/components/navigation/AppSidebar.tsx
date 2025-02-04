import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Banknote, Coins, CreditCard, HomeIcon, Settings } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const items = [
  {
    title: "Accueil",
    icon: <HomeIcon />,
    href: "/app",
  },
  {
    title: "Mes prélévements récurrents",
    icon: <Coins />,
    href: "/app/obligatory-expenses",
  },
  {
    title: "Mes dépenses",
    icon: <CreditCard />,
    href: "/app/expenses",
  },
  {
    title: "Mes rentrées",
    icon: <Banknote />,
    href: "/app/recipes",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon} <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Mon compte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/app/profile">
                    <Settings />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <LogoutButton />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
