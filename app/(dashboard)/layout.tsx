import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', overflow: 'hidden', position: 'relative' }}>
      <div className="noise-overlay" />
      <Navbar />
      <main style={{ flex: 1, marginLeft: '360px', height: '100vh', overflowY: 'auto', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

