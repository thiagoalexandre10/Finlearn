export default function Avatar({ size = 'md' }) {
  return (
    <div className={`avatar avatar-${size}`} aria-hidden="true">
      <div className="avatar-face">
        <span className="avatar-hair" />
        <span className="avatar-head" />
        <span className="avatar-body" />
      </div>
    </div>
  );
}
