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
    userId: "49480f48-2a51-4e74-9af6-58b8b6fda848",
    setUserId: (newId: string) => {
      setContext({ ...context, userId: newId });
    },
  });

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}
