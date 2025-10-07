"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const path = usePathname()

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Rides", href: "/rides" },
    { label: "Payments", href: "/payments" }
  ]

  return (
    <aside className="w-60 bg-gray-800 text-white p-4 flex-shrink-0">
      <div className="text-xl font-semibold mb-6">Menu</div>
      <ul>
        {links.map((l) => (
          <li key={l.href} className="mb-2">
            <Link
              href={l.href}
              className={`block px-3 py-2 rounded ${path === l.href ? "bg-gray-700" : "hover:bg-gray-700"}`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
