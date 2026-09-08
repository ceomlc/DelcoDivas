import { useEditMode } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditModeToggle() {
  const { isEditMode, setIsEditMode, isAdmin, isCheckingAuth } = useEditMode();

  if (isCheckingAuth || !isAdmin) {
    return null;
  }

  return (
    <Button
      onClick={() => setIsEditMode(!isEditMode)}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 px-6 shadow-2xl transition-all duration-300",
        isEditMode
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gold hover:bg-gold/90 text-primary-foreground"
      )}
      data-testid="button-edit-mode-toggle"
    >
      {isEditMode ? (
        <>
          <Eye className="h-5 w-5 mr-2" />
          Exit Edit Mode
        </>
      ) : (
        <>
          <Pencil className="h-5 w-5 mr-2" />
          Edit Page
        </>
      )}
    </Button>
  );
}
