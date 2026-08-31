// All app windows for VishalRavi's Portfolio OS
// Each app is a React component rendered inside <OSWindow>'s content area.
// Common TUI aesthetic: monospace, ASCII section dividers, hover highlights.

const D = () => window.PORTFOLIO_DATA;

// ── Shared bits ────────────────────────────────────────────────────────
function TuiDivider({ char = "─", label, color = "var(--border-bright)" }) {
  if (label) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color, fontSize: 12, margin: '12px 0 8px', letterSpacing: '0.06em' }}>
        <span>┌─</span>
        <span style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>{label}</span>
        <span style={{ flex: 1, overflow: 'hidden' }}>{char.repeat(200)}</span>
      </div>
    );
  }
  return <div style={{ color, opacity: 0.6, fontSize: 12, letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden' }}>{char.repeat(200)}</div>;
}

function Chip({ children, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      border: `1px solid ${color || 'var(--border-bright)'}`,
      color: color || 'var(--fg-dim)',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em',
      lineHeight: 1.6,
      borderRadius: 0,
    }}>
      {children}
    </span>
  );
}

function Box({ children, label, color = 'var(--border-bright)', style }) {
  return (
    <div style={{ position: 'relative', border: `1px solid ${color}`, padding: '14px 16px 14px', margin: '8px 0', ...style }}>
      {label && (
        <span style={{
          position: 'absolute', top: -8, left: 12, padding: '0 6px',
          background: 'var(--surface)', color: 'var(--accent)',
          fontSize: 11, letterSpacing: '0.08em', textShadow: 'var(--text-glow)',
        }}>{label}</span>
      )}
      {children}
    </div>
  );
}

const appPad = { padding: 18, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)', lineHeight: 1.55 };

// Bio may be authored as whole paragraphs or as hard-wrapped lines separated
// by blank strings. Normalise to paragraphs either way so the text reflows to
// the available width instead of keeping its authored line breaks.
function bioParagraphs(lines) {
  const arr = (lines || []).map((l) => String(l));
  // A blank entry means the old hard-wrapped format, where blanks separate
  // paragraphs. Without any blank, each entry is already its own paragraph.
  if (!arr.some((l) => l.trim() === '')) {
    return arr.map((l) => l.trim()).filter(Boolean);
  }
  const out = [];
  let cur = [];
  arr.forEach((l) => {
    if (l.trim() === '') {
      if (cur.length) { out.push(cur.join(' ')); cur = []; }
    } else {
      cur.push(l.trim());
    }
  });
  if (cur.length) out.push(cur.join(' '));
  return out;
}

// Live count of public, non-forked GitHub repos. This is a static site, so
// it is a plain client-side fetch — cached for 12h so a visitor costs one
// request, and silent on failure (rate limit, offline, blocked) rather than
// showing a broken tile.
function useGithubRepoCount(profileUrl) {
  const [count, setCount] = React.useState(null);
  React.useEffect(() => {
    const user = (/github\.com\/([^/?#]+)/.exec(profileUrl || '') || [])[1];
    if (!user) return;
    const KEY = `gh-repos:${user}`;
    const TTL = 12 * 60 * 60 * 1000;

    try {
      const hit = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (hit && typeof hit.n === 'number' && Date.now() - hit.t < TTL) {
        setCount(hit.n);
        return;
      }
    } catch (e) { /* private mode, or storage disabled */ }

    let cancelled = false;
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&type=owner&sort=updated`)
      .then((r) => (r.ok ? r.json() : null))
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        // Forks are other people's work — they should not inflate the count.
        const n = list.filter((r) => !r.fork).length;
        setCount(n);
        try { localStorage.setItem(KEY, JSON.stringify({ n, t: Date.now() })); } catch (e) {}
      })
      .catch(() => { /* leave the tile on its placeholder */ });
    return () => { cancelled = true; };
  }, [profileUrl]);
  return count;
}

// ── About ──────────────────────────────────────────────────────────────
function AppAbout() {
  const d = D();
  const repos = useGithubRepoCount(d.links && d.links.github);

  // Every figure is derived, so adding a project, paper, award or language
  // to data.js moves the counter with no edit here.
  const stats = React.useMemo(() => {
    const ach = d.achievements || [];
    const pubs = ach.filter((a) => a.type === 'Publication');
    const awards = ach.filter((a) => a.type === 'Award');
    const langs = (d.skills && d.skills.Languages) || [];
    const acronym = (s) => (/\(([A-Z]{2,})\)/.exec(s || '') || [])[1];
    return [
      { k: 'PROJECTS', v: (d.projects || []).length, sub: 'shipped' },
      { k: 'GITHUB', v: repos == null ? '·' : repos, sub: 'public repos' },
      { k: 'PUBLICATIONS', v: pubs.length, sub: (pubs.length === 1 && acronym(pubs[0].org)) || 'peer-reviewed' },
      { k: 'AWARDS', v: awards.length, sub: awards.length === 1 ? awards[0].title.replace(/\s+Project$/, '') : 'received' },
      { k: 'LANGUAGES', v: langs.length, sub: 'fluent' },
    ];
  }, [d, repos]);
  return (
    <div style={appPad}>
      {/* ASCII banner */}
      <pre style={{ margin: 0, color: 'var(--accent)', textShadow: 'var(--text-glow)', fontSize: 'clamp(7px, 2.2vw, 11px)', lineHeight: 1.1, overflowX: 'auto' }}>
{`  ██╗   ██╗██╗███████╗██╗  ██╗ █████╗ ██╗
  ██║   ██║██║██╔════╝██║  ██║██╔══██╗██║
  ██║   ██║██║███████╗███████║███████║██║
  ╚██╗ ██╔╝██║╚════██║██╔══██║██╔══██║██║
   ╚████╔╝ ██║███████║██║  ██║██║  ██║███████╗
    ╚═══╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝`}
      </pre>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 18, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: 120, height: 120, flex: '0 0 120px',
          border: '1px solid var(--border-bright)',
          background: 'var(--bg-inset)',
          overflow: 'hidden',
          boxShadow: '0 0 12px var(--accent-glow)',
        }}>
          <img
            src="assets/profile.jpg"
            alt={d.user.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05) saturate(0.95)' }}
          />
        </div>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)', letterSpacing: '0.02em' }}>
            {d.user.name}
          </div>
          <div style={{ color: 'var(--fg-dim)', fontSize: 12, marginTop: 4 }}>
            &gt; {d.user.title}
          </div>
          <div style={{ color: 'var(--fg-mute)', fontSize: 11, marginTop: 4, wordBreak: 'break-word' }}>
            [ {d.user.location} · {d.user.email} ]
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg)', borderLeft: '2px solid var(--accent)', paddingLeft: 10 }}>
            {d.user.tagline}
          </div>
        </div>
      </div>

      <TuiDivider label="BIO" />
      {/* Columns rather than one narrow block — the panel is wide, and a
          single pre-wrapped column left most of it empty. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        alignItems: 'start',
      }}>
        {bioParagraphs(d.user.bio).map((p, i) => (
          <p key={i} style={{
            margin: 0,
            color: 'var(--fg-dim)', fontSize: 12.5, lineHeight: 1.75,
            borderLeft: '1px solid var(--border-bright)', paddingLeft: 12,
          }}>
            {p}
          </p>
        ))}
      </div>

      <TuiDivider label="QUICK STATS" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        {stats.map((s) => (
          <Box key={s.k} style={{ margin: 0, padding: '10px 12px' }}>
            <div style={{ color: 'var(--fg-mute)', fontSize: 10, letterSpacing: '0.1em' }}>{s.k}</div>
            <div style={{ color: 'var(--accent)', fontSize: 22, fontWeight: 700, textShadow: 'var(--text-glow)', lineHeight: 1.1 }}>{s.v}</div>
            <div style={{ color: 'var(--fg-dim)', fontSize: 11 }}>{s.sub}</div>
          </Box>
        ))}
      </div>
    </div>
  );
}

// ── Projects (file-browser style) ──────────────────────────────────────
function AppProjects({ initialSelect }) {
  const d = D();
  const [sel, setSel] = React.useState(initialSelect || d.projects[0].id);
  const selected = d.projects.find((p) => p.id === sel) || d.projects[0];

  return (
    <div style={{ height: '100%', display: 'flex', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)' }}>
      {/* File list */}
      <div style={{
        width: 240,
        borderRight: '1px solid var(--border-bright)',
        background: 'var(--bg-inset)',
        overflow: 'auto',
      }}>
        <div style={{ padding: '10px 12px', fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em', borderBottom: '1px solid var(--border)' }}>
          ~/projects/
        </div>
        {d.projects.map((p) => (
          <div
            key={p.id}
            onClick={() => setSel(p.id)}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              background: sel === p.id ? 'var(--sel-bg)' : 'transparent',
              color: sel === p.id ? 'var(--sel-fg)' : 'var(--fg-dim)',
              borderLeft: sel === p.id ? '2px solid var(--accent)' : '2px solid transparent',
              fontSize: 12,
            }}
            onMouseEnter={(e) => { if (sel !== p.id) e.currentTarget.style.background = 'var(--surface-alt)'; }}
            onMouseLeave={(e) => { if (sel !== p.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ color: 'var(--warn)', marginRight: 6 }}>▸</span>
            {p.filename}
          </div>
        ))}
        <div style={{ padding: '14px 12px', fontSize: 10, color: 'var(--fg-mute)' }}>
          {d.projects.length} items · drwxr-xr-x
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflow: 'auto', padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
            {selected.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.08em' }}>
            PROJECT · {selected.id.toUpperCase()}
          </div>
        </div>
        <div style={{ color: 'var(--fg-dim)', fontSize: 12, marginTop: 4 }}>
          &gt; {selected.summary}
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selected.tags.map((t) => <Chip key={t}>{t}</Chip>)}
        </div>

        <TuiDivider label="README.md" />
        <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
          {selected.bullets.map((b, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: 'var(--fg)' }}>
              <span style={{ color: 'var(--accent)', opacity: 0.7, flex: '0 0 auto' }}>▪</span>
              <span style={{ flex: 1 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Experience (timeline) ──────────────────────────────────────────────
function AppExperience() {
  const d = D();
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ cat ~/experience.log</div>
      <TuiDivider />
      {d.experience.map((e, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, border: '2px solid var(--accent)', boxShadow: '0 0 10px var(--accent-glow)', background: 'var(--bg)' }} />
            {i < d.experience.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border-bright)', marginTop: 4 }} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {/* A real logo file if data.js provides one, otherwise the
                  drop-slot so a logo can still be added by hand. */}
              {e.logo ? (
                <div style={{
                  width: 56, height: 56, flex: '0 0 56px',
                  border: '1px solid var(--border-bright)',
                  background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 5, overflow: 'hidden',
                }}>
                  <img
                    src={e.logo}
                    alt={`${e.company} logo`}
                    loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              ) : (
                <image-slot
                  id={e.logoSlotId}
                  placeholder={e.logoPlaceholder || 'drop logo'}
                  shape="rounded"
                  radius="4"
                  fit="contain"
                  style={{
                    width: 56, height: 56, flex: '0 0 56px',
                    border: '1px solid var(--border-bright)',
                    background: 'var(--bg-inset)',
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
                    {e.role} <span style={{ color: 'var(--fg-dim)', fontWeight: 400 }}>@ {e.company}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.06em' }}>
                    {e.period}
                  </div>
                </div>
                <div style={{ color: 'var(--fg-mute)', fontSize: 11, marginTop: 2 }}>[{e.location}]</div>
              </div>
            </div>
            <ul style={{ paddingLeft: 0, listStyle: 'none', margin: '10px 0 0' }}>
              {e.bullets.map((b, j) => (
                <li key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--accent)', opacity: 0.7 }}>▸</span>
                  <span style={{ color: 'var(--fg)' }}>{b}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {e.stack.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Education ──────────────────────────────────────────────────────────
// List body is split out so the showcase can fold it into the About
// section without inheriting the standalone app's prompt line + padding.
function EducationList() {
  const d = D();
  return (
    <>
      {d.education.map((e, i) => (
        <Box key={i} label={`SCHOOL_${String(i + 1).padStart(2, '0')}`}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
            {e.school}
          </div>
          <div style={{ color: 'var(--fg-mute)', fontSize: 11, marginTop: 2 }}>{e.location}</div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: 'var(--fg)', fontSize: 13 }}>{e.degree}</span>
            <span style={{ color: 'var(--fg-dim)', fontSize: 12, letterSpacing: '0.06em' }}>{e.period}</span>
          </div>
          <ul style={{ paddingLeft: 0, listStyle: 'none', margin: '10px 0 0' }}>
            {e.highlights.map((h, j) => (
              <li key={j} style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
                <span style={{ color: 'var(--accent)' }}>★</span> {h}
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </>
  );
}

function AppEducation() {
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ ls -la ~/education/</div>
      <TuiDivider />
      <EducationList />
    </div>
  );
}

// ── Skills ─────────────────────────────────────────────────────────────
function AppSkills() {
  const d = D();
  const groups = Object.entries(d.skills);
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>
        $ cat /etc/skills.conf · {groups.reduce((n, [_, v]) => n + v.length, 0)} entries
      </div>
      <TuiDivider />
      {groups.map(([k, vals]) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <div style={{ color: 'var(--accent)', fontSize: 12, textShadow: 'var(--text-glow)', letterSpacing: '0.08em', marginBottom: 8 }}>
            [{k.toUpperCase()}]
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {vals.map((s) => <Chip key={s}>{s}</Chip>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Achievements ───────────────────────────────────────────────────────
function AppAchievements() {
  const d = D();
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ cat ~/awards.txt</div>
      <TuiDivider />
      {d.achievements.map((a, i) => (
        <Box key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
              {a.type === 'Publication' ? '📜' : '🏆'} {a.title}
            </div>
            <Chip color={a.type === 'Publication' ? 'var(--info)' : 'var(--warn)'}>
              {a.type.toUpperCase()} · {a.year}
            </Chip>
          </div>
          <div style={{ color: 'var(--fg-mute)', fontSize: 11, marginTop: 4 }}>{a.org}</div>
          <div style={{ color: 'var(--fg)', fontSize: 12, marginTop: 8, borderLeft: '2px solid var(--accent)', paddingLeft: 10 }}>
            {a.detail}
          </div>
        </Box>
      ))}
    </div>
  );
}

// ── Contact ────────────────────────────────────────────────────────────
// Real brand marks (Simple Icons paths), not ASCII stand-ins. Each tile
// adopts its brand's own colour on hover.
const BRAND_MARKS = {
  github: ['M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z'],
  linkedin: ['M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],
  gmail: ['M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z'],
  // Document with a folded corner: body cut around the fold, then the fold.
  resume: ['M5 2h8v6h6v14H5V2z', { d: 'M13 2l6 6h-6V2z', o: 0.55 }],
};

// Light values are the official brand colours; dark mode lifts them so a
// near-black mark like GitHub's stays legible on a dark surface.
const BRAND_COLORS = {
  github:   { light: '#24292F', dark: '#E6EDF3' },
  linkedin: { light: '#0A66C2', dark: '#4DA3FF' },
  gmail:    { light: '#EA4335', dark: '#F28B82' },
  resume:   { light: 'var(--accent)', dark: 'var(--accent)' },
};

function BrandMark({ name, size = 18 }) {
  const paths = BRAND_MARKS[name];
  if (!paths) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"
      aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      {paths.map((p, i) => (
        <path key={i} d={typeof p === 'string' ? p : p.d} opacity={typeof p === 'string' ? 1 : p.o} />
      ))}
    </svg>
  );
}

function ContactCard({ item, mode }) {
  const [hover, setHover] = React.useState(false);
  const set = BRAND_COLORS[item.brand] || BRAND_COLORS.resume;
  const color = set[mode === 'dark' ? 'dark' : 'light'];
  const glow = color.charAt(0) === '#' ? color + '59' : 'var(--accent-glow)';
  // On hover the tile fills with the brand colour, so the mark flips to
  // whichever of light/dark reads against it.
  const markColor = hover ? (mode === 'dark' ? '#0d120f' : '#ffffff') : 'var(--accent)';

  return (
    <a
      href={item.url} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        display: 'block', padding: 14, textDecoration: 'none',
        border: `1px solid ${hover ? color : 'var(--border-bright)'}`,
        background: hover ? 'var(--surface-alt)' : 'var(--surface)',
        boxShadow: hover ? `0 0 14px ${glow}` : 'none',
        transition: 'border-color .18s, background .18s, box-shadow .18s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, flex: '0 0 36px',
          border: `1px solid ${hover ? color : 'var(--accent)'}`,
          background: hover ? color : 'transparent',
          color: markColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .18s, border-color .18s, color .18s',
        }}>
          <BrandMark name={item.brand} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: hover ? color : 'var(--accent)',
            fontSize: 13, fontWeight: 700,
            textShadow: hover ? 'none' : 'var(--text-glow)',
            transition: 'color .18s',
          }}>{item.label}</div>
          <div style={{ color: 'var(--fg-mute)', fontSize: 10, marginTop: 2 }}>$ {item.cmd}</div>
        </div>
      </div>
    </a>
  );
}

function AppContact({ mode }) {
  const d = D();
  const links = [
    { brand: 'github',   label: 'GitHub',     url: d.links.github,   cmd: 'open github' },
    { brand: 'linkedin', label: 'LinkedIn',   url: d.links.linkedin, cmd: 'open linkedin' },
    { brand: 'gmail',    label: 'Email',      url: d.links.email,    cmd: 'mail ' + d.user.email },
    { brand: 'resume',   label: 'Resume.pdf', url: d.links.resume,   cmd: 'open resume' },
  ];
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ ./contact.sh --all</div>
      <TuiDivider />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {links.map((l) => <ContactCard key={l.label} item={l} mode={mode} />)}
      </div>
      <TuiDivider label="DIRECT" />
      <div style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
        <div><span style={{ color: 'var(--accent)' }}>email</span>  ─  {d.user.email}</div>
        <div><span style={{ color: 'var(--accent)' }}>phone</span>  ─  {d.user.phone} <span style={{ color: 'var(--fg-mute)', fontSize: 11 }}>· ask by email</span></div>
        <div><span style={{ color: 'var(--accent)' }}>loc&nbsp;&nbsp;</span>  ─  {d.user.location}</div>
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────
function AppSettings({ flavor, mode, onFlavor, onMode }) {
  const flavors = [
    { key: 'phosphor', name: 'PHOSPHOR-9', note: 'green CRT · scanlines' },
    { key: 'amber', name: 'AMBER-7', note: 'amber phosphor · warm' },
    { key: 'neo', name: 'NEO-TERM', note: 'modern dark · cyan' },
  ];
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ settings --interactive</div>
      <TuiDivider label="DISPLAY FLAVOR" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {flavors.map((f) => (
          <button key={f.key} onClick={() => onFlavor(f.key)}
            style={{
              padding: 12,
              border: `1px solid ${flavor === f.key ? 'var(--accent)' : 'var(--border-bright)'}`,
              background: flavor === f.key ? 'var(--surface-alt)' : 'var(--surface)',
              color: flavor === f.key ? 'var(--accent)' : 'var(--fg-dim)',
              textShadow: flavor === f.key ? 'var(--text-glow)' : 'none',
              textAlign: 'left',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              boxShadow: flavor === f.key ? '0 0 12px var(--accent-glow)' : 'none',
            }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{flavor === f.key ? '◉' : '◌'} {f.name}</div>
            <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 4 }}>{f.note}</div>
          </button>
        ))}
      </div>

      <TuiDivider label="COLOR MODE" />
      <div style={{ display: 'flex', gap: 10 }}>
        {[{ k: 'dark', g: '◐' }, { k: 'light', g: '◑' }].map((m) => (
          <button key={m.k} onClick={() => onMode(m.k)}
            style={{
              padding: '10px 18px',
              border: `1px solid ${mode === m.k ? 'var(--accent)' : 'var(--border-bright)'}`,
              background: mode === m.k ? 'var(--surface-alt)' : 'var(--surface)',
              color: mode === m.k ? 'var(--accent)' : 'var(--fg-dim)',
              textShadow: mode === m.k ? 'var(--text-glow)' : 'none',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              flex: 1,
              fontSize: 12,
              letterSpacing: '0.08em',
            }}>
            {m.g} {m.k.toUpperCase()}
          </button>
        ))}
      </div>

      <TuiDivider label="SYSTEM INFO" />
      <div style={{ fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.8 }}>
        <div><span style={{ color: 'var(--accent)' }}>os</span>     ─ VishalRavi's Portfolio OS</div>
        <div><span style={{ color: 'var(--accent)' }}>kernel</span> ─ react.18.3.1-tui</div>
        <div><span style={{ color: 'var(--accent)' }}>shell</span>  ─ /bin/portfolio-sh</div>
        <div><span style={{ color: 'var(--accent)' }}>uptime</span> ─ <Uptime /></div>
      </div>
    </div>
  );
}

function Uptime() {
  const [start] = React.useState(() => Date.now());
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.floor((now - start) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return <span>{h}h {m % 60}m {s % 60}s</span>;
}

// ── Resume viewer ──────────────────────────────────────────────────────
function AppResume() {
  const d = D();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-inset)' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-bright)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
          📄 Vishal_Ravi_Muthaiah_Resume.pdf
        </div>
        <a href={d.links.resume} target="_blank" rel="noreferrer"
          style={{
            fontSize: 11, color: 'var(--accent)', textShadow: 'var(--text-glow)',
            border: '1px solid var(--accent)', padding: '3px 10px',
            textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
          }}>↗ OPEN IN NEW TAB</a>
      </div>
      <iframe src={d.links.resume} title="Resume" style={{ flex: 1, width: '100%', border: 0, background: '#fff' }} />
    </div>
  );
}

// ── Help ───────────────────────────────────────────────────────────────
function AppHelp() {
  const cmds = [
    ['help', 'show this list'],
    ['ls / dir', 'list available apps'],
    ['open <app>', 'launch an app window'],
    ['about', 'print bio'],
    ['projects [n]', 'list projects or open #n'],
    ['experience', 'work history'],
    ['education', 'degrees'],
    ['skills', 'tech stack'],
    ['awards', 'publications & awards'],
    ['contact', 'show contact info'],
    ['cat resume.txt', 'plain-text resume'],
    ['whoami', 'current user'],
    ['date', 'current datetime'],
    ['theme <flavor>', 'phosphor | amber | neo'],
    ['mode <dark|light>', 'switch color mode'],
    ['neofetch', 'system summary'],
    ['clear', 'clear the screen'],
    ['exit / close', 'close terminal'],
  ];
  return (
    <div style={appPad}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em' }}>$ man portfolio-sh</div>
      <TuiDivider label="COMMANDS" />
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <tbody>
          {cmds.map(([c, d]) => (
            <tr key={c}>
              <td style={{ padding: '4px 12px 4px 0', color: 'var(--accent)', textShadow: 'var(--text-glow)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                {c}
              </td>
              <td style={{ padding: '4px 0', color: 'var(--fg-dim)' }}>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Showcase deck ──────────────────────────────────────────────────────
// Every section is already "open" as a window panel the moment the desktop
// appears — no clicking, no double-clicking. The panels sit in a scroll layer
// to the right of the desktop icons, so the wallpaper still shows around them
// and real OSWindows (opened from an icon or the terminal) float above.
//
// Scrolling from one section to the next is the animation: the panel nearest
// the middle of the view takes focus (accent chrome + glow) exactly as a real
// window does, while the others recede. Panels also open on first reveal.

const DECK_SECTIONS = [
  { id: 'about',        title: 'About — VishalRavi', icon: '◆',  label: 'ABOUT' },
  { id: 'experience',   title: 'Experience',         icon: '▶',  label: 'EXPERIENCE' },
  { id: 'projects',     title: 'Projects',           icon: '▦',  label: 'PROJECTS' },
  { id: 'skills',       title: 'Skills',             icon: '✦',  label: 'SKILLS' },
  { id: 'achievements', title: 'Achievements',       icon: '🏆', label: 'AWARDS' },
  { id: 'contact',      title: 'Contact',            icon: '@',  label: 'CONTACT' },
];

const EASE = 'cubic-bezier(.22,.68,.28,1)';

// A section rendered with the same chrome as a real OSWindow, so the deck
// reads as a desktop full of already-open windows.
function DeckPanel({ id, title, icon, index, active, phone, panelRef, scrollRef, onFocusSection, children }) {
  const [open, setOpen] = React.useState(index === 0);
  const [hover, setHover] = React.useState(false);
  // Hovering lifts a panel the same way scrolling to it does, so pointing at
  // a section previews it before you commit to scrolling there.
  const lifted = active || hover;

  // Reveal on first scroll into view.
  React.useEffect(() => {
    const el = panelRef.current;
    const scroller = scrollRef.current;
    if (!el || !scroller || typeof IntersectionObserver === 'undefined') { setOpen(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOpen(true); obs.disconnect(); } },
      { root: scroller, threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const btn = (label, color) => (
    <span style={{
      width: 18, height: 16, fontSize: 11,
      border: '1px solid var(--border-bright)',
      color: color || 'var(--fg-dim)', background: 'transparent',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
    }}>{label}</span>
  );

  return (
    <section
      ref={panelRef}
      data-section={id}
      onMouseDown={() => onFocusSection(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        scrollMarginTop: 14,
        background: 'var(--surface)',
        border: `1px solid ${lifted ? 'var(--accent)' : 'var(--border-bright)'}`,
        boxShadow: lifted ? 'var(--shadow), 0 0 24px var(--accent-glow)' : 'none',
        fontFamily: 'var(--font-mono)',
        display: 'flex', flexDirection: 'column',
        // The section-to-section animation: the panel you are on sits at full
        // size and brightness while the rest shrink back, so it is obvious
        // which section you are heading into.
        opacity: open ? (lifted ? 1 : (phone ? 0.72 : 0.55)) : 0,
        transform: open
          ? `scale(${lifted ? 1 : (phone ? 0.99 : 0.95)})`
          : `translateY(26px) scale(${phone ? 0.98 : 0.93})`,
        // Shrink toward the top edge so a panel's position stays predictable.
        transformOrigin: 'center top',
        transition: `opacity .45s ${EASE}, transform .45s ${EASE}, box-shadow .35s ${EASE}, border-color .35s ${EASE}`,
        willChange: 'opacity, transform',
      }}
    >
      {/* Title bar — matches OSWindow's chrome */}
      <div style={{
        height: 28, flex: '0 0 28px',
        background: active ? 'var(--surface-alt)' : 'var(--bg-inset)',
        borderBottom: '1px solid var(--border-bright)',
        display: 'flex', alignItems: 'center',
        padding: '0 6px', gap: 8, userSelect: 'none',
        color: active ? 'var(--accent)' : 'var(--fg-dim)',
        textShadow: active ? 'var(--text-glow)' : 'none',
        transition: `color .35s ${EASE}, background .35s ${EASE}`,
      }}>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        <span style={{ display: 'flex', gap: 4 }}>
          {btn('_')}{btn('□')}{btn('×', 'var(--danger)')}
        </span>
      </div>

      {/* The apps were sized for small floating windows; at full deck width
          that text is too small to read comfortably. zoom scales the whole
          subtree — unlike transform it reflows, so nothing overflows. */}
      <div style={{ background: 'var(--surface)', zoom: phone ? 1 : 1.15 }}>{children}</div>
    </section>
  );
}

// Flow-friendly projects. AppProjects is a fixed-height master/detail pane,
// which cannot work in a scrolling panel — so every project is shown at once
// rather than hidden behind a click.
function DeckProjects() {
  const d = D();
  return (
    <div style={{ ...appPad, display: 'grid', gap: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.1em', marginBottom: 4 }}>
        $ ls ~/projects/ · {d.projects.length} items
      </div>
      {d.projects.map((p) => (
        <Box key={p.id} label={p.filename}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>
              {p.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.08em' }}>{p.id.toUpperCase()}</div>
          </div>
          <div style={{ color: 'var(--fg-dim)', fontSize: 12, marginTop: 4 }}>&gt; {p.summary}</div>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.tags.map((t) => <Chip key={t}>{t}</Chip>)}
          </div>
          <ul style={{ paddingLeft: 0, listStyle: 'none', margin: '12px 0 0' }}>
            {p.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 12.5, color: 'var(--fg)' }}>
                <span style={{ color: 'var(--accent)', opacity: 0.7, flex: '0 0 auto' }}>▪</span>
                <span style={{ flex: 1 }}>{b}</span>
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </div>
  );
}

function ShowcaseDeck({ navRef, mode, phone, narrow }) {
  const scrollRef = React.useRef(null);
  const refs = React.useRef({});
  const [active, setActive] = React.useState(DECK_SECTIONS[0].id);
  const [progress, setProgress] = React.useState(0);
  const [hoverId, setHoverId] = React.useState(null);
  // Trailing space so even the final panel can scroll up to the focus line —
  // without it the last section could never take focus.
  const [padBottom, setPadBottom] = React.useState(160);

  DECK_SECTIONS.forEach((s) => { if (!refs.current[s.id]) refs.current[s.id] = React.createRef(); });

  const goTo = React.useCallback((id) => {
    const el = refs.current[id] && refs.current[id].current;
    if (!el) return false;
    setActive(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }, []);

  // Let the desktop icons drive the deck.
  React.useEffect(() => {
    if (navRef) navRef.current = goTo;
    return () => { if (navRef) navRef.current = null; };
  }, [navRef, goTo]);

  React.useEffect(() => {
    const scroller = scrollRef.current;
    const lastRef = refs.current[DECK_SECTIONS[DECK_SECTIONS.length - 1].id];
    const calc = () => {
      const last = lastRef && lastRef.current;
      if (!scroller || !last) return;
      setPadBottom(Math.max(40, Math.round(scroller.clientHeight - last.offsetHeight - 24)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Focus follows the panel scrolled up to the focus line.
  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        // Focus goes to the last panel whose top has crossed the focus line.
        // The trailing pad below guarantees every panel — including the last —
        // can actually reach it.
        // offsetTop rather than getBoundingClientRect: the focus animation
        // scales the panels, and measuring the transformed box would feed the
        // result back into the very thing that produced it.
        const line = scroller.scrollTop + scroller.clientHeight * 0.4;
        let best = DECK_SECTIONS[0].id;
        for (const s of DECK_SECTIONS) {
          const el = refs.current[s.id].current;
          if (el && el.offsetTop <= line) best = s.id;
        }
        setActive(best);
        const max = scroller.scrollHeight - scroller.clientHeight;
        setProgress(max > 0 ? Math.min(1, scroller.scrollTop / max) : 0);
      });
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { scroller.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const activeIdx = Math.max(0, DECK_SECTIONS.findIndex((s) => s.id === active));

  const body = (id) => {
    if (id === 'about') {
      // Education lives inside About rather than in a window of its own.
      return (
        <>
          <AppAbout />
          <div style={{ padding: '0 18px 18px' }}>
            <TuiDivider label="EDUCATION" />
            <EducationList />
          </div>
        </>
      );
    }
    if (id === 'experience') return <AppExperience />;
    if (id === 'projects') return <DeckProjects />;
    if (id === 'skills') return <AppSkills />;
    if (id === 'achievements') return <AppAchievements />;
    return <AppContact mode={mode} />;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      {/* Section rail — where you are, and a click to jump */}
      <div style={{
        position: 'absolute', right: phone ? 4 : 10, top: '50%', transform: 'translateY(-50%)',
        zIndex: 3, display: 'flex', flexDirection: 'column', gap: phone ? 12 : 8,
        alignItems: 'flex-end', pointerEvents: 'auto',
      }}>
        {DECK_SECTIONS.map((s, i) => {
          const on = s.id === active;
          const hot = s.id === hoverId;
          return (
            <button
              key={s.id}
              onClick={() => goTo(s.id)}
              title={s.label}
              aria-current={on ? 'true' : undefined}
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId((h) => (h === s.id ? null : h))}
              onFocus={() => setHoverId(s.id)}
              onBlur={() => setHoverId((h) => (h === s.id ? null : h))}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'transparent', border: 0,
                // Tablets are touch devices too, so the hit area has to grow
                // wherever the rail is drawn as bare dots, not just on phones.
                padding: narrow ? '13px 8px' : '2px 0',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                color: on || hot ? 'var(--accent)' : 'var(--fg-mute)',
                textShadow: on || hot ? 'var(--text-glow)' : 'none',
                fontSize: 9, letterSpacing: '0.14em',
                opacity: on || hot ? 1 : 0.5,
                // Pointing at an entry enlarges it as a preview; once you
                // actually scroll there it becomes the active entry and
                // settles back to normal size.
                transform: hot && !on ? 'scale(1.45)' : 'scale(1)',
                transformOrigin: 'right center',
                transition: `opacity .25s ${EASE}, color .25s ${EASE}, transform .25s ${EASE}`,
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{!narrow && (on || hot) ? s.label : ''}</span>
              <span style={{
                width: phone ? (on ? 14 : 8) : (on ? 22 : (hot ? 18 : 12)),
                height: phone ? 3 : 2,
                background: on || hot ? 'var(--accent)' : 'var(--fg-mute)',
                boxShadow: on || hot ? '0 0 8px var(--accent-glow)' : 'none',
                transition: `width .3s ${EASE}, background .25s ${EASE}`,
              }} />
            </button>
          );
        })}
      </div>

      {/* Scroll progress */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 2, zIndex: 4,
        background: 'transparent', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%', width: `${progress * 100}%`,
          background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)',
          transition: 'width .1s linear',
        }} />
      </div>

      <div
        ref={scrollRef}
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto', overflowX: 'hidden',
          padding: phone
            ? `10px 22px ${padBottom}px 10px`
            : (narrow
              ? `14px 30px ${padBottom}px 14px`
              : `14px 88px ${padBottom}px 14px`),
          display: 'flex', flexDirection: 'column', gap: phone ? 12 : 18,
          pointerEvents: 'auto',
          // Deliberately not scroll-behavior:smooth — that would make the
          // wheel feel floaty. goTo() asks for smooth explicitly instead.
        }}
      >
        {DECK_SECTIONS.map((s, i) => (
          <DeckPanel
            key={s.id}
            id={s.id}
            title={s.title}
            icon={s.icon}
            index={i}
            active={s.id === active}
            phone={phone}
            panelRef={refs.current[s.id]}
            scrollRef={scrollRef}
            onFocusSection={setActive}
          >
            {body(s.id)}
          </DeckPanel>
        ))}

        <div style={{
          padding: '4px 2px 0', textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-mute)',
          letterSpacing: '0.08em', opacity: 0.7,
        }}>
          ── end of transmission · {activeIdx + 1}/{DECK_SECTIONS.length} · double-click an icon to open the real app ──
        </div>
      </div>
    </div>
  );
}

window.ShowcaseDeck = ShowcaseDeck;
window.DECK_SECTION_IDS = DECK_SECTIONS.map((s) => s.id);

window.OS_APPS = {
  about: AppAbout,
  projects: AppProjects,
  experience: AppExperience,
  education: AppEducation,
  skills: AppSkills,
  achievements: AppAchievements,
  contact: AppContact,
  settings: AppSettings,
  resume: AppResume,
  help: AppHelp,
};
