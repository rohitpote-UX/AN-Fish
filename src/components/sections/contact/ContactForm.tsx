"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const isMarathi = locale === "mr";
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    websiteUrl: "", // Honeypot
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setStatus("success");
      setFormData({ fullName: "", phone: "", email: "", message: "", websiteUrl: "" });
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(
        isMarathi
          ? "माहिती पाठवताना त्रुटी आली. कृपया फोन किंवा व्हॉट्सॲपवर संपर्क करा."
          : message
      );
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-8 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">
          {isMarathi ? "आपला संदेश यशस्वीरीत्या पाठवला!" : "Inquiry Sent Successfully!"}
        </h3>
        <p className="text-sm text-[#E9F7FF]/80 max-w-md mx-auto">
          {isMarathi
            ? "ए एन फिश वर्ल्ड टीम लवकरच आपल्याशी संपर्क करेल. तातडीच्या ऑर्डरसाठी आपण थेट व्हॉट्सॲपवर संपर्क करू शकता."
            : "The AN Fish World team will get in touch shortly. For immediate orders, feel free to ping us on WhatsApp."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
        >
          {isMarathi ? "दुसरा संदेश पाठवा" : "Send Another Message"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field (hidden from real users) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="websiteUrl">Website URL (leave empty)</label>
        <input
          id="websiteUrl"
          type="text"
          name="websiteUrl"
          tabIndex={-1}
          autoComplete="off"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-fullName" className="block text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider mb-2">
            {isMarathi ? "पूर्ण नाव *" : "Full Name *"}
          </label>
          <input
            id="contact-fullName"
            type="text"
            required
            placeholder={isMarathi ? "उदा. राहुल पाटील" : "e.g. Rahul Patil"}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/10 focus:border-[#0A9AD9] focus:outline-none text-white text-sm transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider mb-2">
            {isMarathi ? "मोबाईल नंबर (१० अंक) *" : "Mobile Number (10 Digits) *"}
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            pattern="[0-9]{10}"
            placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/10 focus:border-[#0A9AD9] focus:outline-none text-white text-sm font-mono-accent transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider mb-2">
          {isMarathi ? "ईमेल (पर्यायी)" : "Email Address (Optional)"}
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/10 focus:border-[#0A9AD9] focus:outline-none text-white text-sm transition-colors"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-mono-accent text-[#6EC6F0] uppercase tracking-wider mb-2">
          {isMarathi ? "आपला संदेश किंवा चौकशी *" : "Your Message or Inquiry *"}
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder={
            isMarathi
              ? "उदा. आजच्या पापलेटचे ताजे दर, किंवा ५ किलो सुरमई ऑर्डर..."
              : "e.g. Inquiring about today's Pomfret rates, or 5kg catering order..."
          }
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/10 focus:border-[#0A9AD9] focus:outline-none text-white text-sm transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        id="contact-submit-btn"
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(10,154,217,0.4)] transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{isMarathi ? "पाठवत आहे..." : "Sending..."}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{isMarathi ? "संदेश पाठवा" : "Send Inquiry"}</span>
          </>
        )}
      </button>
    </form>
  );
}
