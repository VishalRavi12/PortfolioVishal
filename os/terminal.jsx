// Terminal app for VishalRavi's Portfolio OS
// Working REPL with command history, tab-completion stubs, ANSI-ish output.
// Props:
//   wm          — window manager API (open/close/focus)
//   themeApi    — { flavor, mode, setFlavor, setMode }
//   winId       — this terminal's window id (for exit/close)
//   bootLines   — optional lines to print on first mount
//   initialCmd  — optional first command to run

function AppTerminal({ wm, themeApi, winId, bootLines, initialCmd }) {
  const d = window.PORTFOLIO_DATA;
  const user = d.user.handle;
  const host = "portfolio";

  const [lines, setLines] = React.useState(() => {
    const intro = bootLines || [
      { kind: 'sys', text: `portfolio-sh v1.0.0 — type 'help' for available commands` },
      { kind: 'sys', text: `last login: ${new Date().toLocaleString()}` },
      { kind: 'sys', text: '' },
    ];
    return intro;
  });
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [histIdx, setHistIdx] = React.useState(-1);
  const inputRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const appsForOpen = {
    about: { title: 'About — VishalRavi', icon: '◆', w: 680, h: 540 },
    projects: { title: 'Projects', icon: '▦', w: 760, h: 520 },
    experience: { title: 'Experience', icon: '▶', w: 720, h: 540 },
    education: { title: 'Education', icon: '★', w: 640, h: 460 },
    skills: { title: 'Skills', icon: '✦', w: 680, h: 480 },
    achievements: { title: 'Achievements', icon: '🏆', w: 640, h: 440 },
    awards: { appKey: 'achievements', title: 'Achievements', icon: '🏆', w: 640, h: 440 },
    publications: { appKey: 'achievements', title: 'Achievements', icon: '🏆', w: 640, h: 440 },
    contact: { title: 'Contact', icon: '@', w: 620, h: 440 },
    settings: { title: 'Settings', icon: '⚙', w: 560, h: 480 },
    resume: { title: 'Resume.pdf', icon: '📄', w: 760, h: 560 },
    help: { title: 'Help', icon: '?', w: 540, h: 500 },
  };

  const print = (kind, text) => setLines((ls) => [...ls, ...(Array.isArray(text) ? text.map((t) => ({ kind, text: t })) : [{ kind, text }])]);

  const exec = React.useCallback((raw) => {
    const cmd = (raw || '').trim();
    if (!cmd) { print('prompt', ''); return; }
    print('echo', cmd);

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    const lc = head.toLowerCase();

    switch (lc) {
      case 'help':
      case 'man':
      case '?': {
        print('out', [
          '  help              show this list',
          '  ls / dir          list available apps',
          '  open <app>        launch an app window',
          '  about             print bio',
          '  projects [n]      list projects or open #n',
          '  experience        work history',
          '  education         degrees',
          '  skills            tech stack',
          '  awards            publications & awards',
          '  contact           show contact info',
          '  cat resume.txt    plain-text resume',
          '  whoami            current user',
          '  date              current datetime',
          '  theme <flavor>    phosphor | amber | neo',
          '  mode <dark|light> switch color mode',
          '  neofetch          system summary',
          '  history           command history',
          '  clear             clear the screen',
          '  exit              close terminal',
        ]);
        break;
      }
      case 'ls':
      case 'dir': {
        print('out', [
          '\u00A0 about/        projects/     experience/   education/',
          '\u00A0 skills/       achievements/ contact/      settings/',
          '\u00A0 resume.pdf    README.md     ~/.bashrc',
        ]);
        break;
      }
      case 'open': {
        const k = (arg || '').toLowerCase().trim().replace(/[.]\w+$/, ''); // strip .pdf etc
        const target = appsForOpen[k];
        if (!target) {
          print('err', `open: no such app: ${arg || '(empty)'} — try 'ls'`);
        } else {
          wm.open({ appKey: target.appKey || k, ...target });
          print('out', `launching ${k} …`);
        }
        break;
      }
      case 'about':
        wm.open({ appKey: 'about', ...appsForOpen.about });
        print('out', 'opening about/ …');
        break;
      case 'projects': {
        const n = parseInt(arg, 10);
        if (!isNaN(n) && d.projects[n - 1]) {
          wm.open({ appKey: 'projects', ...appsForOpen.projects, props: { initialSelect: d.projects[n - 1].id } });
          print('out', `opening project #${n} (${d.projects[n - 1].name}) …`);
        } else if (!arg) {
          print('out', d.projects.map((p, i) => `  [${i + 1}] ${p.name.padEnd(46)}  ${p.tags.slice(0, 2).join(', ')}`));
          print('hint', `tip: 'projects 1' opens project #1`);
        } else {
          print('err', `projects: invalid index '${arg}'`);
        }
        break;
      }
      case 'experience':
        wm.open({ appKey: 'experience', ...appsForOpen.experience });
        print('out', 'opening experience.log …');
        break;
      case 'education':
        wm.open({ appKey: 'education', ...appsForOpen.education });
        print('out', 'opening education/ …');
        break;
      case 'skills':
        wm.open({ appKey: 'skills', ...appsForOpen.skills });
        print('out', 'opening skills.conf …');
        break;
      case 'awards':
      case 'publications':
      case 'achievements':
        wm.open({ appKey: 'achievements', ...appsForOpen.achievements });
        print('out', 'opening awards.txt …');
        break;
      case 'contact':
        wm.open({ appKey: 'contact', ...appsForOpen.contact });
        print('out', 'opening contact.sh …');
        break;
      case 'settings':
        wm.open({ appKey: 'settings', ...appsForOpen.settings });
        print('out', 'opening system settings …');
        break;
      case 'resume':
        wm.open({ appKey: 'resume', ...appsForOpen.resume });
        print('out', 'opening resume.pdf …');
        break;
      case 'cat': {
        if (arg.toLowerCase().includes('resume')) {
          print('out', [
            `╔═══════════════════════════════════════════════════════════════════╗`,
            `║ ${d.user.name.padEnd(65)} ║`,
            `║ ${d.user.title.padEnd(65)} ║`,
            `╚═══════════════════════════════════════════════════════════════════╝`,
            `  ${d.user.email} · ${d.user.phone} · ${d.user.location}`,
            '',
            '  > Master\'s in Data Science @ University at Buffalo, SUNY',
            '  > Prior: SWE @ L&T · ML Intern @ Bosch, Neuberg-Anand',
            '  > Focus: Multi-Agent RL, Medical Imaging, Recommender Systems',
            '',
            `  type 'open resume' for full PDF`,
          ]);
        } else if (arg.toLowerCase().includes('readme')) {
          print('out', [
            '# VishalRavi\'s Portfolio OS',
            '',
            '  An interactive TUI-style portfolio. Drag windows, run commands,',
            '  right-click the desktop, hop between flavors in Settings.',
            '',
            '  $ help     # to begin',
          ]);
        } else {
          print('err', `cat: ${arg}: No such file or directory`);
        }
        break;
      }
      case 'whoami':
        print('out', user);
        break;
      case 'pwd':
        print('out', `/home/${user}`);
        break;
      case 'date':
        print('out', new Date().toString());
        break;
      case 'echo':
        print('out', arg);
        break;
      case 'theme': {
        const v = arg.toLowerCase().trim();
        if (['phosphor', 'amber', 'neo'].includes(v)) {
          themeApi.setFlavor(v);
          print('out', `theme set to '${v}'`);
        } else {
          print('err', `theme: choose one of [phosphor, amber, neo]`);
        }
        break;
      }
      case 'mode': {
        const v = arg.toLowerCase().trim();
        if (v === 'dark' || v === 'light') {
          themeApi.setMode(v);
          print('out', `color mode set to '${v}'`);
        } else {
          print('err', `mode: choose 'dark' or 'light'`);
        }
        break;
      }
      case 'neofetch': {
        const ascii = [
          '       ▄▄▄▄▄▄▄▄▄▄▄       ',
          '    ▄█▀▀         ▀▀█▄    ',
          '   █▀  ╔═══════╗   ▀█    ',
          '  █    ║ vishal║    █    ',
          '  █    ║ @ os  ║    █    ',
          '   █▄  ╚═══════╝  ▄█    ',
          '    ▀█▄▄       ▄▄█▀     ',
          '       ▀▀▀▀▀▀▀▀▀         ',
        ];
        const info = [
          `${user}@${host}`,
          '──────────────────',
          `OS:       VishalRavi's Portfolio OS`,
          `Kernel:   react.18.3.1-tui`,
          `Shell:    portfolio-sh`,
          `Theme:    ${themeApi.flavor} / ${themeApi.mode}`,
          `Resolution: ${window.innerWidth}×${window.innerHeight}`,
          `WM:       portfolio-wm`,
          `CPU:      ${navigator.hardwareConcurrency || 8}-core`,
          `Memory:   ${(navigator.deviceMemory || 8)} GiB`,
          `Uptime:   since you loaded the page`,
        ];
        const merged = [];
        const max = Math.max(ascii.length, info.length);
        for (let i = 0; i < max; i++) {
          merged.push(`${(ascii[i] || '').padEnd(26)} ${info[i] || ''}`);
        }
        print('art', merged);
        break;
      }
      case 'history':
        print('out', history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`));
        break;
      case 'clear':
      case 'cls':
        setLines([]);
        return;
      case 'exit':
      case 'logout':
      case 'close':
        wm.close(winId);
        return;
      case 'sudo':
        print('err', `${user} is not in the sudoers file. This incident will be reported. 🙃`);
        break;
      default:
        print('err', `${head}: command not found — try 'help'`);
    }
  }, [d, history, themeApi, wm, winId, user]);

  // Initial command (e.g. 'neofetch' on boot)
  React.useEffect(() => {
    if (initialCmd) {
      setTimeout(() => exec(initialCmd), 200);
    }
    // eslint-disable-next-line
  }, []);

  // Auto-scroll on new lines
  React.useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [lines]);

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = input;
      setInput('');
      if (cmd.trim()) {
        setHistory((h) => [...h, cmd]);
        setHistIdx(-1);
      }
      exec(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const newIdx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(newIdx);
      setInput(history[newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!history.length || histIdx < 0) return;
      const newIdx = histIdx + 1;
      if (newIdx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const known = ['help', 'ls', 'open', 'about', 'projects', 'experience', 'education', 'skills', 'awards', 'contact', 'settings', 'resume', 'whoami', 'date', 'theme', 'mode', 'neofetch', 'history', 'clear', 'exit', 'cat'];
      const m = known.filter((k) => k.startsWith(input.toLowerCase()));
      if (m.length === 1) setInput(m[0] + ' ');
      else if (m.length > 1) print('out', m.join('  '));
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  const Prompt = () => (
    <span>
      <span style={{ color: 'var(--accent)', textShadow: 'var(--text-glow)' }}>{user}@{host}</span>
      <span style={{ color: 'var(--fg-dim)' }}>:</span>
      <span style={{ color: 'var(--info)' }}>~</span>
      <span style={{ color: 'var(--fg-dim)' }}>$ </span>
    </span>
  );

  const renderLine = (line, i) => {
    if (line.kind === 'echo') {
      return (
        <div key={i} style={{ display: 'flex', whiteSpace: 'pre-wrap' }}>
          <Prompt />
          <span style={{ color: 'var(--fg)' }}>{line.text}</span>
        </div>
      );
    }
    const colors = {
      out: 'var(--fg-dim)',
      sys: 'var(--fg-mute)',
      err: 'var(--danger)',
      hint: 'var(--warn)',
      art: 'var(--accent)',
    };
    return (
      <div key={i} style={{
        whiteSpace: 'pre',
        color: colors[line.kind] || 'var(--fg-dim)',
        textShadow: line.kind === 'art' ? 'var(--text-glow)' : 'none',
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden',
      }}>{line.text || '\u00A0'}</div>
    );
  };

  return (
    <div
      onClick={() => inputRef.current && inputRef.current.focus()}
      ref={scrollerRef}
      style={{
        height: '100%',
        background: 'var(--bg)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        padding: 12,
        overflow: 'auto',
        lineHeight: 1.4,
      }}
    >
      {lines.map(renderLine)}
      <div style={{ display: 'flex', whiteSpace: 'pre-wrap' }}>
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--fg)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            caretColor: 'var(--accent)',
          }}
        />
      </div>
    </div>
  );
}

window.AppTerminal = AppTerminal;
