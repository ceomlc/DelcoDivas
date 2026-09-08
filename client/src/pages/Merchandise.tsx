import { useState } from "react";
import { merchandise as staticMerchandise } from "@/data/static-data";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MerchItem } from "@shared/schema";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { useEditMode } from "@/contexts/EditModeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ColorOption {
  name: string;
  imageUrl: string;
}

interface DisplayMerchItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sizes?: string[];
  colorOptions?: ColorOption[];
}

export default function Merchandise() {
  const { isEditMode } = useEditMode();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch merchandise from database
  const { data: apiResponse, isLoading } = useQuery<{ data: MerchItem[] }>({
    queryKey: ['/api/merchandise'],
  });

  // Helper to safely parse sizes (can be JSON array or comma-separated string)
  const parseSizes = (sizes: unknown): string[] => {
    if (!sizes) return [];
    if (Array.isArray(sizes)) return sizes;
    if (typeof sizes === 'string') {
      try {
        const parsed = JSON.parse(sizes);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Not valid JSON, treat as comma-separated string
        return sizes.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  // Helper to safely parse color options
  const parseColorOptions = (colorOptions: unknown): ColorOption[] => {
    if (!colorOptions) return [];
    if (Array.isArray(colorOptions)) return colorOptions;
    if (typeof colorOptions === 'string') {
      try {
        const parsed = JSON.parse(colorOptions);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Use database merchandise if available, otherwise fall back to static data
  const dbMerchandise = apiResponse?.data || [];
  const merchandise: DisplayMerchItem[] = dbMerchandise.length > 0 
    ? dbMerchandise.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        sizes: parseSizes(item.sizes),
        colorOptions: parseColorOptions(item.colorOptions),
      }))
    : staticMerchandise;

  // Mutation to update merchandise item
  const updateMerchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MerchItem> }) => {
      return apiRequest("PATCH", `/api/admin/merchandise/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      toast({
        title: "Saved",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      console.error("Update error:", error);
    },
  });

  // Mutation to add merchandise item
  const addMerchMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; imageUrl: string }) => {
      return apiRequest("POST", "/api/admin/merchandise", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      setAddDialogOpen(false);
      toast({
        title: "Added",
        description: "New item has been added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
      console.error("Add error:", error);
    },
  });

  // Mutation to delete merchandise item
  const deleteMerchMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/merchandise/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      toast({
        title: "Deleted",
        description: "Item has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  // Helper to update a merch field
  const updateMerch = (itemId: string, field: string, value: string) => {
    if (dbMerchandise.length > 0) {
      updateMerchMutation.mutate({ id: itemId, data: { [field]: value } });
    } else {
      toast({
        title: "Add items first",
        description: "Please add merchandise in the admin panel before editing.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      itemId: "",
    },
  });

  const addForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "We'll get back to you soon with availability and pricing details.",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
      });
    },
  });

  const handleContactPurchase = (itemId: string, itemTitle: string) => {
    setSelectedItem({ id: itemId, title: itemTitle });
    form.setValue("itemId", itemId);
    const selectedColor = selectedColors[itemId];
    const colorInfo = selectedColor ? ` in ${selectedColor}` : "";
    form.setValue(
      "message",
      `I'm interested in purchasing the ${itemTitle}${colorInfo}. Please let me know about availability, sizing, and pricing.`
    );
    setDialogOpen(true);
  };

  const getDisplayImage = (item: DisplayMerchItem) => {
    if (item.colorOptions && selectedColors[item.id]) {
      const selectedColor = item.colorOptions.find(
        (opt) => opt.name === selectedColors[item.id]
      );
      return selectedColor?.imageUrl || item.imageUrl;
    }
    return item.imageUrl;
  };

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  const onAddSubmit = (data: { name: string; description: string; imageUrl: string }) => {
    addMerchMutation.mutate(data);
  };

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-black via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in-up">
            Delco Divas <span className="text-foreground">Merch</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed animate-fade-in">
            Wear your Diva pride with our exclusive collection
          </p>
        </div>
      </section>

      {/* Product Grid - Fashion Lookbook Style */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Add New Item Button (Edit Mode Only) */}
          {isEditMode && (
            <div className="mb-8 text-center">
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="bg-gold hover:bg-gold/90 text-black font-semibold"
                data-testid="button-add-merch"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Item
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {merchandise.map((item, index) => (
              <div
                key={item.id}
                className="group animate-fade-in relative"
                style={{ animationDelay: `${index * 0.15}s` }}
                data-testid={`card-merch-${item.id}`}
              >
                {/* Delete Button (Edit Mode Only) */}
                {isEditMode && dbMerchandise.length > 0 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMerchMutation.mutate(item.id)}
                    className="absolute top-2 right-2 z-10 h-10 w-10 bg-red-600 hover:bg-red-700 text-white rounded-full"
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}

                <div
                  className="relative overflow-hidden rounded-lg mb-6"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Product Image */}
                  <div className="aspect-[3/4] bg-card border border-card-border rounded-lg overflow-hidden">
                    {isEditMode && dbMerchandise.length > 0 ? (
                      <EditableImage
                        src={getDisplayImage(item)}
                        alt={item.title}
                        onImageChange={(url) => updateMerch(item.id, "imageUrl", url)}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          hoveredId === item.id ? "scale-110" : "scale-100"
                        }`}
                        data-testid={`img-product-${item.id}`}
                      />
                    ) : (
                      <img
                        src={getDisplayImage(item)}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          hoveredId === item.id ? "scale-110" : "scale-100"
                        }`}
                        data-testid={`img-product-${item.id}`}
                      />
                    )}
                  </div>

                  {/* Hover Overlay with Description */}
                  {!isEditMode && (
                    <div
                      className={`absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 transition-opacity duration-500 ${
                        hoveredId === item.id || expandedId === item.id
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-white/90 leading-relaxed mb-6" data-testid={`text-description-${item.id}`}>
                          {item.description}
                        </p>
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {item.sizes.map((size) => (
                              <Badge
                                key={size}
                                variant="secondary"
                                className="bg-white/10 text-white border border-white/20"
                              >
                                {size}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  {isEditMode && dbMerchandise.length > 0 ? (
                    <>
                      <EditableText
                        value={item.title}
                        onSave={(value) => updateMerch(item.id, "name", value)}
                        as="h3"
                        className="text-2xl sm:text-3xl font-display font-bold"
                        data-testid={`text-title-${item.id}`}
                      />
                      <EditableText
                        value={item.description}
                        onSave={(value) => updateMerch(item.id, "description", value)}
                        as="p"
                        multiline
                        className="text-foreground/80 leading-relaxed"
                        data-testid={`text-description-edit-${item.id}`}
                      />
                    </>
                  ) : (
                    <h3 className="text-2xl sm:text-3xl font-display font-bold" data-testid={`text-title-${item.id}`}>
                      {item.title}
                    </h3>
                  )}

                  {/* Color Options */}
                  {item.colorOptions && item.colorOptions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/80">
                        Color: {selectedColors[item.id] || item.colorOptions[0].name}
                      </p>
                      <div className="flex gap-3">
                        {item.colorOptions.map((colorOption) => (
                          <button
                            key={colorOption.name}
                            onClick={() =>
                              setSelectedColors((prev) => ({
                                ...prev,
                                [item.id]: colorOption.name,
                              }))
                            }
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                              (selectedColors[item.id] || item.colorOptions![0].name) ===
                              colorOption.name
                                ? "bg-gold text-black"
                                : "bg-card border border-card-border text-foreground hover-elevate"
                            }`}
                            data-testid={`button-color-${item.id}-${colorOption.name.toLowerCase()}`}
                          >
                            {colorOption.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Description Toggle */}
                  {!isEditMode && (
                    <div className="md:hidden">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                        className="text-foreground text-sm hover:underline"
                        data-testid={`button-toggle-${item.id}`}
                      >
                        {expandedId === item.id ? "Hide Details" : "View Details"}
                      </button>
                      {expandedId === item.id && (
                        <div className="mt-4 p-4 bg-card border border-card-border rounded-lg">
                          <p className="text-foreground/80 leading-relaxed mb-4">
                            {item.description}
                          </p>
                          {item.sizes && item.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.sizes.map((size) => (
                                <Badge key={size} variant="secondary">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact to Purchase Button */}
                  {!isEditMode && (
                    <Button
                      onClick={() => handleContactPurchase(item.id, item.title)}
                      data-testid={`button-contact-${item.id}`}
                      className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Contact to Purchase
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-gradient-to-b from-background to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8">
            How to Order
          </h2>
          <div className="bg-card border border-card-border rounded-lg p-8 sm:p-12">
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              Click "Contact to Purchase" on any item to send us an inquiry. We'll get back to you with availability, sizing details, and pricing information.
            </p>
            <p className="text-foreground/60">
              All merchandise is high-quality and made to celebrate your Delco Divas pride. Perfect for workouts, events, or everyday wear!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-card-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Contact About: {selectedItem?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill out the form below and we'll get back to you with details.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your full name"
                        data-testid="input-contact-name"
                        className="bg-background border-card-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        data-testid="input-contact-email"
                        className="bg-background border-card-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Let us know what you're interested in..."
                        rows={4}
                        data-testid="input-contact-message"
                        className="bg-background border-card-border resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-testid="button-contact-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  data-testid="button-contact-submit"
                  className="bg-gold hover:bg-gold/90 text-black font-semibold"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Inquiry"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-card-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Add New Merchandise
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new item to your merchandise collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                {...addForm.register("name")}
                placeholder="Item name"
                data-testid="input-add-name"
                className="bg-background border-card-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                {...addForm.register("description")}
                placeholder="Item description"
                rows={3}
                data-testid="input-add-description"
                className="bg-background border-card-border resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                {...addForm.register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                data-testid="input-add-imageUrl"
                className="bg-background border-card-border"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialogOpen(false)}
                data-testid="button-add-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMerchMutation.isPending}
                data-testid="button-add-submit"
                className="bg-gold hover:bg-gold/90 text-black font-semibold"
              >
                {addMerchMutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
