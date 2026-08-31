// Top-level OS component for VishalRavi's Portfolio OS.
// Composes: BootSequence → LoginScreen → Desktop (TopBar, Icons, Windows, Taskbar, ContextMenu)
// Props:
//   flavorKey   — 'phosphor' | 'amber' | 'neo'
//   mode        — 'dark' | 'light'
//   skipBoot    — if true, jumps straight to desktop
//   bootMode    — 'full' | 'login' | 'none'
//   compact     — if true, smaller chrome (for artboards)

const APP_REGISTRY = [
  { key: 'about',         label: 'About',        glyph: '◆', desc: 'who is this' },
  { key: 'projects',      label: 'Projects',     glyph: '▦', desc: 'shipped work' },
  { key: 'experience',    label: 'Experience',   glyph: '▶', desc: 'work history' },
  { key: 'education',     label: 'Education',    glyph: '★', desc: 'degrees' },
  { key: 'skills',        label: 'Skills',       glyph: '✦', desc: 'stack' },
  { key: 'achievements',  label: 'Awards',       glyph: '🏆', desc: 'publications' },
  { key: 'contact',       label: 'Contact',      glyph: '@', desc: 'reach out' },
  { key: 'resume',        label: 'Resume.pdf',   glyph: '📄', desc: 'PDF' },
  { key: 'settings',      label: 'Settings',     glyph: '⚙', desc: 'theme' },
  { key: 'terminal',      label: 'Terminal',     glyph: '_', desc: 'CLI' },
];

const APP_DEFAULTS = {
  about:         { title: 'About — VishalRavi',  icon: '◆', w: 680, h: 540 },
  projects:      { title: 'Projects',            icon: '▦', w: 760, h: 520 },
  experience:    { title: 'Experience',          icon: '▶', w: 720, h: 540 },
  education:     { title: 'Education',           icon: '★', w: 640, h: 460 },
  skills:        { title: 'Skills',              icon: '✦', w: 680, h: 480 },
  achievements:  { title: 'Achievements',        icon: '🏆', w: 640, h: 440 },
  contact:       { title: 'Contact',             icon: '@', w: 620, h: 440 },
  settings:      { title: 'Settings',            icon: '⚙', w: 560, h: 500 },
  resume:        { title: 'Resume.pdf',          icon: '📄', w: 720, h: 560 },
  terminal:      { title: 'Terminal',            icon: '_', w: 620, h: 380 },
  help:          { title: 'Help',                icon: '?', w: 540, h: 500 },
};

// ── Wallpaper ──────────────────────────────────────────────────────────
function Wallpaper({ flavor, mode }) {
  if (flavor === 'phosphor') {
    // Matrix-style cascading characters (CSS only, no JS)
    return (
      <>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: mode === 'dark'
            ? 'radial-gradient(ellipse at center, rgba(70,240,138,0.08) 0%, transparent 65%), #020503'
            : 'radial-gradient(ellipse at center, rgba(18,122,61,0.06) 0%, transparent 65%), #e6f0e0',
        }} />
        <pre style={{
          position: 'absolute', inset: 0, margin: 0, padding: 20,
          color: mode === 'dark' ? 'rgba(70,240,138,0.06)' : 'rgba(18,122,61,0.10)',
          fontFamily: 'var(--font-mono)', fontSize: 10, lineHeight: 1.1,
          pointerEvents: 'none', overflow: 'hidden', userSelect: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {`01100110 01101001 01101100 01100101 00100000 01110010 01100101 01110011 01110101 01101101 01100101 00101110 01110000 01100100 01100110 00100000 01001100 01001110 ▓ ░ █ ▒ 01010110 01101001 01110011 01101000 01100001 01101100 00100000 01001101 01001100 01100101 01101110 01100111 01101001 01101110 01100101 01100101 01110010 00100000 01000101 01101110 01100111 0010000001101001 01101110 01100110 01100101 01110010 01100101 01101110 01100011 01100101 00101110 01110000 01111001 01101111 01110000 01100101 01101110 00100000 01100110 01101111 01101100 01100100 01100101 01110010 00101111 ▓ ▒ ░ █ ▓ ▒ 01010110 01001101 01010010 01110110 01101001 01110011 01101000 01100001 01101100 01110010 01100001 01110110 01101001 00100000`.repeat(40)}
        </pre>
      </>
    );
  }
  if (flavor === 'amber') {
    return (
      <>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: mode === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(255,184,74,0.12) 0%, transparent 70%), #0d0700'
            : 'radial-gradient(ellipse at top, rgba(168,89,10,0.06) 0%, transparent 70%), #f7eedc',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: mode === 'dark'
            ? 'radial-gradient(circle, rgba(255,184,74,0.10) 1px, transparent 1.5px)'
            : 'radial-gradient(circle, rgba(168,89,10,0.12) 1px, transparent 1.5px)',
          backgroundSize: '18px 18px',
        }} />
      </>
    );
  }
  // neo
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: mode === 'dark'
          ? 'radial-gradient(ellipse at 30% 20%, rgba(94,224,216,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(94,224,216,0.06) 0%, transparent 55%), #0a0f14'
          : 'radial-gradient(ellipse at 30% 20%, rgba(10,138,130,0.06) 0%, transparent 55%), #eef2f6',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: mode === 'dark'
          ? 'linear-gradient(rgba(94,224,216,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(94,224,216,0.05) 1px, transparent 1px)'
          : 'linear-gradient(rgba(10,138,130,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,138,130,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
    </>
  );
}

// ── CRT overlay (scanlines + flicker) ──────────────────────────────────
function CrtOverlay({ enabled, opacity }) {
  if (!enabled) return null;
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)',
        opacity: opacity || 0.10,
        mixBlendMode: 'multiply',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9998,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
      }} />
    </>
  );
}

// ── Top bar ────────────────────────────────────────────────────────────
function TopBar({ flavor, mode, activeTitle, onToggleMode, onCycleFlavor }) {
  const flavorMeta = window.OS_FLAVORS[flavor];
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');
  const time = `${fmt(now.getHours())}:${fmt(now.getMinutes())}:${fmt(now.getSeconds())}`;
  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{
      height: 28, flex: '0 0 28px',
      background: 'var(--bg-inset)',
      borderBottom: '1px solid var(--border-bright)',
      display: 'flex', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      padding: '0 10px', gap: 14,
      color: 'var(--fg-dim)',
      letterSpacing: '0.04em',
      userSelect: 'none',
      zIndex: 100,
    }}>
      <span style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)', fontWeight: 700 }}>
        ▸ {flavorMeta?.name || 'OS'}
      </span>
      <span style={{ color: 'var(--fg-mute)' }}>|</span>
      <span style={{ color: 'var(--fg-dim)' }}>{activeTitle || 'desktop'}</span>
      <span style={{ flex: 1 }} />
      <span title="cycle flavor" onClick={onCycleFlavor} style={{ cursor: 'pointer', color: 'var(--fg-dim)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-dim)'; }}>
        ◈ {flavor}
      </span>
      <span title="toggle dark/light" onClick={onToggleMode} style={{ cursor: 'pointer', color: 'var(--fg-dim)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-dim)'; }}>
        {mode === 'dark' ? '◐' : '◑'} {mode}
      </span>
      <span style={{ color: 'var(--fg-mute)' }}>|</span>
      <span style={{ color: 'var(--fg-dim)' }}>{date}</span>
      <span style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>{time}</span>
    </div>
  );
}

// ── Desktop icon ───────────────────────────────────────────────────────
function DesktopIcon({ app, onOpen, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      style={{
        width: 78, padding: '8px 4px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        cursor: 'pointer', userSelect: 'none',
        background: selected ? 'var(--sel-bg)' : 'transparent',
        border: `1px dashed ${selected ? 'var(--accent)' : 'transparent'}`,
        fontFamily: 'var(--font-mono)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'rgba(127,127,127,0.06)'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{
        width: 44, height: 44,
        border: '1px solid var(--border-bright)',
        background: 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)',
        fontSize: 20,
        textShadow: 'var(--text-glow)',
        boxShadow: selected ? '0 0 12px var(--accent-glow)' : 'none',
      }}>
        {app.glyph}
      </div>
      <div style={{
        fontSize: 10,
        color: selected ? 'var(--accent)' : 'var(--fg-dim)',
        textShadow: selected ? 'var(--text-glow)' : 'none',
        textAlign: 'center',
        letterSpacing: '0.04em',
      }}>{app.label}</div>
    </div>
  );
}

// ── Context menu ───────────────────────────────────────────────────────
function ContextMenu({ x, y, items, onClose }) {
  React.useEffect(() => {
    const h = () => onClose();
    window.addEventListener('mousedown', h);
    window.addEventListener('blur', h);
    return () => {
      window.removeEventListener('mousedown', h);
      window.removeEventListener('blur', h);
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute', left: x, top: y,
        minWidth: 200, zIndex: 9000,
        background: 'var(--surface)',
        border: '1px solid var(--accent)',
        boxShadow: 'var(--shadow)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg)',
        padding: 4,
      }}>
      {items.map((it, i) => it.divider ? (
        <div key={i} style={{ height: 1, background: 'var(--border-bright)', opacity: 0.5, margin: '4px 2px' }} />
      ) : (
        <div key={i}
          onClick={() => { it.onClick && it.onClick(); onClose(); }}
          style={{
            padding: '6px 12px',
            cursor: it.disabled ? 'default' : 'pointer',
            opacity: it.disabled ? 0.4 : 1,
            color: 'var(--fg-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}
          onMouseEnter={(e) => { if (!it.disabled) { e.currentTarget.style.background = 'var(--sel-bg)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.textShadow = 'var(--text-glow)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-dim)'; e.currentTarget.style.textShadow = 'none'; }}>
          <span><span style={{ color: 'var(--accent)', marginRight: 8 }}>{it.glyph || '▸'}</span>{it.label}</span>
          {it.hint && <span style={{ color: 'var(--fg-mute)', fontSize: 10 }}>{it.hint}</span>}
        </div>
      ))}
    </div>
  );
}

// ── Snap overlay ───────────────────────────────────────────────────────
function SnapPreview({ side }) {
  if (!side) return null;
  const boxes = {
    left: { left: 0, top: 0, width: '50%', height: '100%' },
    right: { right: 0, top: 0, width: '50%', height: '100%' },
    max: { inset: 0 },
  };
  return (
    <div style={{
      position: 'absolute', ...(boxes[side]),
      background: 'var(--sel-bg)',
      border: '2px dashed var(--accent)',
      boxShadow: '0 0 24px var(--accent-glow)',
      pointerEvents: 'none', zIndex: 9000,
      transition: 'all 0.12s',
    }} />
  );
}

// ── Taskbar ────────────────────────────────────────────────────────────
function Taskbar({ apps, windows, activeId, onLaunch, onClickWindow, onMenu }) {
  return (
    <div style={{
      height: 36, flex: '0 0 36px',
      background: 'var(--bg-inset)',
      borderTop: '1px solid var(--border-bright)',
      display: 'flex', alignItems: 'center',
      padding: '0 6px', gap: 4,
      fontFamily: 'var(--font-mono)', fontSize: 11,
      userSelect: 'none',
      position: 'relative',
      zIndex: 100,
    }}>
      <button onClick={onMenu}
        style={{
          height: 26, padding: '0 12px',
          background: 'var(--surface-alt)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          textShadow: 'var(--text-glow)',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          cursor: 'pointer', letterSpacing: '0.1em', fontWeight: 700,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 10px var(--accent-glow)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
        ▦ APPS
      </button>

      {/* Quick launch */}
      <div style={{ display: 'flex', gap: 2, padding: '0 6px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', marginLeft: 4 }}>
        {['terminal', 'about', 'projects', 'contact'].map((k) => {
          const app = apps.find((a) => a.key === k);
          if (!app) return null;
          return (
            <button key={k} title={app.label} onClick={() => onLaunch(k)}
              style={{
                width: 26, height: 26, padding: 0,
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--fg-dim)',
                fontFamily: 'var(--font-mono)', fontSize: 13,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.textShadow = 'var(--text-glow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; e.currentTarget.style.textShadow = 'none'; }}>
              {app.glyph}
            </button>
          );
        })}
      </div>

      {/* Open windows */}
      <div style={{ display: 'flex', gap: 2, flex: 1, overflow: 'hidden' }}>
        {windows.map((w) => (
          <button key={w.id} onClick={() => onClickWindow(w.id)}
            style={{
              height: 26, padding: '0 10px', maxWidth: 180,
              background: activeId === w.id && !w.minimized ? 'var(--surface-alt)' : 'transparent',
              border: '1px solid var(--border)',
              borderBottom: activeId === w.id && !w.minimized ? '2px solid var(--accent)' : '1px solid var(--border)',
              color: activeId === w.id && !w.minimized ? 'var(--accent)' : 'var(--fg-dim)',
              textShadow: activeId === w.id && !w.minimized ? 'var(--text-glow)' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              cursor: 'pointer',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              opacity: w.minimized ? 0.55 : 1,
            }}>
            <span style={{ marginRight: 6 }}>{w.icon}</span>{w.title}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── App launcher panel ─────────────────────────────────────────────────
function AppLauncher({ apps, onLaunch, onClose }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 8000,
        background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'flex-end',
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          margin: '0 0 42px 6px',
          width: 360,
          maxHeight: '70%',
          background: 'var(--surface)',
          border: '1px solid var(--accent)',
          boxShadow: 'var(--shadow)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg)',
          overflow: 'auto',
        }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-bright)', fontSize: 11, color: 'var(--accent)', textShadow: 'var(--text-glow)', letterSpacing: '0.1em' }}>
          ┌─ APP LAUNCHER ─────────────────────┐
        </div>
        <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {apps.map((a) => (
            <div key={a.key}
              onClick={() => { onLaunch(a.key); onClose(); }}
              style={{
                padding: '8px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                border: '1px solid var(--border)',
                background: 'var(--bg-inset)',
                color: 'var(--fg-dim)',
                fontSize: 12,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.textShadow = 'var(--text-glow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-dim)'; e.currentTarget.style.textShadow = 'none'; }}>
              <span style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 14 }}>{a.glyph}</span>
              <span>
                <div>{a.label}</div>
                <div style={{ fontSize: 9, color: 'var(--fg-mute)', textShadow: 'none' }}>{a.desc}</div>
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-bright)', fontSize: 11, color: 'var(--accent)', textShadow: 'var(--text-glow)', letterSpacing: '0.1em' }}>
          └────────────────────────────────────┘
        </div>
      </div>
    </div>
  );
}

// ── Main OS component ──────────────────────────────────────────────────
function VishalOS({ flavorKey = 'phosphor', initialMode = 'dark', bootMode = 'full', autoOpen = ['terminal'] }) {
  const [flavor, setFlavor] = React.useState(flavorKey);
  const [mode, setMode] = React.useState(initialMode);
  const [stage, setStage] = React.useState(bootMode === 'none' ? 'desktop' : bootMode === 'login' ? 'login' : 'boot');
  const desktopRef = React.useRef(null);
  const wm = window.useWindowManager([]);
  const [snapPrev, setSnapPrev] = React.useState(null);
  const [ctxMenu, setCtxMenu] = React.useState(null);
  const [launcherOpen, setLauncherOpen] = React.useState(false);
  const [iconSel, setIconSel] = React.useState(null);
  // Populated by <ShowcaseDeck>; lets a desktop icon scroll the deck to its
  // section instead of making the visitor open a window to read anything.
  const deckNav = React.useRef(null);

  const themeStyle = window.osTheme(flavor, mode);
  const flavorMeta = window.OS_FLAVORS[flavor];
  const crtOn = flavorMeta && flavorMeta[mode] && flavorMeta[mode].crt;
  const crtOpacity = flavorMeta && flavorMeta[mode] && flavorMeta[mode].scanlineOpacity;

  // Auto-open initial apps once we hit desktop
  const didAutoOpen = React.useRef(false);
  React.useEffect(() => {
    if (stage !== 'desktop' || didAutoOpen.current) return;
    didAutoOpen.current = true;
    (autoOpen || []).forEach((k, i) => {
      setTimeout(() => launchApp(k), 100 + i * 150);
    });
    // eslint-disable-next-line
  }, [stage]);

  const launchApp = (key, extra = {}) => {
    const def = APP_DEFAULTS[key];
    if (!def) return;
    if (key === 'terminal') {
      wm.open({ appKey: 'terminal', ...def, singleton: false, ...extra });
    } else {
      wm.open({ appKey: key, ...def, ...extra });
    }
  };

  const themeApi = {
    flavor, mode,
    setFlavor: (f) => setFlavor(f),
    setMode: (m) => setMode(m),
  };

  const activeWin = wm.windows.find((w) => w.id === wm.activeId);
  const activeTitle = activeWin && !activeWin.minimized ? activeWin.title : null;

  // Right-click context menu on desktop
  const onDesktopContext = (e) => {
    e.preventDefault();
    const rect = desktopRef.current.getBoundingClientRect();
    const scale = desktopRef.current.offsetWidth / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    setCtxMenu({
      x: Math.min(x, desktopRef.current.offsetWidth - 220),
      y: Math.min(y, desktopRef.current.offsetHeight - 280),
      items: [
        { label: 'New Terminal', glyph: '_', onClick: () => launchApp('terminal') },
        { label: 'Open Help', glyph: '?', onClick: () => launchApp('help') },
        { divider: true },
        { label: 'Cycle Flavor', glyph: '◈', onClick: () => {
          const order = ['phosphor', 'amber', 'neo'];
          setFlavor(order[(order.indexOf(flavor) + 1) % order.length]);
        }, hint: flavor },
        { label: 'Toggle Mode', glyph: mode === 'dark' ? '◐' : '◑', onClick: () => setMode(mode === 'dark' ? 'light' : 'dark'), hint: mode },
        { divider: true },
        { label: 'Settings…', glyph: '⚙', onClick: () => launchApp('settings') },
        { label: 'About this OS', glyph: '◆', onClick: () => launchApp('about') },
      ],
    });
  };

  // Build content for each window
  const renderWindowContent = (w) => {
    const Comp = window.OS_APPS[w.appKey];
    if (w.appKey === 'terminal') {
      return <window.AppTerminal wm={wm} themeApi={themeApi} winId={w.id} {...(w.props || {})} />;
    }
    if (w.appKey === 'settings') {
      return <window.OS_APPS.settings flavor={flavor} mode={mode} onFlavor={setFlavor} onMode={setMode} />;
    }
    if (!Comp) return <div style={{ padding: 20 }}>App not found: {w.appKey}</div>;
    // mode lets brand-coloured UI (Contact's logo tiles) adapt; apps that
    // don't need it simply ignore the prop.
    return <Comp mode={mode} {...(w.props || {})} />;
  };

  if (stage === 'boot') {
    return (
      <div style={{ ...themeStyle, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <BootSequence flavor={flavor} onDone={() => setStage('login')} />
        <CrtOverlay enabled={crtOn} opacity={crtOpacity} />
      </div>
    );
  }
  if (stage === 'login') {
    return (
      <div style={{ ...themeStyle, position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <LoginScreen onLogin={() => setStage('desktop')} />
        <CrtOverlay enabled={crtOn} opacity={crtOpacity} />
      </div>
    );
  }

  // Desktop
  return (
    <div style={{
      ...themeStyle,
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <TopBar
        flavor={flavor} mode={mode} activeTitle={activeTitle}
        onToggleMode={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        onCycleFlavor={() => {
          const order = ['phosphor', 'amber', 'neo'];
          setFlavor(order[(order.indexOf(flavor) + 1) % order.length]);
        }}
      />

      {/* Desktop area */}
      <div
        ref={desktopRef}
        data-os-desktop
        onContextMenu={onDesktopContext}
        onClick={() => { setIconSel(null); setCtxMenu(null); }}
        style={{
          flex: 1, position: 'relative', overflow: 'hidden',
        }}>
        <Wallpaper flavor={flavor} mode={mode} />

        {/* Desktop icons grid */}
        <div style={{
          position: 'absolute', top: 12, left: 12, right: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 78px)',
          gap: 6,
          maxWidth: 84 * 2,
        }}>
          {APP_REGISTRY.map((app) => (
            <DesktopIcon
              key={app.key}
              app={app}
              selected={iconSel === app.key}
              onSelect={() => {
                setIconSel(app.key);
                if (deckNav.current) deckNav.current(app.key);
              }}
              onOpen={() => {
                // A double-click fires click then dblclick, so this runs right
                // after onSelect. Sections are already on screen in the deck —
                // navigating is the whole interaction, no window is opened.
                // Only apps with no deck section (Resume, Settings, Terminal)
                // still open a window. goTo() reports whether it handled it.
                if (deckNav.current && deckNav.current(app.key)) return;
                launchApp(app.key);
                setIconSel(null);
              }}
            />
          ))}
        </div>

        {/* Watermark — kept in the icon column so the deck stays clear */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, width: 168,
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-mute)',
          opacity: 0.55, pointerEvents: 'none',
          lineHeight: 1.6, letterSpacing: '0.05em',
        }}>
          <div style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 10, fontWeight: 700 }}>
            ◆ VISHALRAVI'S PORTFOLIO
          </div>
          <div>{flavorMeta?.name} · {flavorMeta?.codename}</div>
          <div>click an icon to jump · double-click to open</div>
        </div>

        {/* Showcase deck — every section already open, right of the icons */}
        <div style={{ position: 'absolute', left: 192, top: 0, right: 0, bottom: 0 }}>
          <window.ShowcaseDeck navRef={deckNav} mode={mode} />
        </div>

        {/* Windows */}
        {wm.windows.map((w) => (
          <OSWindow
            key={w.id}
            win={w}
            desktopRef={desktopRef}
            isActive={wm.activeId === w.id}
            onFocus={wm.focus}
            onClose={wm.close}
            onMinimize={wm.minimize}
            onToggleMax={wm.toggleMax}
            onUpdate={wm.update}
            onSnapPreview={setSnapPrev}
          >
            {renderWindowContent(w)}
          </OSWindow>
        ))}

        <SnapPreview side={snapPrev} />

        {ctxMenu && (
          <ContextMenu x={ctxMenu.x} y={ctxMenu.y} items={ctxMenu.items} onClose={() => setCtxMenu(null)} />
        )}

        {launcherOpen && (
          <AppLauncher apps={APP_REGISTRY} onLaunch={launchApp} onClose={() => setLauncherOpen(false)} />
        )}
      </div>

      <Taskbar
        apps={APP_REGISTRY}
        windows={wm.windows}
        activeId={wm.activeId}
        onLaunch={launchApp}
        onClickWindow={(id) => {
          const w = wm.windows.find((w) => w.id === id);
          if (w && w.id === wm.activeId && !w.minimized) wm.minimize(id);
          else wm.focus(id);
        }}
        onMenu={() => setLauncherOpen((v) => !v)}
      />

      <CrtOverlay enabled={crtOn} opacity={crtOpacity} />
    </div>
  );
}

window.VishalOS = VishalOS;
