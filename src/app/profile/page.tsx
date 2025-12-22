"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import HomeFooter from "@/components/HomeFooter";
import { Button } from "@/components/ui/Button";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner"; // Import

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    gender: "Prefer not to say",
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            gender: profile.gender || "Prefer not to say",
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const toastId = toast.loading("Updating profile..."); // Loading toast

    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    toast.dismiss(toastId); // Remove loading
    if (error) {
      toast.error("Error updating profile: " + error.message);
    } else {
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F0F4F8]">
      <Navbar activePage="" logoVariant="text" />
      <div className="grow pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-serif font-bold text-[#0A1A44]">
              My Profile
            </h1>
            <p className="text-gray-500">Manage your personal information</p>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-100 rounded-lg"></div>
              <div className="h-10 bg-gray-100 rounded-lg"></div>
              <div className="h-10 bg-gray-100 rounded-lg"></div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0A1A44] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0A1A44] uppercase">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                  placeholder="+63"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0A1A44] uppercase">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0A1A44] uppercase">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-900 font-medium"
                  placeholder="Your home address..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0A1A44] hover:bg-[#0A1A44]/90 text-white px-8 py-3 rounded-xl shadow-lg w-full md:w-auto"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <HomeFooter />
    </main>
  );
}
