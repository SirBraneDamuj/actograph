import { createContext, ReactNode, useState } from "react";

export type UserContextType = {
  userId: string | null;
  setUserId: (newId: string) => unknown;
};

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

type UserContextProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [context, setContext] = useState<UserContextType>({
    userId: null,
    setUserId: (newId: string) => {
      setContext({ ...context, userId: newId });
    },
  });

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}
