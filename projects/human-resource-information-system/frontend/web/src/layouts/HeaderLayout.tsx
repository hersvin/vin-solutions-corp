import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { RefObject } from "react";
import { RuneIcon } from "runeicons-react";
import { FONT } from "@/utils/FONT";
import type { ThemeMode } from "@/hooks/useTheme";
import "@/layouts/HeaderLayout.css";
import { NotificationsPopover } from "@/layouts/header/Notification";
import { SettingsPopover } from "@/layouts/header/Settings";
import { ProfilePopover } from "@/layouts/header/Profile";

type PopoverId = "notifications" | "settings" | "profile";

type HeaderLayoutProps = {
  theme: ThemeMode;
  isDark: boolean;
  onThemeToggle: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  mobileSidebarOpen: boolean;
  onMobileSidebarToggle: () => void;
  mobileMenuButtonRef: RefObject<HTMLButtonElement | null>;
};

export function HeaderLayout({
  theme,
  isDark,
  onThemeToggle,
  mobileSidebarOpen,
  onMobileSidebarToggle,
  mobileMenuButtonRef,
}: HeaderLayoutProps) {
  const [openPopover, setOpenPopover] = useState<PopoverId | null>(null);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<PopoverId, HTMLButtonElement | null>>({
    notifications: null,
    settings: null,
    profile: null,
  });
  const unreadCount = notificationsRead ? 0 : 3;

  useEffect(() => {
    if (!openPopover) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        headerRef.current?.contains(event.target) !== true
      ) {
        setOpenPopover(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        triggerRefs.current[openPopover]?.focus();
        setOpenPopover(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPopover]);

  const togglePopover = (popover: PopoverId) => {
    setOpenPopover((currentPopover) =>
      currentPopover === popover ? null : popover,
    );
  };

  return (
    <header
      className="app-header"
      ref={headerRef}
      style={{ fontFamily: FONT.body.family }}
    >
      <div className="app-header__brand-group">
        <button
          className="header-icon-button mobile-menu-toggle"
          type="button"
          aria-label={mobileSidebarOpen ? "Close module navigation" : "Open module navigation"}
          aria-expanded={mobileSidebarOpen}
          aria-controls="sidebar-navigation"
          onClick={onMobileSidebarToggle}
          ref={mobileMenuButtonRef}
          title={mobileSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          <RuneIcon name={mobileSidebarOpen ? "layouts-panel-left-close" : "layouts-menu"} type="normal" size={21} />
        </button>
        <a className="app-brand" href="/" aria-label="hersvin home">
          <span className="app-brand__mark" aria-hidden="true">H</span>
          <span className="app-brand__name">HERSVIN</span>
        </a>
      </div>

      <div className="app-header__actions">
        <button
          className="header-icon-button theme-icon-button"
          type="button"
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          aria-pressed={isDark}
          data-theme={theme}
          onClick={onThemeToggle}
          title={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          <RuneIcon
            name={isDark ? "nature-sun" : "nature-moon"}
            type="normal"
            size={21}
          />
        </button>

        <div className="header-action">
          <button
            className="header-icon-button notification-button"
            type="button"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            title="Notifications"
            aria-expanded={openPopover === "notifications"}
            aria-controls="notifications-popover"
            ref={(node) => {
              triggerRefs.current.notifications = node;
            }}
            onClick={() => togglePopover("notifications")}
          >
            <RuneIcon name="glass-bell-2-2" type="glass" size={21} />
            {unreadCount > 0 && (
              <span className="notification-button__badge" aria-hidden="true">
                {unreadCount}
              </span>
            )}
          </button>
          {openPopover === "notifications" && (
            <NotificationsPopover
              notificationsRead={notificationsRead}
              onMarkAllRead={() => setNotificationsRead(true)}
            />
          )}
        </div>

        <div className="header-action">
          <button
            className="header-icon-button"
            type="button"
            aria-label="Settings"
            title="Settings"
            aria-expanded={openPopover === "settings"}
            aria-controls="settings-popover"
            ref={(node) => {
              triggerRefs.current.settings = node;
            }}
            onClick={() => togglePopover("settings")}
          >
            <RuneIcon name="tools-settings" type="normal" size={21} />
          </button>
          {openPopover === "settings" && (
            <SettingsPopover
              isDark={isDark}
              onThemeToggle={onThemeToggle}
              inAppNotifications={inAppNotifications}
              onInAppNotificationsChange={() =>
                setInAppNotifications((enabled) => !enabled)
              }
              emailDigest={emailDigest}
              onEmailDigestChange={() => setEmailDigest((enabled) => !enabled)}
            />
          )}
        </div>

        <div className="header-action">
          <button
            className="profile-button"
            type="button"
            aria-label="Open profile menu"
            title="Profile"
            aria-expanded={openPopover === "profile"}
            aria-controls="profile-popover"
            ref={(node) => {
              triggerRefs.current.profile = node;
            }}
            onClick={() => togglePopover("profile")}
          >
            <img src={"https://api.dicebear.com/10.x/thumbs/svg"} alt="" />
          </button>
          {openPopover === "profile" && <ProfilePopover />}
        </div>
      </div>
    </header>
  );
}
