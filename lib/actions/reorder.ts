/**
 * Moves `id` one slot in `ids` and returns the new arrangement, or `null` when
 * the move is a no-op (unknown id, or already at the edge).
 *
 * Kept as a pure function so both the category and the UDID step actions can
 * share it without dragging Mongoose generics along: the caller turns the
 * returned array into `order = index + 1` writes.
 */
export function moveInOrder(
  ids: string[],
  id: string,
  direction: "up" | "down",
): string[] | null {
  const index = ids.indexOf(id);
  if (index === -1) return null;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= ids.length) return null;

  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
