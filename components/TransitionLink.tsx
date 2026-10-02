"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useTransitionRouter } from "./PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Word shown on the transition curtain */
  transitionLabel?: string;
};

/** A next/link that plays the curtain transition before routing. */
export default function TransitionLink({ href, transitionLabel, onClick, ...rest }: Props) {
  const navigate = useTransitionRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href, transitionLabel);
  };
  return <Link href={href} onClick={handle} scroll={false} {...rest} />;
}
