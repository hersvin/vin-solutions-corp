import { RuneIcon } from "runeicons-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Section } from "@/layouts/header/HeaderSection";

type SettingsPopoverProps = {
  isDark: boolean;
  onThemeToggle: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  inAppNotifications: boolean;
  onInAppNotificationsChange: () => void;
  emailDigest: boolean;
  onEmailDigestChange: () => void;
};

type PreferenceToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="preference-toggle-row">
      <span className="preference-toggle-row__copy">
        <span className="preference-toggle-row__label">{label}</span>
        <span className="preference-toggle-row__description">
          {description}
        </span>
      </span>
      <button
        className="preference-switch"
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        data-checked={checked}
        onClick={onChange}
      >
        <span className="preference-switch__thumb" />
      </button>
    </div>
  );
}

export function SettingsPopover({
  isDark,
  onThemeToggle,
  inAppNotifications,
  onInAppNotificationsChange,
  emailDigest,
  onEmailDigestChange,
}: SettingsPopoverProps) {
  return (
    <Section id="settings-popover" title="Settings">
      <div className="popover-heading">
        <div>
          <p className="popover-eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
        <span className="settings-heading-icon" aria-hidden="true">
          <RuneIcon name="tools-settings" type="normal" size={20} />
        </span>
      </div>

      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="appearance-setting">
          <span>
            <span className="preference-toggle-row__label">Color theme</span>
            <span className="preference-toggle-row__description">
              Choose your preferred display.
            </span>
          </span>
          <div className="theme-choice" role="group" aria-label="Color theme">
            <button
              className="theme-choice__button"
              type="button"
              aria-label="Use light theme"
              aria-pressed={!isDark}
              onClick={(event) => {
                if (isDark) onThemeToggle(event);
              }}
            >
              <RuneIcon name="nature-sun" type="normal" size={17} />
            </button>
            <button
              className="theme-choice__button"
              type="button"
              aria-label="Use dark theme"
              aria-pressed={isDark}
              onClick={(event) => {
                if (!isDark) onThemeToggle(event);
              }}
            >
              <RuneIcon name="nature-moon" type="normal" size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <PreferenceToggle
          label="In-app alerts"
          description="Approvals and HR updates"
          checked={inAppNotifications}
          onChange={onInAppNotificationsChange}
        />
        <PreferenceToggle
          label="Email digest"
          description="A daily summary of updates"
          checked={emailDigest}
          onChange={onEmailDigestChange}
        />
      </div>

      <div className="settings-section settings-section--last">
        <h3>Security shortcuts</h3>
        <button
          className="coming-soon-row"
          type="button"
          disabled
          title="Available when authentication is connected"
        >
          <span>
            <span className="preference-toggle-row__label">
              Sign-in & security
            </span>
            <span className="preference-toggle-row__description">
              Password and session controls
            </span>
          </span>
          <span className="coming-soon-pill">Soon</span>
        </button>
      </div>
    </Section>
  );
}
