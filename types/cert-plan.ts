export interface CertPlanFeature {
  /** FontAwesome classes for the bullet icon, e.g. "fa-solid fa-check". */
  icon: string;
  /** Extra classes applied to the icon only. */
  iconClassName?: string;
  text: string;
  /** Extra classes applied to the whole list row. */
  className?: string;
}

export interface CertPlan {
  id: string;
  /** FontAwesome classes for the header icon. */
  icon: string;
  /** Tone applied to the header icon (brand green or premium amber). */
  iconToneClassName: string;
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: CertPlanFeature[];
  /** Package name for the Zalo modal, without the "Gói" prefix (the modal adds it); the card appends `price`. */
  zaloPackage: string;
  /** Renders the emphasized "most popular" variant. */
  highlighted?: boolean;
  /** Ribbon text, only rendered for the highlighted plan. */
  badge?: string;
}
