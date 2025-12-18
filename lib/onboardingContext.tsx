import { createContext, useContext, useState } from "react";
import { OnboardingState } from "@/types/onboarding";

type OnboardingContextValue = {
  state: OnboardingState;
  update: (data: Partial<OnboardingState>) => void;
  reset: () => void;
};

const OnboardingContext =
  createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OnboardingState>(
    {}
  );

  const update = (data: Partial<OnboardingState>) =>
    setState((prev) => ({ ...prev, ...data }));

  const reset = () => setState({});

  return (
    <OnboardingContext.Provider
      value={{ state, update, reset }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error(
      "useOnboarding must be used within OnboardingProvider"
    );
  return ctx;
};
