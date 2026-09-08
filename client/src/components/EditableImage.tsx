import { useState, useRef } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { Trash2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  src: string;
  alt: string;
  onImageChange: (newUrl: string) => void;
  onDelete?: () => void;
  className?: string;
  containerClassName?: string;
  "data-testid"?: string;
}

export function EditableImage({
  src,
  alt,
  onImageChange,
  onDelete,
  className = "",
  containerClassName = "",
  "data-testid": testId,
}: EditableImageProps) {
  const { isEditMode } = useEditMode();
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        onImageChange(data.url);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onImageChange(urlValue.trim());
      setUrlValue("");
      setShowUrlInput(false);
    }
  };

  if (!isEditMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid={testId}
      />
    );
  }

  return (
    <div className={cn("relative group", containerClassName)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={className}
          data-testid={testId}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/30",
            className
          )}
          data-testid={testId}
        >
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          data-testid={testId ? `${testId}-file-input` : undefined}
        />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="h-10 w-10 bg-gold hover:bg-gold/90 text-primary-foreground"
          data-testid={testId ? `${testId}-upload` : "button-upload-image"}
        >
          <Upload className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowUrlInput(true)}
          className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white"
          data-testid={testId ? `${testId}-url` : "button-url-image"}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        {onDelete && src && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-10 w-10 bg-red-600 hover:bg-red-700 text-white"
            data-testid={testId ? `${testId}-delete` : "button-delete-image"}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {showUrlInput && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-4 w-full max-w-sm space-y-3">
            <p className="text-sm font-medium">Enter image URL:</p>
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUrlSubmit();
                if (e.key === "Escape") setShowUrlInput(false);
              }}
              autoFocus
              data-testid="input-image-url"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUrlSubmit}
                className="bg-gold hover:bg-gold/90 text-primary-foreground"
                data-testid="button-submit-url"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowUrlInput(false)}
                data-testid="button-cancel-url"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-white text-sm">Uploading...</div>
        </div>
      )}
    </div>
  );
}
