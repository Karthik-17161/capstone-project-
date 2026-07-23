import { Link } from "@tanstack/react-router";
import {
  FiBell,
  FiSettings,
  FiSearch,
  FiAlertTriangle,
  FiCheckCircle,
  FiCloudRain,
} from "react-icons/fi";
import { user } from "@/data/app";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export function Navbar() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "High pest risk in Field 3",
      message: "Whitefly population exceeding threshold",
      time: "2 min ago",
      icon: FiAlertTriangle,
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "Treatment applied successfully",
      message: "Neem oil spray completed in Field 1",
      time: "1 hour ago",
      icon: FiCheckCircle,
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Rain forecasted",
      message: "80% chance of rain in 6 hours",
      time: "3 hours ago",
      icon: FiCloudRain,
      type: "info",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-glass-border glass">
      <div className="mx-auto flex h-full items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
            <span className="absolute -inset-0.5 rounded-lg blur-md bg-accent/40 -z-10" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold">Agri Lens</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              AI Crop Intelligence
            </div>
          </div>
        </Link>

        <div className="ml-6 hidden md:flex flex-1 max-w-md items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-3 py-2">
          <FiSearch className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search pests, fields, treatments…"
          />
          <kbd className="hidden md:inline-block rounded border border-glass-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative rounded-lg p-2 hover:bg-white/5 transition-colors">
                <FiBell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-orange text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b border-glass-border">
                <h3 className="font-display text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-accent hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? "bg-white/5" : ""}`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                              notification.type === "warning"
                                ? "bg-orange/20 text-orange"
                                : notification.type === "success"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-primary/20 text-primary"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
          <button className="rounded-lg p-2 hover:bg-white/5 transition-colors">
            <FiSettings className="h-4 w-4" />
          </button>
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 pl-1 pr-3 py-1 hover:bg-white/10 transition-colors"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">
              {user.avatar}
            </div>
            <div className="hidden sm:block text-xs leading-tight text-left">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground">{user.farm}</div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
