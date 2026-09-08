import { useState, useRef, useEffect } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Pencil, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InlineEditableProps {
  contentKey: string;
  value: string;
  fallback: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  multiline?: boolean;
}

export function InlineEditable({
  contentKey,
  value,
  fallback,
  as: Component = "span",
  className = "",
  multiline = false,
}: InlineEditableProps) {
  const { isEditMode, isAdmin } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || fallback);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    setEditValue(value || fallback);
  }, [value, fallback]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveMutation = useMutation({
    mutationFn: async (newValue: string) => {
      await apiRequest("POST", "/api/admin/settings", {
        key: contentKey,
        value: newValue,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Content updated" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to save", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (editValue.trim() !== (value || fallback)) {
      saveMutation.mutate(editValue.trim());
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || fallback);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const displayValue = value || fallback;

  if (!isAdmin || !isEditMode) {
    return <Component className={className}>{displayValue}</Component>;
  }

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-2 relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-black/80 text-white border-2 border-[#D4AF37] rounded px-2 py-1 outline-none resize-none min-w-[200px] ${className}`}
            rows={3}
            data-testid={`inline-edit-input-${contentKey}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`bg-black/80 text-white border-2 border-[#D4AF37] rounded px-2 py-1 outline-none min-w-[100px] ${className}`}
            data-testid={`inline-edit-input-${contentKey}`}
          />
        )}
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="p-1 bg-[#D4AF37] text-black rounded hover:bg-[#C4A030] transition-colors"
          data-testid={`inline-edit-save-${contentKey}`}
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors"
          data-testid={`inline-edit-cancel-${contentKey}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group inline-flex items-center gap-2 relative">
      <Component className={className}>{displayValue}</Component>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 bg-[#D4AF37] text-black rounded hover:bg-[#C4A030] transition-all duration-200 absolute -right-8 top-1/2 -translate-y-1/2"
        data-testid={`inline-edit-button-${contentKey}`}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}

interface EditModeToggleProps {
  className?: string;
}

export function EditModeToggle({ className = "" }: EditModeToggleProps) {
  const { isEditMode, setIsEditMode, isAdmin, isCheckingAuth } = useEditMode();

  if (isCheckingAuth || !isAdmin) {
    return null;
  }

  return (
    <button
      onClick={() => setIsEditMode(!isEditMode)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        isEditMode
          ? "bg-[#D4AF37] text-black hover:bg-[#C4A030]"
          : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
      } ${className}`}
      data-testid="button-edit-mode-toggle"
    >
      <Pencil className="w-4 h-4" />
      {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
    </button>
  );
}
