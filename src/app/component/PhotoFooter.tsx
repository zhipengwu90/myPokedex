"use client";

import IconSnap from "../imgs/IconSnapDark.png";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import React, { ReactNode } from "react";

interface PhotoFooterProps {
  takeScreenshot: () => void;
}

const PhotoFooter: React.FC<PhotoFooterProps> = ({ takeScreenshot }) => {
  const router = useRouter();
  return (
    <>
      <div className="photo-footer-bg" />
      <div className="bg-pokeball" />
      <footer id="footer" className="flex photo-footer">
        <button
          type="button"
          className="menu-item flex-1 flex justify-center items-center flex flex-col text-white gap-0.5 text-center transition transition-all hover:bg-gray-800"
          onClick={() => router.back()}
        >
          <IconBack />
          Back
        </button>
        <div
          className={`menu-item flex-1 flex justify-center cursor-pointer camera-button `}
          onClick={takeScreenshot}
        >
          <img src={IconSnap.src} className="-mt-4" />
        </div>
        <div className="menu-item flex-1 flex"></div>
      </footer>
    </>
  );
};

export default PhotoFooter;

interface NavItemProps {
  href?: string;
  children: ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href = "/", children }) => (
  <LinkActive
    href={href}
    className="menu-item flex-1 flex justify-center items-center flex flex-col text-white gap-0.5 text-center transition transition-all hover:bg-gray-800 "
  >
    {children}
  </LinkActive>
);

const IconBack: React.FC = () => (
  <svg
    className="w-6 h-6 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m15 19-7-7 7-7"
    />
  </svg>
);

interface LinkActiveProps {
  children: ReactNode;
  inactiveClassName?: string;
  className: string;
  href: string;
  activeClassName?: string;
}

const LinkActive: React.FC<LinkActiveProps> = ({
  children,
  inactiveClassName = "",
  className,
  href,
  activeClassName = "",
}) => {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href) && href !== "/";

  return (
    <Link
      href={href || "/"}
      className={
        isActive
          ? `${className} ${activeClassName}`
          : `${className} ${inactiveClassName}`
      }
    >
      {children}
    </Link>
  );
};

