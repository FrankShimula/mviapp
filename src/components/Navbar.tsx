import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-zinc-800 text-white sticky top-0 z-50">
      {/* left: logo */}
      <Link to="/" className="text-2xl font-bold tracking-tight text-white">
        lettermoxd
      </Link>

      {/* center: nav links */}
      <div className="flex gap-6 text-sm items-center">
        <NavItem to="/movies" label="Browse" />
        <NavItem to="/watchlist" label="Watchlist" />
        <NavItem to="/rated" label="Rated" />
        <NavItem to="/dashboard" label="Dashboard" />
      </div>

      {/* right: auth stuff */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link to="/sign-in" className="text-sm border px-3 py-1 rounded border-white">
            Sign In
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
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
