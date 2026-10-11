"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TOAST_DURATION_MS = 3000;

interface ToastState {
  title: string;
  description: string;
}

interface UiContextValue {
  isZaloModalOpen: boolean;
  /** Package label shown inside the Zalo modal ("" = generic support copy). */
  zaloPackage: string;
  openZaloModal: (packageName?: string) => void;
  closeZaloModal: () => void;

  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;

  toast: ToastState | null;
  showToast: (title: string, description: string) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

/**
 * Holds the UI state that the original page kept in globals: the Zalo modal,
 * the search modal and the toast notification.
 */
export function UiProvider({ children }: { children: ReactNode }) {
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);
  const [zaloPackage, setZaloPackage] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openZaloModal = useCallback((packageName = "") => {
    setZaloPackage(packageName);
    setIsZaloModalOpen(true);
  }, []);

  const closeZaloModal = useCallback(() => setIsZaloModalOpen(false), []);
  const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

  const showToast = useCallback((title: string, description: string) => {
    setToast({ title, description });

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const value = useMemo<UiContextValue>(
    () => ({
      isZaloModalOpen,
      zaloPackage,
      openZaloModal,
      closeZaloModal,
      isSearchModalOpen,
      openSearchModal,
      closeSearchModal,
      toast,
      showToast,
    }),
    [
      isZaloModalOpen,
      zaloPackage,
      openZaloModal,
      closeZaloModal,
      isSearchModalOpen,
      openSearchModal,
      closeSearchModal,
      toast,
      showToast,
    ],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const context = useContext(UiContext);

  if (!context) {
    throw new Error("useUi must be used within a UiProvider");
  }

  return context;
}
