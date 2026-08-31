// Boot sequence for VishalRavi's Portfolio OS
// BIOS-style scrolling log → progress bar → fade to desktop.
// onDone() is called when the user can skip in OR the animation finishes.

// Divisor applied to every delay below. The sequence still plays in full —
// it just plays fast (~1.2s for BIOS + login together, vs ~4.1s originally).
// Raise to speed the boot up further, set to 1 for the original pacing.
const BOOT_SPEED = 5;

function BootSequence({ onDone, flavor }) {
  const lines = React.useMemo(() => [
    { d: 0,    t: "PortfolioBIOS v1.0.0 — © 2026 Vishal Ravi Muthaiah", c: 'sys' },
    { d: 180,  t: "Memory test ............ 16384 MiB OK", c: 'sys' },
    { d: 80,   t: "Detecting devices:", c: 'sys' },
    { d: 60,   t: "  [ OK ] mouse0       — pointer @ /dev/input/mice", c: 'ok' },
    { d: 60,   t: "  [ OK ] kbd0         — keyboard standard PS/2", c: 'ok' },
    { d: 60,   t: "  [ OK ] display0     — CRT phosphor virtual @ 60Hz", c: 'ok' },
    { d: 60,   t: "  [ OK ] gpu0         — react-renderer v18.3.1", c: 'ok' },
    { d: 120,  t: "Loading kernel modules:", c: 'sys' },
    { d: 60,   t: "  [✓] portfolio-wm", c: 'ok' },
    { d: 60,   t: "  [✓] terminal-shell", c: 'ok' },
    { d: 60,   t: "  [✓] tui-renderer", c: 'ok' },
    { d: 60,   t: "  [✓] resume.dat (loaded)", c: 'ok' },
    { d: 150,  t: "Mounting /home/vishal ........ done.", c: 'sys' },
    { d: 100,  t: "Starting desktop environment ...", c: 'accent' },
  ], []);

  const [shown, setShown] = React.useState(0);
  const [pct, setPct] = React.useState(0);
  const [skip, setSkip] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    let acc = 0;
    lines.forEach((l, i) => {
      acc += l.d / BOOT_SPEED;
      setTimeout(() => { if (!cancelled) setShown((s) => Math.max(s, i + 1)); }, acc);
    });
    const total = acc;
    const start = Date.now();
    const id = setInterval(() => {
      if (cancelled) return;
      const p = Math.min(1, (Date.now() - start) / (total + 150));
      setPct(p);
      if (p >= 1) {
        clearInterval(id);
        setTimeout(() => onDone && onDone(), 120);
      }
    }, 25);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { setSkip(true); onDone && onDone(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  if (skip) return null;

  const W = 60;
  const filled = Math.round(pct * W);
  const bar = '█'.repeat(filled) + '░'.repeat(W - filled);

  return (
    <div onClick={() => { setSkip(true); onDone && onDone(); }}
      style={{
        position: 'absolute', inset: 0, background: 'var(--bg)',
        color: 'var(--fg)', fontFamily: 'var(--font-mono)',
        padding: 24, fontSize: 12, lineHeight: 1.5, overflow: 'hidden',
        zIndex: 1000,
        cursor: 'pointer',
      }}>
      {/* Centered logo block */}
      <div style={{ textAlign: 'left' }}>
        <pre style={{ margin: '0 0 12px', color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 11, lineHeight: 1.05 }}>
{`  ██╗   ██╗██████╗ ███╗   ███╗   ██████╗ ███████╗
  ██║   ██║██╔══██╗████╗ ████║  ██╔═══██╗██╔════╝
  ██║   ██║██████╔╝██╔████╔██║  ██║   ██║███████╗
  ╚██╗ ██╔╝██╔══██╗██║╚██╔╝██║  ██║   ██║╚════██║
   ╚████╔╝ ██║  ██║██║ ╚═╝ ██║  ╚██████╔╝███████║
    ╚═══╝  ╚═╝  ╚═╝╚═╝     ╚═╝   ╚═════╝ ╚══════╝`}
        </pre>
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} style={{
            color: l.c === 'ok' ? 'var(--accent)' : l.c === 'accent' ? 'var(--accent)' : 'var(--fg-dim)',
            textShadow: l.c === 'ok' || l.c === 'accent' ? 'var(--text-glow)' : 'none',
          }}>{l.t}</div>
        ))}
        <div style={{ marginTop: 18, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
          [{bar}] {Math.round(pct * 100).toString().padStart(3)}%
        </div>
        <div style={{ marginTop: 16, color: 'var(--fg-mute)', fontSize: 10 }}>
          press any key or click to skip
        </div>
      </div>
    </div>
  );
}

// Lock / login screen — a brief prompt before the desktop opens.
function LoginScreen({ onLogin, flavor, modeName }) {
  const [stage, setStage] = React.useState(0);
  const lines = [
    "Welcome to VishalRavi's Portfolio OS",
    "",
    `login: vishal`,
    `Password: ${'•'.repeat(12)}`,
    "",
    `Last login: ${new Date().toLocaleString()}`,
    "",
    "Initializing user session ...",
  ];

  React.useEffect(() => {
    let id = setInterval(() => {
      setStage((s) => {
        if (s >= lines.length) {
          clearInterval(id);
          setTimeout(() => onLogin && onLogin(), 150);
          return s;
        }
        return s + 1;
      });
    }, 220 / BOOT_SPEED);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, []);

  return (
    <div onClick={() => onLogin && onLogin()}
      style={{
        position: 'absolute', inset: 0, background: 'var(--bg)',
        color: 'var(--fg)', fontFamily: 'var(--font-mono)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, cursor: 'pointer',
      }}>
      <div style={{
        width: 480, padding: 28,
        border: '1px solid var(--border-bright)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 12, letterSpacing: '0.1em', marginBottom: 10 }}>
          ┌─ AUTHENTICATING ──────────────────────────┐
        </div>
        {lines.slice(0, stage).map((l, i) => (
          <div key={i} style={{ minHeight: 18, fontSize: 12, color: l.startsWith('login') || l.startsWith('Password') ? 'var(--accent)' : 'var(--fg-dim)', textShadow: l.startsWith('login') || l.startsWith('Password') ? 'var(--text-glow)' : 'none' }}>
            {l || '\u00A0'}
          </div>
        ))}
        <div style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 12, letterSpacing: '0.1em', marginTop: 10 }}>
          └───────────────────────────────────────────┘
        </div>
        <div style={{ marginTop: 14, color: 'var(--fg-mute)', fontSize: 10, textAlign: 'center' }}>
          click anywhere to enter
        </div>
      </div>
    </div>
  );
}

window.BootSequence = BootSequence;
window.LoginScreen = LoginScreen;
