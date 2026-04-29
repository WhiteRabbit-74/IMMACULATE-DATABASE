export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // No TopBar, no pt-16 — full screen authentication page
  return <div className="contents">{children}</div>;
}
