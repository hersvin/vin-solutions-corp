import { Section } from "@/layouts/header/HeaderSection";

export function ProfilePopover() {
  return (
    <Section id="profile-popover" title="Profile">
      <div className="profile-popover__identity">
        <img
          className="profile-popover__avatar"
          src={"https://api.dicebear.com/10.x/lorelei/svg"}
          alt=""
        />
        <div>
          <p className="popover-eyebrow">Profile</p>
          <p className="profile-popover__name">Avery Morgan</p>
          <p className="profile-popover__role">HR Administrator</p>
        </div>
      </div>
      <span className="profile-sample-label">Sample account details</span>
      <dl className="profile-details">
        <div>
          <dt>Email</dt>
          <dd>avery.morgan@example.test</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>People Operations</dd>
        </div>
        <div>
          <dt>Employee ID</dt>
          <dd>HR-01842</dd>
        </div>
      </dl>
      <div className="profile-actions">
        <button type="button" disabled>
          View profile <span>Not connected</span>
        </button>
        <button type="button" disabled>
          Sign out <span>Not connected</span>
        </button>
      </div>
    </Section>
  );
}
