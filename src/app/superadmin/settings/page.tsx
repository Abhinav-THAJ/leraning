"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { createClient } from "@/utils/supabase/client";
import { Settings, Save, Loader2, Eye, EyeOff, ShieldCheck, Globe, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" }>({ msg: "", type: "success" });
  const [section, setSection] = useState<"profile" | "security" | "platform">("profile");
  const [platform, setPlatform] = useState({ site_name: "ITTA Academy", support_email: "", razorpay_live: false, maintenance: false });

  const showMsg = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast({ msg: "", type: "success" }), 3500); };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: p } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single();
      setProfile({ full_name: p?.full_name || "", email: user.email || "" });
      const { data: cfg } = await supabase.from("site_content").select("*").eq("key", "platform_config").single();
      if (cfg?.value) setPlatform(cfg.value);
    };
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({ full_name: profile.full_name }).eq("id", user!.id);
    if (!error) showMsg("Profile updated!"); else showMsg(error.message, "error");
    setSaving(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { showMsg("Passwords don't match", "error"); return; }
    setChangingPass(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.newPass });
    if (!error) { showMsg("Password changed!"); setPasswords({ current: "", newPass: "", confirm: "" }); }
    else showMsg(error.message, "error");
    setChangingPass(false);
  };

  const savePlatform = async () => {
    setSaving(true);
    await supabase.from("site_content").upsert({ key: "platform_config", value: platform }, { onConflict: "key" });
    showMsg("Platform settings saved!");
    setSaving(false);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm";
  const labelClass = "text-xs text-white/50 mb-1.5 block uppercase tracking-wider font-semibold";

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: Settings },
    { key: "security" as const, label: "Security", icon: ShieldCheck },
    { key: "platform" as const, label: "Platform", icon: Globe },
  ];

  return (
    <main className="min-h-screen bg-[#060B17]">
      {toast.msg && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium ${toast.type === "success" ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-red-500/20 border border-red-500/30 text-red-400"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 md:p-8 min-h-screen max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Settings size={22} className="text-amber-400" /> Settings</h1>
            <p className="text-white/40 text-sm mt-0.5">Admin account and platform configuration</p>
          </div>

          <div className="flex gap-2 mb-6">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setSection(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${section === t.key ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "glass border border-white/10 text-white/50 hover:text-white"}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {section === "profile" && (
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h2 className="font-bold">Admin Profile</h2>
              <div><label className={labelClass}>Full Name</label><input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className={inputClass} placeholder="Your name" /></div>
              <div><label className={labelClass}>Email</label><input value={profile.email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} /></div>
              <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save Profile
              </button>
            </div>
          )}

          {section === "security" && (
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="font-bold mb-5 flex items-center gap-2"><ShieldCheck size={16} className="text-amber-400" /> Change Password</h2>
              <form onSubmit={changePassword} className="space-y-4">
                {["newPass", "confirm"].map((key, i) => (
                  <div key={key}>
                    <label className={labelClass}>{i === 0 ? "New Password" : "Confirm Password"}</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} required minLength={8}
                        value={passwords[key as "newPass" | "confirm"]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="••••••••" className={`${inputClass} pr-10`} />
                      {i === 0 && (
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={changingPass} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                  {changingPass ? <Loader2 className="animate-spin" size={15} /> : <ShieldCheck size={15} />}
                  {changingPass ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {section === "platform" && (
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h2 className="font-bold">Platform Settings</h2>
              <div><label className={labelClass}>Site Name</label><input value={platform.site_name} onChange={e => setPlatform(p => ({ ...p, site_name: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Support Email</label><input value={platform.support_email} onChange={e => setPlatform(p => ({ ...p, support_email: e.target.value }))} placeholder="support@ittaacademy.com" className={inputClass} /></div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <div className="text-sm font-medium">Razorpay Live Mode</div>
                  <div className="text-xs text-white/40">Toggle between test and live payments</div>
                </div>
                <button onClick={() => setPlatform(p => ({ ...p, razorpay_live: !p.razorpay_live }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${platform.razorpay_live ? "bg-amber-500" : "bg-white/10"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${platform.razorpay_live ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <div className="text-sm font-medium">Maintenance Mode</div>
                  <div className="text-xs text-white/40">Show maintenance page to students</div>
                </div>
                <button onClick={() => setPlatform(p => ({ ...p, maintenance: !p.maintenance }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${platform.maintenance ? "bg-red-500" : "bg-white/10"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${platform.maintenance ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <button onClick={savePlatform} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
