/** Plain, serialisable shape handed to Client Components. */
export interface Category {
  id: string;
  /** Value stored on an article and matched by the listing filter. */
  name: string;
  /** Text rendered on the filter pill. */
  label: string;
  slug: string;
  order: number;
  isActive: boolean;
}
