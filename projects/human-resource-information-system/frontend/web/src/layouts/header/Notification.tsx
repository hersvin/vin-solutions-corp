import { Section } from "@/layouts/header/HeaderSection";

const notificationItems = [
  {
    title: "Leave request submitted",
    description: "Maya Patel requested annual leave.",
    time: "14 min ago",
  },
  {
    title: "Interview scheduled",
    description: "Frontend Developer · Tomorrow at 10:30 AM",
    time: "1 hour ago",
  },
  {
    title: "Payroll run approved",
    description: "October payroll is ready for export.",
    time: "3 hours ago",
  },
];

type NotificationsPopoverProps = {
  notificationsRead: boolean;
  onMarkAllRead: () => void;
};

export function NotificationsPopover({
  notificationsRead,
  onMarkAllRead,
}: NotificationsPopoverProps) {
  return (
    <Section id="notifications-popover" title="Notifications">
      <div className="popover-heading">
        <div>
          <p className="popover-eyebrow">Updates</p>
          <h2>Notifications</h2>
        </div>
        {!notificationsRead && (
          <button
            className="popover-text-action"
            type="button"
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        )}
      </div>
      <p className="popover-demo-note">Sample notifications</p>
      <ul className="notification-list">
        {notificationItems.map((item) => (
          <li
            className="notification-item"
            data-read={notificationsRead}
            key={item.title}
          >
            <span className="notification-item__dot" aria-hidden="true" />
            <span className="notification-item__content">
              <span className="notification-item__title">{item.title}</span>
              <span className="notification-item__description">
                {item.description}
              </span>
              <span className="notification-item__time">{item.time}</span>
            </span>
          </li>
        ))}
      </ul>
      {notificationsRead && (
        <p className="popover-feedback" role="status">
          You’re all caught up.
        </p>
      )}
    </Section>
  );
}
