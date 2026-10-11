/** Plain, serialisable shape handed to Client Components. */
export interface UdidStep {
  id: string;
  /** 1-based position, also rendered as the "Bước N" badge. */
  order: number;
  description: string;
  /** Illustration for the step. */
  image: string;
}
