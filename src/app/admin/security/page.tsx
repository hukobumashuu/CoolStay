"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Globe,
  Key,
  Mail,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";

// --- Mock Data ---
const accountInfo = {
  name: "Admin User",
  email: "admin@coolstay.com",
  role: "Super Admin",
  lastLogin: "Oct 24, 2025 • 08:30 AM",
  twoFactorEnabled: true,
  securityScore: 85,
};

const sessionHistory = [
  {
    id: "SES-001",
    device: "MacBook Pro M1",
    type: "Desktop",
    browser: "Chrome",
    location: "Quezon City, PH",
    ip: "192.168.1.1",
    active: true,
    lastActive: "Now",
  },
  {
    id: "SES-002",
    device: "iPhone 14 Pro",
    type: "Mobile",
    browser: "Safari",
    location: "Bulacan, PH",
    ip: "112.198.1.5",
    active: false,
    lastActive: "2 hours ago",
  },
  {
    id: "SES-003",
    device: "Windows PC",
    type: "Desktop",
    browser: "Edge",
    location: "Makati City, PH",
    ip: "124.106.1.2",
    active: false,
    lastActive: "Oct 20, 2025",
  },
];

// --- Components ---

const SecurityToggle = ({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) => (
  <div className="flex items-center justify-between p-4 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors bg-white">
    <div className="flex items-center gap-4">
      <div
        className={`p-2 rounded-lg ${
          enabled
            ? "bg-green-100 text-green-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {enabled ? (
          <ShieldCheck className="w-6 h-6" />
        ) : (
          <ShieldAlert className="w-6 h-6" />
        )}
      </div>
      <div>
        <h4 className="font-bold text-[#0A1A44]">{label}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>

    <button
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
        enabled ? "bg-[#0A1A44]" : "bg-slate-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>
    </button>
  </div>
);

export default function SecurityPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#cde4fa] p-8 -m-6 font-sans">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-black">
            Security & Verification
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Manage your account access and security settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Profile & Credentials (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Account Details Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>

            <h2 className="text-xl font-bold text-[#0A1A44] mb-6 relative z-10 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" /> Account Profile
            </h2>

            <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
              {/* Avatar Area */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-[#0A1A44] text-white flex items-center justify-center text-3xl font-serif font-bold border-4 border-blue-100 shadow-lg">
                  AD
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {accountInfo.role}
                </span>
              </div>

              {/* Form Fields (Read Only for View) */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Display Name
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    <span className="flex-1">{accountInfo.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">{accountInfo.email}</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 pt-2">
                  <button className="bg-white border-2 border-[#0A1A44] text-[#0A1A44] hover:bg-blue-50 px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Login & Security Settings */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
            <h2 className="text-xl font-bold text-[#0A1A44] mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-500" /> Login & Recovery
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-blue-100 rounded-xl bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1A44]">Password</h4>
                    <p className="text-xs text-slate-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline">
                  Update
                </button>
              </div>

              <SecurityToggle
                label="Two-Factor Authentication"
                description="Secure your account with 2FA via authenticator app."
                enabled={accountInfo.twoFactorEnabled}
              />

              <SecurityToggle
                label="Login Alerts"
                description="Get notified when a new device signs in."
                enabled={false}
              />
            </div>
          </div>
        </div>

        {/* --- Right Column: Security Score & Sessions (1/3 width) --- */}
        <div className="space-y-8">
          {/* 1. Security Score Card */}
          <div className="bg-[#0A1A44] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/background/coolstaybg.png')] opacity-10 bg-cover bg-center"></div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-4">
                Security Health
              </h3>
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-green-500 mb-4 bg-[#0f2452] shadow-2xl">
                <span className="text-4xl font-serif font-bold">
                  {accountInfo.securityScore}%
                </span>
              </div>
              <p className="text-sm text-gray-300 px-4">
                Your account is looking good! Enable login alerts to reach 100%.
              </p>
            </div>
          </div>

          {/* 2. Session History */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1A44]">Active Sessions</h3>
              <button className="text-xs font-bold text-red-500 hover:text-red-700">
                Sign Out All
              </button>
            </div>

            <div className="space-y-4">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className="group bg-white p-4 rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          session.active ? "text-green-500" : "text-slate-400"
                        }`}
                      >
                        {session.type === "Mobile" ? (
                          <Smartphone className="w-5 h-5" />
                        ) : (
                          <Laptop className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0A1A44]">
                          {session.device}
                        </p>
                        <p className="text-xs text-slate-500">
                          {session.location} • {session.browser}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              session.active ? "bg-green-500" : "bg-slate-300"
                            }`}
                          ></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {session.active ? "Active Now" : session.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    {session.active ? (
                      <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    ) : (
                      <button className="text-slate-300 hover:text-red-500 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-blue-100 text-center">
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <History className="w-3 h-3" />
                Last account login: {accountInfo.lastLogin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
