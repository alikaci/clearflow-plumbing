export function resolveHashHref(href: string, pathname: string): string {
  if (href.startsWith("#") && pathname !== "/") {
    return `/${href}`;
  }
  return href;
}
