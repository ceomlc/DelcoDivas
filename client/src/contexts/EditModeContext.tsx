import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isAdmin: boolean;
  isCheckingAuth: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: authData, isLoading: isCheckingAuth } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/me"],
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const isAdmin = authData?.authenticated ?? false;

  useEffect(() => {
    if (!isAdmin && isEditMode) {
      setIsEditMode(false);
    }
  }, [isAdmin, isEditMode]);

  return (
    <EditModeContext.Provider value={{ isEditMode, setIsEditMode, isAdmin, isCheckingAuth }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}
