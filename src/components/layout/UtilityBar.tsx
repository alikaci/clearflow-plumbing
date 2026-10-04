import { business } from "@/config/business";
import { Container } from "@/components/ui/Container";

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
 * Everything stays on one row at every width. `flex-nowrap` is what guarantees
 * the phone can never drop to a second row at 768px, and the bar never changes
 * width or horizontal alignment, so nothing below it shifts.
 *
 * Individual items deliberately do *not* carry `whitespace-nowrap`. Without it the
 * row cannot overflow when a 200% zoom or an unusually narrow window leaves less
 * room than the text needs: flex items are allowed to shrink and their text
 * wraps within the item instead of pushing the bar past the viewport. That
 * matters at roughly 195px, which is what 200% zoom on a phone actually renders,
 * and it is why the claims wrap rather than the layout break.
 */
export function UtilityBar() {
  return (
    <div className="bg-navy text-white">
      <Container className="flex flex-nowrap items-center gap-x-6 py-2 text-sm">
        <span className="hidden min-w-0 sm:inline">
          Serving {business.serviceArea}
        </span>
        <span className="hidden min-w-0 lg:inline">
          Office: {business.hours.short}
        </span>
        <a
          href="/emergency"
          className="inline-flex min-h-6 min-w-0 items-center underline-offset-2 hover:underline"
        >
          {business.hours.emergencyLabel}
        </a>
        <a
          href={business.phoneUri}
          className="ml-auto inline-flex min-h-6 min-w-0 items-center gap-2 font-medium underline-offset-2 hover:underline"
        >
          Call {business.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}