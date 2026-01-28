"use client";

import { Mail, Send, ArrowUpRight, Share2, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  is_external: boolean;
  order: number;
}

export default function Contacts() {
  const [showToast, setShowToast] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Load Settings
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);

      // Load Links
      try {
        const { data } = await supabase
          .from('links')
          .select('*')
          .eq('is_active', true)
          .order('order', { ascending: true });
        
        if (data) {
          setLinks(data);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: settings["site_title"],
      text: settings["share_message"],
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to Telegram share or Clipboard
        const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(settings["share_message"] || "")}`;
        window.open(tgShareUrl, '_blank');
        
        // Also copy to clipboard for good measure
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // If share fails, try clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (clipboardErr) {
        console.error('Clipboard failed:', clipboardErr);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-32 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C5A66F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#C5A66F]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="px-6 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{settings["contact_title"]}</h1>
        <p className="text-[var(--muted-foreground)] mb-8">{settings["contact_subtitle"]}</p>

        {/* Contact Links List */}
        <div className="space-y-4">
          
          {/* Telegram Channel */}
          {settings["contact_tg_channel_url"] && (
            <a 
              href={settings["contact_tg_channel_url"]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#2AABEE]/50 transition-all group active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-[#2AABEE]/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#2AABEE]/20 transition-colors">
                <Send size={24} className="text-[#2AABEE]" />
              </div>
              <div className="flex-grow">
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Telegram канал</div>
                <div className="text-lg font-bold text-[var(--card-foreground)]">{settings["contact_tg_channel"]}</div>
              </div>
              <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#2AABEE] transition-colors" />
            </a>
          )}

          {/* Personal Telegram */}
          {settings["contact_tg_personal_url"] && (
            <a 
              href={settings["contact_tg_personal_url"]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#C5A66F]/50 transition-all group active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-[#C5A66F]/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#C5A66F]/20 transition-colors">
                <Send size={24} className="text-[#C5A66F]" />
              </div>
              <div className="flex-grow">
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">связаться со мной</div>
                <div className="text-lg font-bold text-[var(--card-foreground)]">{settings["contact_tg_personal"]}</div>
              </div>
              <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F] transition-colors" />
            </a>
          )}

          {/* Email */}
          {settings["contact_email_url"] && (
            <a 
              href={settings["contact_email_url"]} 
              className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#C5A66F]/50 transition-all group active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-[var(--card)] border border-[var(--border)] rounded-full flex items-center justify-center shrink-0 group-hover:border-[#C5A66F]/50 transition-colors">
                <Mail size={24} className="text-[#C5A66F]" />
              </div>
              <div className="flex-grow">
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">Почта</div>
                <div className="text-lg font-bold text-[var(--card-foreground)] break-all">{settings["contact_email"]}</div>
              </div>
              <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F] transition-colors" />
            </a>
          )}

          {/* Dynamic Links */}
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
            </div>
          ) : (
            links.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target={link.is_external ? "_blank" : undefined}
                rel={link.is_external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-5 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg hover:border-[#C5A66F]/50 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-[var(--background)] rounded-full flex items-center justify-center shrink-0 text-2xl">
                  {link.icon || "🔗"}
                </div>
                <div className="flex-grow">
                  <div className="text-lg font-bold text-[var(--card-foreground)]">{link.title}</div>
                  <div className="text-xs text-[var(--muted-foreground)] truncate max-w-[200px]">{link.url}</div>
                </div>
                {link.is_external && (
                  <ArrowUpRight size={20} className="text-[var(--muted-foreground)] group-hover:text-[#C5A66F] transition-colors" />
                )}
              </a>
            ))
          )}

        </div>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="mt-8 w-full bg-[#C5A66F] text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(197,166,111,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#b8955a]"
        >
          <Share2 size={20} />
          {settings["btn_share"]}
        </button>

        {/* Toast Notification */}
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}>
          <Check size={16} className="text-green-400" />
          Ссылка скопирована
        </div>
      </div>
    </main>
  );
}
