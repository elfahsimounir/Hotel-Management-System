"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Hotel, 
  Users, 
  CalendarDays, 
  Coffee, 
  Receipt, 
  BarChart3,
  UserCog,
  Library,
  ClipboardList,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  
  const [collapsed, setCollapsed] = useState<any>({}); // State to manage collapsed parents

  const toggleCollapse = (label:any) => {
    setCollapsed((prev:any) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      active: pathname === "/dashboard",
    },
    {
      label: "Management",
      icon: Users,
      children: [
        {
          href: "/management/rooms",
          label: "Rooms",
          icon: Hotel,
          active: pathname === "/management/rooms",
        },
        {
          href: "/management/users",
          label: "Users",
          icon: UserCog,
          active: pathname === "/management/users",
        },
        {
          href: "/management/guests",
          label: "Guests",
          icon: Users,
          active: pathname === "/management/guests",
        },
        {
          href: "/management/reservations",
          label: "Reservations",
          icon: CalendarDays,
          active: pathname === "/management/reservations",
        },
      ],
    },
    {
      label: "Operations",
      icon: ClipboardList,
      children: [
        {
          href: "/operations/services",
          label: "Services",
          icon: Coffee,
          active: pathname === "/operations/services",
        },
        {
          href: "/operations/inventory",
          label: "Inventory",
          icon: Library,
          active: pathname === "/operations/inventory",
        },
        {
          href: "/operations/invoices",
          label: "Invoices",
          icon: Receipt,
          active: pathname === "/operations/invoices",
        },
      ],
    },
  ];

  return (
    <nav className="flex flex-col h-full space-y-2 p-4">
      <div className="flex items-center mb-6 px-2">
        <Hotel className="h-6 w-6 mr-2" />
        <span className="text-lg font-bold">Sahara Beach</span>
      </div>
      <div className="space-y-2">
        {routes.map((route) =>
          route.children ? (
            <div key={route.label}>
              <div
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent cursor-pointer",
                  collapsed[route.label] ? "opacity-80" : "transparent"
                )}
                onClick={() => toggleCollapse(route.label)}
              >
                <route.icon className="h-5 w-5 mr-3" />
                <span>{route.label}</span>
                {collapsed[route.label] ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </div>
              {collapsed[route.label]&& (
                <div className="ml-6 space-y-1">
                  {route.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm rounded-lg font-medium transition-colors hover:bg-accent",
                        child.active ? "bg-accent" : "transparent"
                      )}
                    >
                      <child.icon className="h-4 w-4 mr-3" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                route.active ? "bg-accent" : "transparent"
              )}
            >
              <route.icon className="h-5 w-5 mr-3" />
              {route.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
