'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  BookDashed,
  BriefcaseMedical,
  Pill,
  SendToBack,
  User2Icon,
} from 'lucide-react';
import { COLOR_PALETTE2 } from '../variables';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'medicines',
    href: '/dashboard/medicines',
    icon: Pill,
  },
  { name: 'Appointments', href: '/dashboard/appointments', icon: BookDashed },
  { name: 'Doctors', href: '/dashboard/doctors', icon: BriefcaseMedical },
  { name: 'Orders', href: '/dashboard/orders', icon: SendToBack },
  { name: 'Profile', href: '/dashboard/profile', icon: User2Icon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {' '}
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-[#dfe9f1]  md:flex-none md:justify-start md:p-2 md:px-3',
            )}
            style={{
              backgroundColor:
                pathname === link.href
                  ? COLOR_PALETTE2.lightblue
                  : COLOR_PALETTE2.lightgray,
            }}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
