import { STATUS_EMOJI } from "../lib/types";
import type { Status } from "../lib/types";

const COLORS: Record<Status, string> = {
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
};

export function StatusPill({ status, label }: { status: Status; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${COLORS[status]}`}>
      {STATUS_EMOJI[status]}{label && ` ${label}`}
    </span>
  );
}
