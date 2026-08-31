// Window manager for VishalRavi's Portfolio OS
// - useWindowManager() returns state + actions
// - <OSWindow> renders draggable/resizable/min/max/closable windows
// - Snap-to-edge preview while dragging (left/right half, top → maximize)
// - All coordinates are in the OS container's local space; getBoundingClientRect
//   handles any parent CSS transform (design-canvas zoom) automatically.

const { useState, useRef, useEffect, useCallback, useMemo } = React;

// ── Viewport ────────────────────────────────────────────────────────────
// The UI is built from inline styles, so CSS media queries cannot reach it.
// This hook gives components the current viewport instead, and everything
// responsive keys off `phone`.
const PHONE_MAX = 760;
// Between the two, a tablet still gets the desktop metaphor and full-size
// text, but not the wide-screen rail labels that would crowd the panels.
const NARROW_MAX = 1024;

function useViewport() {
  const read = () => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setVp(read()); });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { ...vp, phone: vp.w <= PHONE_MAX, narrow: vp.w <= NARROW_MAX };
}

window.useViewport = useViewport;

// ── Hook ────────────────────────────────────────────────────────────────
function useWindowManager(initial = []) {
  const [windows, setWindows] = useState(() => initial.map((w, i) => ({
    id: w.id || `${w.appKey}-${Date.now()}-${i}`,
    appKey: w.appKey,
    title: w.title || w.appKey,
    icon: w.icon || "▦",
    x: w.x ?? 80 + i * 28,
    y: w.y ?? 60 + i * 28,
    w: w.w ?? 560,
    h: w.h ?? 380,
    minimized: false,
    maximized: false,
    snap: null, // 'left' | 'right' | null
    z: 10 + i,
    props: w.props || {},
  })));
  const [zTop, setZTop] = useState(initial.length + 10);
  const [activeId, setActiveId] = useState(initial[initial.length - 1]?.id || null);

  const open = useCallback((spec) => {
    setWindows((ws) => {
      // If app already open and only one allowed, focus instead
      const existing = ws.find((w) => w.appKey === spec.appKey && spec.singleton !== false);
      if (existing && spec.singleton !== false) {
        const newZ = zTop + 1;
        setZTop(newZ);
        setActiveId(existing.id);
        return ws.map((w) => w.id === existing.id ? { ...w, z: newZ, minimized: false } : w);
      }
      const id = `${spec.appKey}-${Date.now()}`;
      const newZ = zTop + 1;
      setZTop(newZ);
      setActiveId(id);
      // Cascade
      const offset = ws.length * 24;
      return [...ws, {
        id, appKey: spec.appKey, title: spec.title || spec.appKey,
        icon: spec.icon || "▦",
        x: spec.x ?? 60 + offset,
        y: spec.y ?? 50 + offset,
        w: spec.w ?? 640,
        h: spec.h ?? 420,
        minimized: false, maximized: !!spec.maximized, snap: null,
        z: newZ,
        props: spec.props || {},
      }];
    });
  }, [zTop]);

  const close = useCallback((id) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const focus = useCallback((id) => {
    setActiveId(id);
    setZTop((z) => {
      const newZ = z + 1;
      setWindows((ws) => ws.map((w) => w.id === id ? { ...w, z: newZ, minimized: false } : w));
      return newZ;
    });
  }, []);

  const minimize = useCallback((id) => {
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const toggleMax = useCallback((id) => {
    setWindows((ws) => ws.map((w) => {
      if (w.id !== id) return w;
      if (w.maximized) {
        return { ...w, maximized: false, snap: null };
      }
      return { ...w, maximized: true, snap: null };
    }));
  }, []);

  const update = useCallback((id, patch) => {
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, ...patch } : w));
  }, []);

  return { windows, activeId, open, close, focus, minimize, toggleMax, update };
}

// ── Coords helper ───────────────────────────────────────────────────────
// Convert screen-space pointer delta to desktop-local coords by reading
// the desktop element's bounding rect (handles any parent CSS transform).
function getDesktopScale(desktopEl) {
  if (!desktopEl) return 1;
  const r = desktopEl.getBoundingClientRect();
  return desktopEl.offsetWidth ? desktopEl.offsetWidth / r.width : 1;
}

// ── Window component ────────────────────────────────────────────────────
function OSWindow({ win, desktopRef, isActive, onFocus, onClose, onMinimize, onToggleMax, onUpdate, onSnapPreview, children, theme }) {
  const winRef = useRef(null);
  const titleRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(null);
  const [resizing, setResizing] = useState(null);

  // Effective geometry (maximized/snapped overrides x/y/w/h)
  const desktopBox = () => {
    const d = desktopRef.current;
    if (!d) return { w: 1200, h: 700 };
    return { w: d.offsetWidth, h: d.offsetHeight };
  };

  // Maximized/snapped geometry is derived from the desktop's size, so it has
  // to be recomputed when the viewport changes — otherwise a window that is
  // maximized (as the showcase is on open) keeps its original dimensions.
  const [viewportTick, setViewportTick] = useState(0);
  useEffect(() => {
    if (!win.maximized && !win.snap) return;
    const onResize = () => setViewportTick((t) => t + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [win.maximized, win.snap]);

  const effective = useMemo(() => {
    if (win.maximized) {
      const b = desktopBox();
      return { x: 0, y: 0, w: b.w, h: b.h };
    }
    if (win.snap === 'left') {
      const b = desktopBox();
      return { x: 0, y: 0, w: Math.floor(b.w / 2), h: b.h };
    }
    if (win.snap === 'right') {
      const b = desktopBox();
      return { x: Math.ceil(b.w / 2), y: 0, w: Math.floor(b.w / 2), h: b.h };
    }
    return { x: win.x, y: win.y, w: win.w, h: win.h };
    // eslint-disable-next-line
  }, [win.x, win.y, win.w, win.h, win.maximized, win.snap, viewportTick]);

  // ── Drag move
  const onTitleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('[data-noselectdrag]')) return;
    e.preventDefault();
    onFocus(win.id);
    const scale = getDesktopScale(desktopRef.current);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWin = { x: effective.x, y: effective.y };
    const wasMaxOrSnap = win.maximized || win.snap;
    setDragOffset({ active: true });

    const onMove = (ev) => {
      const dx = (ev.clientX - startX) * scale;
      const dy = (ev.clientY - startY) * scale;
      let nx = startWin.x + dx;
      let ny = startWin.y + dy;

      // Un-maximize / un-snap when starting a drag
      let patch = {};
      if (wasMaxOrSnap) {
        // Pop window out of max/snap, center it under cursor
        const b = desktopBox();
        const cursorRatio = (ev.clientX - desktopRef.current.getBoundingClientRect().left) / desktopRef.current.getBoundingClientRect().width;
        nx = cursorRatio * b.w - win.w / 2;
        ny = Math.max(0, dy);
        patch = { maximized: false, snap: null, x: nx, y: ny };
      } else {
        patch = { x: nx, y: ny };
      }

      // Snap preview detection
      const b = desktopBox();
      const local = {
        x: (ev.clientX - desktopRef.current.getBoundingClientRect().left) * scale,
        y: (ev.clientY - desktopRef.current.getBoundingClientRect().top) * scale,
      };
      let preview = null;
      if (local.y < 6) preview = 'max';
      else if (local.x < 6) preview = 'left';
      else if (local.x > b.w - 6) preview = 'right';
      onSnapPreview && onSnapPreview(preview);

      onUpdate(win.id, patch);
    };
    const onUp = (ev) => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setDragOffset(null);
      const b = desktopBox();
      const local = {
        x: (ev.clientX - desktopRef.current.getBoundingClientRect().left) * scale,
        y: (ev.clientY - desktopRef.current.getBoundingClientRect().top) * scale,
      };
      if (local.y < 6) onUpdate(win.id, { maximized: true, snap: null });
      else if (local.x < 6) onUpdate(win.id, { snap: 'left', maximized: false });
      else if (local.x > b.w - 6) onUpdate(win.id, { snap: 'right', maximized: false });
      onSnapPreview && onSnapPreview(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Resize
  const onResizeMouseDown = (corner) => (e) => {
    if (e.button !== 0) return;
    if (win.maximized || win.snap) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);
    const scale = getDesktopScale(desktopRef.current);
    const startX = e.clientX, startY = e.clientY;
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    setResizing({ active: true });

    const onMove = (ev) => {
      const dx = (ev.clientX - startX) * scale;
      const dy = (ev.clientY - startY) * scale;
      let nx = start.x, ny = start.y, nw = start.w, nh = start.h;
      const MINW = 320, MINH = 200;
      if (corner.includes('e')) nw = Math.max(MINW, start.w + dx);
      if (corner.includes('s')) nh = Math.max(MINH, start.h + dy);
      if (corner.includes('w')) {
        const newW = Math.max(MINW, start.w - dx);
        nx = start.x + (start.w - newW);
        nw = newW;
      }
      if (corner.includes('n')) {
        const newH = Math.max(MINH, start.h - dy);
        ny = start.y + (start.h - newH);
        nh = newH;
      }
      onUpdate(win.id, { x: nx, y: ny, w: nw, h: nh });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setResizing(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (win.minimized) return null;

  const btn = (label, onClick, color) => (
    <button
      data-noselectdrag
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        width: 22, height: 18, padding: 0,
        background: 'transparent',
        border: '1px solid var(--border-bright)',
        color: color || 'var(--fg-dim)',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; e.currentTarget.style.color = color || 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color || 'var(--fg-dim)'; }}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={winRef}
      onMouseDown={() => onFocus(win.id)}
      style={{
        position: 'absolute',
        left: effective.x, top: effective.y,
        width: effective.w, height: effective.h,
        background: 'var(--surface)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-bright)'}`,
        boxShadow: isActive ? 'var(--shadow)' : 'none',
        color: 'var(--fg)',
        fontFamily: 'var(--font-mono)',
        zIndex: win.z,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: dragOffset || resizing ? 'none' : 'box-shadow 0.15s, border-color 0.15s',
      }}
    >
      {/* Title bar */}
      <div
        ref={titleRef}
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => onToggleMax(win.id)}
        style={{
          height: 28,
          flex: '0 0 28px',
          background: isActive ? 'var(--surface-alt)' : 'var(--bg-inset)',
          borderBottom: '1px solid var(--border-bright)',
          display: 'flex', alignItems: 'center',
          padding: '0 6px',
          gap: 8,
          cursor: dragOffset ? 'grabbing' : 'grab',
          userSelect: 'none',
          color: isActive ? 'var(--accent)' : 'var(--fg-dim)',
          textShadow: isActive ? 'var(--text-glow)' : 'none',
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.8 }}>{win.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {win.title}
        </span>
        <span style={{ display: 'flex', gap: 4 }}>
          {btn('_', () => onMinimize(win.id))}
          {btn(win.maximized ? '❒' : '□', () => onToggleMax(win.id))}
          {btn('×', () => onClose(win.id), 'var(--danger)')}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'var(--surface)' }}>
        {children}
      </div>

      {/* Resize handles (only when not max/snap) */}
      {!win.maximized && !win.snap && (
        <>
          <div data-noselectdrag onMouseDown={onResizeMouseDown('se')}
            style={{ position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, cursor: 'nwse-resize', zIndex: 2 }} />
          <div data-noselectdrag onMouseDown={onResizeMouseDown('sw')}
            style={{ position: 'absolute', left: 0, bottom: 0, width: 10, height: 10, cursor: 'nesw-resize', zIndex: 2 }} />
          <div data-noselectdrag onMouseDown={onResizeMouseDown('e')}
            style={{ position: 'absolute', right: 0, top: 28, bottom: 14, width: 5, cursor: 'ew-resize' }} />
          <div data-noselectdrag onMouseDown={onResizeMouseDown('w')}
            style={{ position: 'absolute', left: 0, top: 28, bottom: 10, width: 5, cursor: 'ew-resize' }} />
          <div data-noselectdrag onMouseDown={onResizeMouseDown('s')}
            style={{ position: 'absolute', left: 10, right: 14, bottom: 0, height: 5, cursor: 'ns-resize' }} />
        </>
      )}
    </div>
  );
}

window.useWindowManager = useWindowManager;
window.OSWindow = OSWindow;
