import Link from "next/link";

const Nav = () => {
  const navItems = [
    { href: "/board", label: "Board" },
    { href: "/discover", label: "Discover" },
    { href: "/library", label: "Library" },
    { href: "/calendar", label: "Calendar" },
    { href: "/addons", label: "Addons" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-zinc-800 text-white p-4 flex gap-4 fixed top-0 w-full z-10">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="hover:text-zinc-300">
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
