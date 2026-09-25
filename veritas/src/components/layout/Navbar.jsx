import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../ui/Logo';
import { CloseIcon, MenuIcon } from '../ui/Icons';
import { useHistory } from '../../context/HistoryContext';

const links = [
  { to: '/', label: 'Chat', end: true },
  { to: '/verify', label: 'Verify' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { entries } = useHistory();

  const linkClass = ({ isActive }) =>
    [
      'rounded-lg px-3 py-2 text-sm transition-colors',
      isActive ? 'bg-ink-800 text-frost' : 'text-mist hover:text-frost',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="rounded-lg" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
              {link.to === '/history' && entries.length > 0 && (
                <span className="ml-1.5 font-mono text-[11px] text-signal">{entries.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-mist hover:text-frost sm:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line/70 px-5 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
