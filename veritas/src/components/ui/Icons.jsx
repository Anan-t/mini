const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

const Svg = ({ children, className = 'h-5 w-5', ...rest }) => (
  <svg {...base} className={className} aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const ShieldIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </Svg>
);

export const TextIcon = (props) => (
  <Svg {...props}>
    <path d="M4 6h16M4 12h11M4 18h7" />
  </Svg>
);

export const ImageIcon = (props) => (
  <Svg {...props}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <circle cx="8.5" cy="10" r="1.6" />
    <path d="m4 17 4.6-4.2a2 2 0 0 1 2.7 0L20 20" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h13m-5-5 5 5-5 5" />
  </Svg>
);

export const ArrowUpIcon = (props) => (
  <Svg {...props}>
    <path d="M12 19V5m-6 6 6-6 6 6" />
  </Svg>
);

export const HistoryIcon = (props) => (
  <Svg {...props}>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3.5 4.5V9H8" />
    <path d="M12 8v4.3l2.8 1.7" />
  </Svg>
);

export const TrashIcon = (props) => (
  <Svg {...props}>
    <path d="M4.5 7h15M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
    <path d="M6.5 7 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
  </Svg>
);

export const LinkIcon = (props) => (
  <Svg {...props}>
    <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.2 1.2" />
    <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.2-1.2" />
  </Svg>
);

export const AlertIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4.5 3 19.5h18L12 4.5Z" />
    <path d="M12 10v4m0 3h.01" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const WaveIcon = (props) => (
  <Svg {...props}>
    <path d="M5 10v4M9 6.5v11M12 9v6M15 5.5v13M19 10v4" />
  </Svg>
);

export const MicIcon = (props) => (
  <Svg {...props}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.5V21m-3 0h6" />
  </Svg>
);

export const StopIcon = (props) => (
  <Svg {...props}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none" />
  </Svg>
);

export const PaperclipIcon = (props) => (
  <Svg {...props}>
    <path d="M19 11.5 12.4 18a4.2 4.2 0 0 1-6-6l7-7a2.9 2.9 0 0 1 4.1 4.1l-7 7a1.6 1.6 0 0 1-2.2-2.2l6.3-6.3" />
  </Svg>
);

export const FileIcon = (props) => (
  <Svg {...props}>
    <path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5l-5-5Z" />
    <path d="M13.5 3.5v5h5M9 13h6m-6 3.5h4" />
  </Svg>
);

export const SearchDocIcon = (props) => (
  <Svg {...props}>
    <path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5l-5-5Z" />
    <circle cx="11.5" cy="13" r="2.6" />
    <path d="m13.6 15.1 1.9 1.9" />
  </Svg>
);
