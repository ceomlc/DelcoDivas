import { useState, useRef, useEffect } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  multiline?: boolean;
  placeholder?: string;
  "data-testid"?: string;
}

export function EditableText({
  value,
  onSave,
  className = "",
  as: Component = "span",
  multiline = false,
  placeholder = "Click to edit...",
  "data-testid": testId,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
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

  if (!isEditMode) {
    return (
      <Component className={className} data-testid={testId}>
        {value || placeholder}
      </Component>
    );
  }

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-2 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full bg-background/80 border border-gold rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold resize-none min-h-[100px]",
              className
            )}
            data-testid={testId ? `${testId}-input` : undefined}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full bg-background/80 border border-gold rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold",
              className
            )}
            data-testid={testId ? `${testId}-input` : undefined}
          />
        )}
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
            data-testid={testId ? `${testId}-save` : "button-save-text"}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white"
            data-testid={testId ? `${testId}-cancel` : "button-cancel-text"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative inline-flex items-center gap-2 cursor-pointer hover:bg-gold/10 rounded-md px-1 -mx-1 transition-colors",
        className
      )}
      onClick={() => setIsEditing(true)}
      data-testid={testId}
    >
      <Component className="flex-1">{value || placeholder}</Component>
      <Pencil className="h-4 w-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}
