import { Button } from "@/core/components/ui/button";
import { cn } from "@/core/lib/utils";
import { CheckSquare, LayoutDashboard, Settings, Users } from "lucide-react";

interface SideBarProps {
  sidebarOpen: boolean;
}

export const SideBar = ({ sidebarOpen }: SideBarProps) => {
  const navigation = [
    {
      name: "Panel de control",
      icon: LayoutDashboard,
      href: "/dashboard",
      current: false,
    },
    {
      name: "Equipos de Kanban",
      icon: CheckSquare,
      href: "/dashboard/workspaces",
      current: true,
    },
    { name: "Equipo", icon: Users, href: "/dashboard/team", current: false },
    {
      name: "Configuraciones",
      icon: Settings,
      href: "/dashboard/settings",
      current: false,
    },
  ];
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.current
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock advanced features and unlimited boards
          </p>
          <Button size="sm" className="w-full">
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
};
