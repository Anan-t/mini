import Navbar from './Navbar';
import { API_BASE_URL } from '../../config/api';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line/70 px-5 py-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>Veritas weighs evidence. Read the sources before you share.</p>
          <p className="font-mono text-[11px] text-mist/70">API {API_BASE_URL}</p>
        </div>
      </footer>
    </div>
  );
}
