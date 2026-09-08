import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  LogOut, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Star, 
  MessageSquare,
  Settings,
  LayoutDashboard,
  ExternalLink,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Users,
  Image,
  Video,
  Save,
  Edit,
  ChevronDown,
  FileText,
  Link,
  ClipboardList,
  Layers,
  Sparkles,
  Lock
} from "lucide-react";
import type { Newsletter, Signup, Contact, Review, Event, MerchItem, Founder, MediaLink, SiteSetting, GalleryVideo } from "@shared/schema";

type ActiveSection = 
  | "dashboard" 
  | "events" 
  | "merchandise" 
  | "founders" 
  | "media" 
  | "gallery-videos" 
  | "site-content"
  | "newsletters" 
  | "signups" 
  | "contacts" 
  | "reviews" 
  | "settings"
  | "account";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<ActiveSection>("dashboard");
  const [contentOpen, setContentOpen] = useState(true);
  const [formsOpen, setFormsOpen] = useState(true);

  const { data: adminData, isLoading: adminLoading, error: adminError } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: newslettersData } = useQuery<{ data: Newsletter[] }>({
    queryKey: ["/api/admin/newsletters"],
    enabled: !!adminData,
  });

  const { data: signupsData } = useQuery<{ data: Signup[] }>({
    queryKey: ["/api/admin/signups"],
    enabled: !!adminData,
  });

  const { data: contactsData } = useQuery<{ data: Contact[] }>({
    queryKey: ["/api/admin/contacts"],
    enabled: !!adminData,
  });

  const { data: reviewsData } = useQuery<{ data: Review[] }>({
    queryKey: ["/api/admin/reviews"],
    enabled: !!adminData,
  });

  const { data: eventsData } = useQuery<{ data: Event[] }>({
    queryKey: ["/api/admin/events"],
    enabled: !!adminData,
  });

  const { data: merchData } = useQuery<{ data: MerchItem[] }>({
    queryKey: ["/api/admin/merchandise"],
    enabled: !!adminData,
  });

  const { data: foundersData } = useQuery<{ data: Founder[] }>({
    queryKey: ["/api/admin/founders"],
    enabled: !!adminData,
  });

  const { data: mediaData } = useQuery<{ data: MediaLink[] }>({
    queryKey: ["/api/admin/media"],
    enabled: !!adminData,
  });

  const { data: settingsData } = useQuery<{ data: SiteSetting[] }>({
    queryKey: ["/api/admin/settings"],
    enabled: !!adminData,
  });

  const { data: galleryVideosData } = useQuery<{ data: GalleryVideo[] }>({
    queryKey: ["/api/admin/gallery-videos"],
    enabled: !!adminData,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setLocation("/admin");
    },
  });

  useEffect(() => {
    if (adminError) {
      setLocation("/admin");
    }
  }, [adminError, setLocation]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!adminData) {
    return null;
  }

  const newsletters = newslettersData?.data || [];
  const signups = signupsData?.data || [];
  const contacts = contactsData?.data || [];
  const reviews = reviewsData?.data || [];
  const events = eventsData?.data || [];
  const merchandise = merchData?.data || [];
  const founders = foundersData?.data || [];
  const mediaLinks = mediaData?.data || [];
  const settings = settingsData?.data || [];
  const galleryVideos = galleryVideosData?.data || [];

  const stats = [
    { label: "Newsletter Subscribers", value: newsletters.length, icon: Mail, color: "bg-blue-500" },
    { label: "Event Sign-ups", value: signups.length, icon: Calendar, color: "bg-green-500" },
    { label: "Contact Inquiries", value: contacts.length, icon: MessageSquare, color: "bg-purple-500" },
    { label: "Reviews", value: reviews.length, icon: Star, color: "bg-yellow-500" },
  ];

  const contentStats = [
    { label: "Events", value: events.length, icon: Calendar },
    { label: "Merchandise", value: merchandise.length, icon: ShoppingBag },
    { label: "Founders", value: founders.length, icon: Users },
    { label: "Media Links", value: mediaLinks.length, icon: Link },
    { label: "Gallery Videos", value: galleryVideos.length, icon: Video },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-zinc-400 text-sm">{stat.label}</p>
                          <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Content Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {contentStats.map((stat) => (
                  <Card key={stat.label} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-zinc-400 text-xs">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters.slice(0, 5).map((sub: Newsletter) => (
                    <div key={sub.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-white text-sm">{sub.email}</p>
                          <p className="text-zinc-500 text-xs">Newsletter subscription</p>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-xs">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  ))}
                  {newsletters.length === 0 && (
                    <p className="text-zinc-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "events":
        return <EventsManager events={events} />;

      case "merchandise":
        return <MerchandiseManager merchandise={merchandise} />;

      case "founders":
        return <FoundersManager founders={founders} />;

      case "media":
        return <MediaManager mediaLinks={mediaLinks} />;

      case "gallery-videos":
        return <GalleryVideosManager galleryVideos={galleryVideos} />;

      case "site-content":
        return <SiteContentManager settings={settings} />;

      case "newsletters":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Newsletter Subscribers</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">All Subscribers ({newsletters.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Phone</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Referral</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletters.map((sub: Newsletter) => (
                        <tr key={sub.id} className="border-b border-zinc-800 last:border-0">
                          <td className="py-3 px-4 text-white">{sub.firstName} {sub.lastName}</td>
                          <td className="py-3 px-4 text-zinc-300">{sub.email}</td>
                          <td className="py-3 px-4 text-zinc-300">{sub.phone || "-"}</td>
                          <td className="py-3 px-4 text-zinc-300">{sub.referralSource || "-"}</td>
                          <td className="py-3 px-4 text-zinc-500">{sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {newsletters.length === 0 && (
                    <p className="text-zinc-500 text-center py-8">No subscribers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "signups":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Event Sign-ups</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">All Sign-ups ({signups.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Phone</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Referral</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {signups.map((signup: Signup) => (
                        <tr key={signup.id} className="border-b border-zinc-800 last:border-0">
                          <td className="py-3 px-4 text-white">{signup.firstName} {signup.lastName}</td>
                          <td className="py-3 px-4 text-zinc-300">{signup.email}</td>
                          <td className="py-3 px-4 text-zinc-300">{signup.phone}</td>
                          <td className="py-3 px-4 text-zinc-300">{signup.referralSource || "-"}</td>
                          <td className="py-3 px-4 text-zinc-500">{signup.createdAt ? new Date(signup.createdAt).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {signups.length === 0 && (
                    <p className="text-zinc-500 text-center py-8">No sign-ups yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "contacts":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Contact Inquiries</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">All Inquiries ({contacts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Message</th>
                        <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact: Contact) => (
                        <tr key={contact.id} className="border-b border-zinc-800 last:border-0">
                          <td className="py-3 px-4 text-white">{contact.name}</td>
                          <td className="py-3 px-4 text-zinc-300">{contact.email}</td>
                          <td className="py-3 px-4 text-zinc-300 max-w-md truncate">{contact.message}</td>
                          <td className="py-3 px-4 text-zinc-500">{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contacts.length === 0 && (
                    <p className="text-zinc-500 text-center py-8">No contact inquiries yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "reviews":
        return (
          <ReviewsManager reviews={reviews} />
        );

      case "settings":
        return <SettingsManager settings={settings} />;

      case "account":
        return <AccountSettings />;

      default:
        return null;
    }
  };

  const sidebarStyle = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "60px",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex min-h-screen w-full bg-black">
        <Sidebar className="border-r border-zinc-800" style={{ backgroundColor: '#09090b' }}>
          <SidebarHeader className="p-4 border-b border-zinc-800" style={{ backgroundColor: '#09090b' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-white font-bold text-sm">Delco Divas</h1>
                <p className="text-zinc-500 text-xs">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4" style={{ backgroundColor: '#09090b' }}>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("dashboard")}
                    className={activeSection === "dashboard" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-300 hover:text-white hover:bg-zinc-800"}
                    data-testid="sidebar-dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-zinc-500 text-xs uppercase tracking-wider px-2">
                Content Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full text-zinc-300 hover:text-white hover:bg-zinc-800">
                      <Layers className="w-4 h-4" />
                      <span className="flex-1 text-left">Content</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${contentOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => setActiveSection("events")}
                          className={activeSection === "events" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-events"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Events <span className="text-zinc-600 text-xs">(Events page)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveSection("merchandise")}
                          className={activeSection === "merchandise" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-merchandise"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Merchandise <span className="text-zinc-600 text-xs">(Shop page)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveSection("founders")}
                          className={activeSection === "founders" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-founders"
                        >
                          <Users className="w-4 h-4" />
                          <span>Founders <span className="text-zinc-600 text-xs">(About page)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveSection("media")}
                          className={activeSection === "media" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-media"
                        >
                          <Link className="w-4 h-4" />
                          <span>Media Links <span className="text-zinc-600 text-xs">(Media page)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveSection("gallery-videos")}
                          className={activeSection === "gallery-videos" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-gallery-videos"
                        >
                          <Video className="w-4 h-4" />
                          <span>Gallery Videos <span className="text-zinc-600 text-xs">(Home + Media)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveSection("site-content")}
                          className={activeSection === "site-content" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-site-content"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Site Content + Images <span className="text-zinc-600 text-xs">(All pages)</span></span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-zinc-500 text-xs uppercase tracking-wider px-2">
                Form Submissions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Collapsible open={formsOpen} onOpenChange={setFormsOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full text-zinc-300 hover:text-white hover:bg-zinc-800">
                      <ClipboardList className="w-4 h-4" />
                      <span className="flex-1 text-left">Submissions</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${formsOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => setActiveSection("newsletters")}
                          className={activeSection === "newsletters" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-newsletters"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Newsletters</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => setActiveSection("signups")}
                          className={activeSection === "signups" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-signups"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Sign-ups</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => setActiveSection("contacts")}
                          className={activeSection === "contacts" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-contacts"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Contacts</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          onClick={() => setActiveSection("reviews")}
                          className={activeSection === "reviews" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-400 hover:text-white"}
                          data-testid="sidebar-reviews"
                        >
                          <Star className="w-4 h-4" />
                          <span>Reviews</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("settings")}
                    className={activeSection === "settings" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-300 hover:text-white hover:bg-zinc-800"}
                    data-testid="sidebar-settings"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("account")}
                    className={activeSection === "account" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-zinc-300 hover:text-white hover:bg-zinc-800"}
                    data-testid="sidebar-account"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-zinc-800" style={{ backgroundColor: '#09090b' }}>
            <div className="space-y-2">
              <p className="text-zinc-500 text-xs truncate">{(adminData as any)?.admin?.email}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/", "_blank")}
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                  data-testid="button-view-site"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Site
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className="flex-1 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs"
                  data-testid="button-admin-logout"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
            <SidebarTrigger className="text-zinc-400 hover:text-white" data-testid="button-sidebar-toggle" />
            <h1 className="text-white font-semibold capitalize">
              {activeSection === "dashboard" ? "Dashboard" : 
               activeSection === "gallery-videos" ? "Gallery Videos" :
               activeSection === "site-content" ? "Site Content" :
               activeSection === "account" ? "Account" :
               activeSection}
            </h1>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function EventsManager({ events }: { events: Event[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "",
    imageUrl: "",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/events", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event created successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiRequest("PUT", `/api/admin/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event updated successfully" });
      setIsOpen(false);
      setEditingEvent(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update event", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete event", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", date: "", time: "", location: "", description: "", price: "", imageUrl: "", isActive: true });
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time || "",
      location: event.location || "",
      description: event.description || "",
      price: event.price || "",
      imageUrl: event.imageUrl || "",
      isActive: event.isActive ?? true,
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Events</h2>
          <p className="text-zinc-400 text-sm mt-1">These appear on the <strong className="text-zinc-300">Events / Delco Divas Day</strong> page as past events.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingEvent(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-black" data-testid="button-add-event">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Spring Retreat 2025"
                  data-testid="input-event-title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-300">Date</Label>
                  <Input
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                    placeholder="e.g., March 15, 2025"
                    data-testid="input-event-date"
                  />
                </div>
                <div>
                  <Label className="text-zinc-300">Time</Label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                    placeholder="e.g., 10:00 AM"
                    data-testid="input-event-time"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-300">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Philadelphia, PA"
                  data-testid="input-event-location"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Describe the event..."
                  rows={3}
                  data-testid="input-event-description"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Price (optional)</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., $25"
                  data-testid="input-event-price"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Image URL (optional)</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-event-image"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#D4AF37] text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-event"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingEvent ? "Update Event" : "Add Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-zinc-900 border-zinc-800 overflow-hidden" data-testid={`card-event-${event.id}`}>
            {event.imageUrl && (
              <div className="aspect-video">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="text-white font-semibold text-lg">{event.title}</h3>
              <p className="text-[#D4AF37] text-sm mt-1">{event.date} {event.time && `• ${event.time}`}</p>
              <p className="text-zinc-400 text-sm">{event.location}</p>
              <p className="text-zinc-500 text-sm mt-2 line-clamp-2">{event.description}</p>
              {event.price && <p className="text-white font-medium mt-2">{event.price}</p>}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(event)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                  data-testid={`button-edit-event-${event.id}`}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(event.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-event-${event.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {events.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No events yet. Click "Add Event" to create your first event.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MerchandiseManager({ merchandise }: { merchandise: MerchItem[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MerchItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    sizes: "",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/merchandise", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      toast({ title: "Item created successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiRequest("PUT", `/api/admin/merchandise/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      toast({ title: "Item updated successfully" });
      setIsOpen(false);
      setEditingItem(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/merchandise/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/merchandise"] });
      queryClient.invalidateQueries({ queryKey: ["/api/merchandise"] });
      toast({ title: "Item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete item", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", imageUrl: "", sizes: "", isActive: true });
  };

  const handleEdit = (item: MerchItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      sizes: item.sizes || "",
      isActive: item.isActive ?? true,
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Merchandise</h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingItem(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-black" data-testid="button-add-merch">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Merch Item" : "Add New Merch Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Delco Divas T-Shirt"
                  data-testid="input-merch-name"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Describe the item..."
                  rows={2}
                  data-testid="input-merch-description"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Price</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., $25"
                  data-testid="input-merch-price"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-merch-image"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Available Sizes (comma-separated)</Label>
                <Input
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., S, M, L, XL"
                  data-testid="input-merch-sizes"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#D4AF37] text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-merch"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {merchandise.map((item) => (
          <Card key={item.id} className="bg-zinc-900 border-zinc-800 overflow-hidden" data-testid={`card-merch-${item.id}`}>
            {item.imageUrl && (
              <div className="aspect-square">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="text-white font-semibold">{item.name}</h3>
              <p className="text-[#D4AF37] font-medium mt-1">{item.price}</p>
              <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{item.description}</p>
              {item.sizes && <p className="text-zinc-400 text-xs mt-2">Sizes: {item.sizes}</p>}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                  data-testid={`button-edit-merch-${item.id}`}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-merch-${item.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {merchandise.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No merchandise yet. Click "Add Item" to create your first item.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FoundersManager({ founders }: { founders: Founder[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    imageUrl: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/founders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/founders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/founders"] });
      toast({ title: "Founder added successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to add founder", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiRequest("PUT", `/api/admin/founders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/founders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/founders"] });
      toast({ title: "Founder updated successfully" });
      setIsOpen(false);
      setEditingFounder(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update founder", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/founders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/founders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/founders"] });
      toast({ title: "Founder removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove founder", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", title: "", bio: "", imageUrl: "" });
  };

  const handleEdit = (founder: Founder) => {
    setEditingFounder(founder);
    setFormData({
      name: founder.name,
      title: founder.title || "",
      bio: founder.bio,
      imageUrl: founder.imageUrl || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingFounder) {
      updateMutation.mutate({ id: editingFounder.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Founders</h2>
          <p className="text-zinc-400 text-sm mt-1">Founder profiles and photos appear on the <strong className="text-zinc-300">About</strong> page.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingFounder(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-black" data-testid="button-add-founder">
              <Plus className="w-4 h-4 mr-2" />
              Add Founder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingFounder ? "Edit Founder" : "Add New Founder"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Jane Smith"
                  data-testid="input-founder-name"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Co-Founder & Lead Instructor"
                  data-testid="input-founder-title"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Write a short bio..."
                  rows={4}
                  data-testid="input-founder-bio"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Photo URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-founder-image"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#D4AF37] text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-founder"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingFounder ? "Update Founder" : "Add Founder"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {founders.map((founder) => (
          <Card key={founder.id} className="bg-zinc-900 border-zinc-800" data-testid={`card-founder-${founder.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {founder.imageUrl ? (
                  <img src={founder.imageUrl} alt={founder.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Users className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{founder.name}</h3>
                  {founder.title && <p className="text-[#D4AF37] text-sm">{founder.title}</p>}
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{founder.bio}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(founder)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                  data-testid={`button-edit-founder-${founder.id}`}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(founder.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-founder-${founder.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {founders.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No founders yet. Click "Add Founder" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MediaManager({ mediaLinks }: { mediaLinks: MediaLink[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaLink | null>(null);
  const [formData, setFormData] = useState({
    type: "video",
    title: "",
    url: "",
    thumbnailUrl: "",
    description: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/media", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({ title: "Media added successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to add media", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiRequest("PUT", `/api/admin/media/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({ title: "Media updated successfully" });
      setIsOpen(false);
      setEditingMedia(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update media", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({ title: "Media removed successfully" });
    },
    onError: () => {
      toast({ title: "Failed to remove media", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ type: "video", title: "", url: "", thumbnailUrl: "", description: "" });
  };

  const handleEdit = (media: MediaLink) => {
    setEditingMedia(media);
    setFormData({
      type: media.type,
      title: media.title || "",
      url: media.url,
      thumbnailUrl: media.thumbnailUrl || "",
      description: media.description || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingMedia) {
      updateMutation.mutate({ id: editingMedia.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Media Links</h2>
          <p className="text-zinc-400 text-sm mt-1">Press features and video links appear on the <strong className="text-zinc-300">Media / Spotlight</strong> page. Mark items as Featured to display them prominently.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingMedia(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-black" data-testid="button-add-media">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingMedia ? "Edit Media" : "Add New Media"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-zinc-300">Type</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2"
                  data-testid="select-media-type"
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="article">Article/Press</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
              <div>
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Spring Performance Highlight"
                  data-testid="input-media-title"
                />
              </div>
              <div>
                <Label className="text-zinc-300">URL</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-media-url"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Thumbnail URL (optional)</Label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-media-thumbnail"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Description (optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Brief description..."
                  rows={2}
                  data-testid="input-media-description"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#D4AF37] text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-media"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingMedia ? "Update Media" : "Add Media"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaLinks.map((media) => (
          <Card key={media.id} className="bg-zinc-900 border-zinc-800 overflow-hidden" data-testid={`card-media-${media.id}`}>
            <div className="aspect-video bg-zinc-800 relative">
              {media.thumbnailUrl ? (
                <img src={media.thumbnailUrl} alt={media.title || "Media thumbnail"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {media.type === "video" && <Video className="w-12 h-12 text-zinc-600" />}
                  {media.type === "image" && <Image className="w-12 h-12 text-zinc-600" />}
                  {(media.type === "article" || media.type === "social") && <ExternalLink className="w-12 h-12 text-zinc-600" />}
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-medium truncate">{media.title || media.url}</h3>
              <p className="text-zinc-400 text-sm capitalize">{media.type}</p>
              <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] text-xs hover:underline">
                View Media
              </a>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(media)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                  data-testid={`button-edit-media-${media.id}`}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(media.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-media-${media.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {mediaLinks.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No media yet. Click "Add Media" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SiteContentManager({ settings }: { settings: SiteSetting[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Hero Section
    heroTitle: "",
    heroSubtitle: "",
    heroTagline: "",
    heroCta1: "",
    heroCta2: "",
    // Who We Are Section
    whoWeAreTitle: "",
    whoWeAreDescription: "",
    featureCard1Title: "",
    featureCard1Description: "",
    featureCard2Title: "",
    featureCard2Description: "",
    featureCard3Title: "",
    featureCard3Description: "",
    // Experience the Energy Section
    energyTitle: "",
    energyDescription: "",
    // CTA Section
    ctaHeadline: "",
    ctaDescription: "",
    ctaButtonText: "",
    // About Page
    aboutTitle: "",
    aboutDescription: "",
    // Footer
    footerTagline: "",
    // Site Images (URL-based so admin can link to hosted images)
    heroVideoUrl: "",
    homeCtaImageUrl: "",
    eventsCtaImageUrl: "",
  });

  useEffect(() => {
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    setFormData({
      heroTitle: settingsMap["heroTitle"] || "",
      heroSubtitle: settingsMap["heroSubtitle"] || "",
      heroTagline: settingsMap["heroTagline"] || "",
      heroCta1: settingsMap["heroCta1"] || "",
      heroCta2: settingsMap["heroCta2"] || "",
      whoWeAreTitle: settingsMap["whoWeAreTitle"] || "",
      whoWeAreDescription: settingsMap["whoWeAreDescription"] || "",
      featureCard1Title: settingsMap["featureCard1Title"] || "",
      featureCard1Description: settingsMap["featureCard1Description"] || "",
      featureCard2Title: settingsMap["featureCard2Title"] || "",
      featureCard2Description: settingsMap["featureCard2Description"] || "",
      featureCard3Title: settingsMap["featureCard3Title"] || "",
      featureCard3Description: settingsMap["featureCard3Description"] || "",
      energyTitle: settingsMap["energyTitle"] || "",
      energyDescription: settingsMap["energyDescription"] || "",
      ctaHeadline: settingsMap["ctaHeadline"] || "",
      ctaDescription: settingsMap["ctaDescription"] || "",
      ctaButtonText: settingsMap["ctaButtonText"] || "",
      aboutTitle: settingsMap["aboutTitle"] || "",
      aboutDescription: settingsMap["aboutDescription"] || "",
      footerTagline: settingsMap["footerTagline"] || "",
      heroVideoUrl: settingsMap["heroVideoUrl"] || "",
      homeCtaImageUrl: settingsMap["homeCtaImageUrl"] || "",
      eventsCtaImageUrl: settingsMap["eventsCtaImageUrl"] || "",
    });
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      await apiRequest("POST", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleSave = async () => {
    const entries = Object.entries(formData);
    for (const [key, value] of entries) {
      if (value) {
        await saveMutation.mutateAsync({ key, value });
      }
    }
    toast({ title: "Site content saved successfully" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Site Content</h2>
      <p className="text-zinc-400 mb-6">Edit text content and image URLs displayed across your website. Changes appear immediately on the public site.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Main Title</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Delco Divas"
                data-testid="input-content-hero-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Subtitle</Label>
              <Input
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., A dynamic women's fitness group"
                data-testid="input-content-hero-subtitle"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Tagline</Label>
              <Input
                value={formData.heroTagline}
                onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Why just watch the fun… when you can be the Diva?"
                data-testid="input-content-hero-tagline"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Primary Button</Label>
                <Input
                  value={formData.heroCta1}
                  onChange={(e) => setFormData({ ...formData, heroCta1: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Become a Diva"
                  data-testid="input-content-hero-cta1"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Secondary Button</Label>
                <Input
                  value={formData.heroCta2}
                  onChange={(e) => setFormData({ ...formData, heroCta2: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Learn More"
                  data-testid="input-content-hero-cta2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Site Images */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Image className="w-5 h-5 text-[#D4AF37]" />
              Site Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-xs">Paste a hosted image or video URL (e.g. from Google Drive, Dropbox, or Imgur). For founder profile photos, use the <strong className="text-zinc-300">Founders</strong> section. For gallery videos, use <strong className="text-zinc-300">Gallery Videos</strong>.</p>
            <div>
              <Label className="text-zinc-300">Home Page — Hero Background Video URL</Label>
              <Input
                value={formData.heroVideoUrl}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://... (mp4 video link)"
                data-testid="input-image-hero-video"
              />
              <p className="text-zinc-600 text-xs mt-1">Full-screen background video on the Home page hero.</p>
            </div>
            <div>
              <Label className="text-zinc-300">Home Page — CTA Background Image URL</Label>
              <Input
                value={formData.homeCtaImageUrl}
                onChange={(e) => setFormData({ ...formData, homeCtaImageUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://..."
                data-testid="input-image-home-cta"
              />
              <p className="text-zinc-600 text-xs mt-1">Background photo behind the "Ready to Become a Diva?" section.</p>
            </div>
            <div>
              <Label className="text-zinc-300">Events Page — CTA Background Image URL</Label>
              <Input
                value={formData.eventsCtaImageUrl}
                onChange={(e) => setFormData({ ...formData, eventsCtaImageUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://..."
                data-testid="input-image-events-cta"
              />
              <p className="text-zinc-600 text-xs mt-1">Background photo behind the "Don't Miss the Next Event" section.</p>
            </div>
          </CardContent>
        </Card>

        {/* Who We Are Section */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              Who We Are Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Section Title</Label>
                <Input
                  value={formData.whoWeAreTitle}
                  onChange={(e) => setFormData({ ...formData, whoWeAreTitle: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="e.g., Who Are the Delco Divas"
                  data-testid="input-content-whoweare-title"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={formData.whoWeAreDescription}
                onChange={(e) => setFormData({ ...formData, whoWeAreDescription: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[100px]"
                placeholder="The Delco Divas are a dynamic group of women..."
                data-testid="input-content-whoweare-description"
              />
            </div>
            <div className="border-t border-zinc-800 pt-4 mt-4">
              <Label className="text-zinc-400 text-sm mb-3 block">Feature Cards</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Input
                    value={formData.featureCard1Title}
                    onChange={(e) => setFormData({ ...formData, featureCard1Title: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 1 Title"
                    data-testid="input-content-feature1-title"
                  />
                  <Textarea
                    value={formData.featureCard1Description}
                    onChange={(e) => setFormData({ ...formData, featureCard1Description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 1 Description"
                    data-testid="input-content-feature1-description"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={formData.featureCard2Title}
                    onChange={(e) => setFormData({ ...formData, featureCard2Title: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 2 Title"
                    data-testid="input-content-feature2-title"
                  />
                  <Textarea
                    value={formData.featureCard2Description}
                    onChange={(e) => setFormData({ ...formData, featureCard2Description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 2 Description"
                    data-testid="input-content-feature2-description"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={formData.featureCard3Title}
                    onChange={(e) => setFormData({ ...formData, featureCard3Title: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 3 Title"
                    data-testid="input-content-feature3-title"
                  />
                  <Textarea
                    value={formData.featureCard3Description}
                    onChange={(e) => setFormData({ ...formData, featureCard3Description: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Card 3 Description"
                    data-testid="input-content-feature3-description"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience the Energy Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              Experience the Energy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Section Title</Label>
              <Input
                value={formData.energyTitle}
                onChange={(e) => setFormData({ ...formData, energyTitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Experience the Energy"
                data-testid="input-content-energy-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={formData.energyDescription}
                onChange={(e) => setFormData({ ...formData, energyDescription: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Watch our Divas in action..."
                data-testid="input-content-energy-description"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              Call to Action Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Headline</Label>
              <Input
                value={formData.ctaHeadline}
                onChange={(e) => setFormData({ ...formData, ctaHeadline: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Ready to Join the Movement?"
                data-testid="input-content-cta-headline"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Description</Label>
              <Textarea
                value={formData.ctaDescription}
                onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Join our community of empowered women..."
                data-testid="input-content-cta-description"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Button Text</Label>
              <Input
                value={formData.ctaButtonText}
                onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Sign Up Now"
                data-testid="input-content-cta-button"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Page */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              About Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Page Title</Label>
              <Input
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., About the Delco Divas"
                data-testid="input-content-about-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Page Description</Label>
              <Textarea
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Learn about our story and mission..."
                data-testid="input-content-about-description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              Footer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Tagline</Label>
              <Input
                value={formData.footerTagline}
                onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Dance • Pilates • Community"
                data-testid="input-content-footer-tagline"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSave}
        className="mt-6 bg-[#D4AF37] text-black"
        disabled={saveMutation.isPending}
        data-testid="button-save-site-content"
      >
        <Save className="w-4 h-4 mr-2" />
        {saveMutation.isPending ? "Saving..." : "Save All Content"}
      </Button>
    </div>
  );
}

function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, canFeature }: { id: string; canFeature: string }) => {
      return await apiRequest("PATCH", `/api/admin/reviews/${id}`, { canFeature });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review updated" });
    },
    onError: () => {
      toast({ title: "Failed to update review", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setDeleteConfirm(null);
      toast({ title: "Review deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">All Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Event</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Rating</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Review</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Featured</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-zinc-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review: Review) => (
                  <tr key={review.id} className="border-b border-zinc-800 last:border-0">
                    <td className="py-3 px-4 text-white">{review.firstName} {review.lastName}</td>
                    <td className="py-3 px-4 text-zinc-300">{review.eventAttended}</td>
                    <td className="py-3 px-4 text-[#D4AF37]">{review.rating} <Star className="w-4 h-4 inline fill-[#D4AF37] text-[#D4AF37]" /></td>
                    <td className="py-3 px-4 text-zinc-300 max-w-md truncate">{review.review}</td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant={review.canFeature === "yes" ? "default" : "outline"}
                        className={review.canFeature === "yes" ? "bg-green-600 text-white" : "text-zinc-400"}
                        onClick={() => toggleFeatureMutation.mutate({
                          id: review.id,
                          canFeature: review.canFeature === "yes" ? "no" : "yes"
                        })}
                        data-testid={`button-toggle-feature-${review.id}`}
                      >
                        {review.canFeature === "yes" ? "Featured" : "Hidden"}
                      </Button>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="py-3 px-4">
                      {deleteConfirm === review.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(review.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-confirm-delete-${review.id}`}
                          >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(null)}
                            data-testid={`button-cancel-delete-${review.id}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(review.id)}
                          className="text-red-400"
                          data-testid={`button-delete-review-${review.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reviews.length === 0 && (
              <p className="text-zinc-500 text-center py-8">No reviews yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsManager({ settings }: { settings: SiteSetting[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    heroVideoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    aboutSubtitle: "",
    eventsSubtitle: "",
    merchSubtitle: "",
    mediaSubtitle: "",
    facebookUrl: "",
    instagramUrl: "",
    contactEmail: "",
  });

  useEffect(() => {
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    setFormData({
      heroVideoUrl: settingsMap["heroVideoUrl"] || "",
      heroTitle: settingsMap["heroTitle"] || "",
      heroSubtitle: settingsMap["heroSubtitle"] || "",
      aboutSubtitle: settingsMap["aboutSubtitle"] || "",
      eventsSubtitle: settingsMap["eventsSubtitle"] || "",
      merchSubtitle: settingsMap["merchSubtitle"] || "",
      mediaSubtitle: settingsMap["mediaSubtitle"] || "",
      facebookUrl: settingsMap["facebookUrl"] || "",
      instagramUrl: settingsMap["instagramUrl"] || "",
      contactEmail: settingsMap["contactEmail"] || "",
    });
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      await apiRequest("POST", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleSave = async () => {
    const entries = Object.entries(formData);
    for (const [key, value] of entries) {
      if (value) {
        await saveMutation.mutateAsync({ key, value });
      }
    }
    toast({ title: "Settings saved successfully" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Site Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">Hero Video URL</Label>
              <Input
                value={formData.heroVideoUrl}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://..."
                data-testid="input-setting-hero-video"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Hero Title</Label>
              <Input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., DELCO DIVAS"
                data-testid="input-setting-hero-title"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Hero Subtitle</Label>
              <Input
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="e.g., Dance • Pilates • Community"
                data-testid="input-setting-hero-subtitle"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Page Subtitles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-zinc-300">About Page Subtitle</Label>
              <Input
                value={formData.aboutSubtitle}
                onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                data-testid="input-setting-about-subtitle"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Events Page Subtitle</Label>
              <Input
                value={formData.eventsSubtitle}
                onChange={(e) => setFormData({ ...formData, eventsSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                data-testid="input-setting-events-subtitle"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Merch Page Subtitle</Label>
              <Input
                value={formData.merchSubtitle}
                onChange={(e) => setFormData({ ...formData, merchSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                data-testid="input-setting-merch-subtitle"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Media Page Subtitle</Label>
              <Input
                value={formData.mediaSubtitle}
                onChange={(e) => setFormData({ ...formData, mediaSubtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                data-testid="input-setting-media-subtitle"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Social & Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-zinc-300">Facebook URL</Label>
              <Input
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://facebook.com/..."
                data-testid="input-setting-facebook"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Instagram URL</Label>
              <Input
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="https://instagram.com/..."
                data-testid="input-setting-instagram"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Contact Email</Label>
              <Input
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="contact@delcodivas.com"
                data-testid="input-setting-email"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSave}
        className="mt-6 bg-[#D4AF37] text-black"
        disabled={saveMutation.isPending}
        data-testid="button-save-settings"
      >
        <Save className="w-4 h-4 mr-2" />
        Save All Settings
      </Button>
    </div>
  );
}

function GalleryVideosManager({ galleryVideos }: { galleryVideos: GalleryVideo[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<GalleryVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    thumbnailUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/gallery-videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-videos"] });
      toast({ title: "Gallery video created successfully" });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create gallery video", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      await apiRequest("PUT", `/api/admin/gallery-videos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-videos"] });
      toast({ title: "Gallery video updated successfully" });
      setIsOpen(false);
      setEditingVideo(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update gallery video", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/gallery-videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gallery-videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-videos"] });
      toast({ title: "Gallery video deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete gallery video", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      videoUrl: "",
      thumbnailUrl: "",
      sortOrder: galleryVideos.length,
      isActive: true,
    });
  };

  const openEdit = (video: GalleryVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      sortOrder: video.sortOrder ?? 0,
      isActive: video.isActive ?? true,
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingVideo) {
      updateMutation.mutate({ id: editingVideo.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const sortedVideos = [...galleryVideos].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Gallery Videos</h2>
          <p className="text-zinc-400 text-sm mt-1">These videos appear in the auto-scrolling carousel on the <strong className="text-zinc-300">Home</strong> page and the 3D carousel on the <strong className="text-zinc-300">Media</strong> page. Paste any hosted video URL (mp4).</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingVideo(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4AF37] text-black" data-testid="button-add-gallery-video">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingVideo ? "Edit Gallery Video" : "Add Gallery Video"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-zinc-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Enter video title"
                  data-testid="input-gallery-video-title"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Video URL</Label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-gallery-video-url"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Thumbnail URL (optional)</Label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="https://..."
                  data-testid="input-gallery-video-thumbnail"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  data-testid="input-gallery-video-sort"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                  id="gallery-video-active"
                  data-testid="checkbox-gallery-video-active"
                />
                <Label htmlFor="gallery-video-active" className="text-zinc-300">Active</Label>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#D4AF37] text-black"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-gallery-video"
              >
                {editingVideo ? "Update Video" : "Add Video"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVideos.map((video) => (
          <Card key={video.id} className="bg-zinc-900 border-zinc-800 overflow-hidden" data-testid={`card-gallery-video-${video.id}`}>
            <div className="aspect-video bg-zinc-800 relative">
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title || undefined}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-zinc-500" />
                </div>
              )}
              {!video.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
                  Inactive
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-white font-medium truncate">{video.title || "Untitled"}</h3>
              <p className="text-zinc-400 text-sm truncate mt-1">{video.videoUrl}</p>
              <p className="text-zinc-500 text-xs mt-2">Order: {video.sortOrder ?? 0}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(video)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-700"
                  data-testid={`button-edit-gallery-video-${video.id}`}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(video.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-gallery-video-${video.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {galleryVideos.length === 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No gallery videos yet. Add your first video to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AccountSettings() {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await apiRequest("POST", "/api/admin/change-password", data);
    },
    onSuccess: () => {
      toast({ title: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "New password must be at least 8 characters", variant: "destructive" });
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6" data-testid="text-account-heading">Account Settings</h2>
      <Card className="bg-zinc-900 border-zinc-800 max-w-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-zinc-300">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-zinc-300">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-confirm-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D4AF37] text-black font-semibold"
              disabled={changePasswordMutation.isPending}
              data-testid="button-change-password"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
