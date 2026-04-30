'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export default function MobileNavMenu({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <div className="lg:hidden flex items-center" style={{ position: 'relative' }}>
      <button 
        type="button"
        onClick={toggle}
        onTouchEnd={(e) => { e.preventDefault(); toggle(); }}
        style={{ minWidth: 44, minHeight: 44, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className="text-foreground focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div
          style={{ position: 'fixed', top: 80, left: 16, right: 16, zIndex: 9999, background: 'var(--card)', borderColor: 'var(--border)' }}
          className="rounded-2xl p-4 flex flex-col gap-2 shadow-2xl border"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

