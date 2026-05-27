export default function Logo({ compact = false }) {
  return (
    <div className="logo-wrap">
      <div className="logo-mark" aria-hidden="true">
        <span className="leaf leaf-one" />
        <span className="leaf leaf-two" />
        <span className="leaf leaf-three" />
      </div>
      {!compact && <strong>FinLearn</strong>}
    </div>
  );
}
