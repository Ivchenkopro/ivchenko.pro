import BottomNav from "@/components/BottomNav";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-md mx-auto bg-[var(--background)] min-h-screen relative shadow-2xl shadow-[rgba(0,0,0,0.05)] overflow-hidden pb-32 border-x border-[var(--border)]">
      {children}
      <BottomNav />
    </div>
  );
}
