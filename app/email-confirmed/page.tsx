import Link from "next/link";
export default function EmailConfirmed() {
  return <main className="status-page"><div className="status-card"><div className="status-icon">✓</div><span className="eyebrow">Account ready</span><h1>Email confirmed</h1><p>Your email address has been verified successfully. You can now login to your Unique CD House account.</p><Link className="primary-button inline" href="/login">Continue to login</Link></div></main>;
}
