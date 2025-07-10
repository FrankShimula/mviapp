import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-zinc-800 text-white sticky top-0 z-50">
        {/* left: logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          lettermoxd
        </Link>

        {/* center: nav links */}
        <div className="flex gap-6 text-sm items-center">
          <NavItem to="/movies" label="Browse" />
          <NavItem to="/watchlist" label="Watchlist" />
          <NavItem to="/dashboard" label="Dashboard" />
        </div>

        {/* right: auth controls */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link
              to="/sign-up"
              className="text-sm bg-white text-zinc-950 px-3 py-1 rounded hover:bg-zinc-100 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="text-sm border px-3 py-1 rounded border-white hover:bg-white hover:text-zinc-950 transition"
            >
              Sign In
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm px-2 py-1 border rounded border-white hover:bg-zinc-800 transition"
            >
              Sign Out
            </button>
          </SignedIn>
        </div>
      </nav>

      {/* modal overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded shadow-lg w-full max-w-xs">
            <p className="text-white mb-4 text-center">Sign out of your account?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded bg-zinc-700 text-white hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-white border-b-2 border-white pb-1"
          : "text-zinc-400 hover:text-white transition"
      }
    >
      {label}
    </NavLink>
  );
}
