'use client';

import { LoaderIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { menuOptions } from '@/components/chat/user-avatar/menu-options';
import type { User } from '@/lib/auth/types';
import { signOut } from '@/lib/auth/sign-out';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

export const UserMenu = ({
  user,
}: {
  user: User;
}) => {
  const [loading, setLoading] = useState(false);

  const onSignOut = async () => {
    setLoading(true);
    await signOut();
    window.location.href = '/';
  };

  const renderMenuOptions = () =>
    menuOptions.map((menuOption) => (
      <Fragment key={menuOption.title}>
        {menuOption.separator && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          <Link
            rel="noopener noreferrer"
            href={menuOption.href}
            target="_blank"
            className="cursor-pointer"
          >
            {menuOption.title}
          </Link>
        </DropdownMenuItem>
      </Fragment>
    ));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="size-7 flex rounded-full border-0 bg-transparent p-0 order-4"
          aria-label="User menu"
        >
          {loading ? (
            <LoaderIcon
              className="size-4.5 stroke-primary animate-spin"
              aria-label="Loading"
            />
          ) : (
            <Avatar className="border size-7" aria-label="user menu">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? 'User avatar'}
              />
              <AvatarFallback className="bg-primary">
                <UserIcon className="size-4.5" />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="truncate text-muted-foreground first-letter:uppercase">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:!bg-popover inline-flex w-full justify-between py-1"
          onSelect={(e) => e.preventDefault()}
        >
          <p>Theme</p>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {renderMenuOptions()}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full cursor-pointer"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
