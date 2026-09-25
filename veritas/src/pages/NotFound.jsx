import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-5 py-24 text-center">
      <p className="font-mono text-sm text-signal">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-frost">
        This page doesn't exist
      </h1>
      <p className="mt-2 text-sm text-mist">Check the address, or head back and run a check.</p>
      <Button as={Link} to="/" className="mt-6">
        Back to Veritas
      </Button>
    </div>
  );
}
