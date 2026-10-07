import { business } from "@/config/business";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * The utility bar trades content for width as the viewport narrows, so the three
 * tiers are the only place where a claim is allowed to disappear:
 *
 * - below `sm` (640px): emergency availability and the phone only. Both are the
 *   things a visitor on a phone can act on immediately.
 * - `sm` up to `lg` (640-1023px): adds "Serving Columbus". Office hours drop out
 *   first because they are reference information, not an action, and the tablet
 *   range still has the mobile navigation underneath it.
 * - `lg` and up: the complete bar, where there is room for the full service area
 *   and office hours alongside both actions.
 *
 * Visual hierarchy: the strip stays brand navy so it reads as chrome rather
 * than as a banner, the emergency line gets a small orange alert glyph as the
 * only accent, and the phone is the single filled element in the row - an
 * orange capsule with navy text, which is the strongest contrast on the bar
 * and mirrors the Hero's primary CTA treatment without introducing a second
 * visual language. Navy on orange and orange on navy both measure ~5.9:1, and
 * white on navy is ~15:1, so every pair clears WCAG AA at this size.
 *
 * Everything stays on one row at every width. `flex-nowrap` is what guarantees
 * the phone can never drop to a second row at 768px, and the bar never changes
 * width or horizontal alignment, so nothing below it shifts. At 360px the two
 * visible items plus their icons fit inside the container with room to spare;
 * the phone number is deliberately the visible label (the accessible name adds
 * "Call " via aria-label) to buy those pixels back.
 *
 * Individual items deliberately do *not* carry `whitespace-nowrap`. Without it the
 * row cannot overflow when a 200% zoom or an unusually narrow window leaves less
 * room than the text needs: flex items are allowed to shrink and their text
 * wraps within the item instead of pushing the bar past the viewport. That
 * matters at roughly 195px, which is what 200% zoom on a phone actually renders,
 * and it is why the claims wrap rather than the layout break.
 *
 * Height: `py-2` around a `min-h-6` row is 40px, inside the 40-44px band the
 * thin strip is meant to hold.
 */
export function UtilityBar() {
  return (
    <div className="bg-navy text-white">
      <Container className="flex flex-nowrap items-center gap-x-4 py-2 text-sm">
        <span className="hidden min-w-0 sm:inline">
          Serving {business.serviceArea}
        </span>
        <span className="hidden min-w-0 lg:inline">
          Office: {business.hours.short}
        </span>
        <a
          href="/emergency"
          className="inline-flex min-h-6 min-w-0 items-center gap-1.5 underline-offset-2 hover:underline"
        >
          <Icon
            name="alert"
            className="h-3.5 w-3.5 shrink-0 text-orange"
          />
          {business.hours.emergencyLabel}
        </a>
        <a
          href={business.phoneUri}
          aria-label={`Call ${business.phoneDisplay}`}
          className="ml-auto inline-flex min-h-6 min-w-0 items-center gap-1.5 rounded-full bg-orange px-3 font-semibold text-navy microtransition hover-on:opacity-90 active:opacity-80"
        >
          <Icon name="phone" className="h-3.5 w-3.5 shrink-0" />
          {business.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}
