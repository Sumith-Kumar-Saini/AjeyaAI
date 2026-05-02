import { motion } from "motion/react";
import logo from "@/assets/images/logo-full.png";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

const Navbar = () => {
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Login", href: "/sign-in" },
  ];

  return (
    <nav className="w-full h-16 flex items-center overflow-clip">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center justify-between">
        {/* Left Section: Logo */}
        <Link
          to="/"
          className="relative h-10 w-32 overflow-hidden flex items-center"
        >
          <img
            src={logo}
            alt="Ajeya Logo"
            className="absolute inset-0 h-full object-contain w-24"
          />
        </Link>

        {/* Center Section: Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section: CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button className="hidden sm:block relative h-10 overflow-hidden rounded-sm bg-foreground text-background px-6">
            Book a Demo
          </Button>

          {/* Mobile Menu Button */}
          <Button
            className="lg:hidden p-2 text-foreground rounded-sm bg-transparent hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-foreground"
            aria-label="Menu"
          >
            <Menu />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
