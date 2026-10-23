"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useBasketStore } from "@/store/basket";
import { CleaningOption, CutType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Send,
  Sparkles,
  Phone,
} from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function BasketDrawer() {
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const {
    items,
    isOpen,
    activeSpecies,
    selectedBranch,
    closeDrawer,
    addItem,
    updateQuantity,
    removeItem,
    clearBasket,
    setSelectedBranch,
    getItemCount,
  } = useBasketStore();

  // Customization state for active species
  const [selectedWeight, setSelectedWeight] = useState<string>("1 kg");
  const [customWeight, setCustomWeight] = useState<string>("");
  const [selectedCleaning, setSelectedCleaning] = useState<CleaningOption>("cleaned");
  const [quantity, setQuantity] = useState<number>(1);

  // Customer details for WhatsApp pre-fill
  const [customerName, setCustomerName] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  const totalItemsCount = getItemCount();

  const handleAddCustomizedItem = () => {
    if (!activeSpecies) return;
    const finalWeight = selectedWeight === "custom" ? `${customWeight || "1"} kg` : selectedWeight;

    addItem({
      species: activeSpecies,
      weight: finalWeight,
      cleaningOption: selectedCleaning,
      quantity: quantity,
      cut: selectedCleaning === "fillet" ? "fillet" : selectedCleaning === "curry-cut" ? "curry" : "wholeCleaned",
    });

    // Reset local customization state
    setSelectedWeight("1 kg");
    setCustomWeight("");
    setQuantity(1);
  };

  const handleSendWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = "";
    if (isMarathi) {
      message += `नमस्कार AN Fish World, मला ऑर्डर द्यायची आहे:\n`;
      items.forEach((item) => {
        const cleaningText =
          item.cleaningOption === "whole"
            ? "आखा (Whole)"
            : item.cleaningOption === "cleaned"
            ? "साफ करून (Cleaned)"
            : item.cleaningOption === "curry-cut"
            ? "करी कट (Curry-cut)"
            : "फिलेट (Fillet)";
        message += `• ${item.species.nameMr} — ${item.weight} (${cleaningText}) x ${item.quantity}\n`;
      });
      message += `\nशाखा: ${selectedBranch}\n`;
      if (customerName) message += `नाव: ${customerName}\n`;
      if (customerAddress) message += `पत्ता: ${customerAddress}\n`;
      message += `\nकृपया आजचे अंतिम बिल व कन्फर्मेशन पाठवावे.`;
    } else {
      message += `Hello AN Fish World, I would like to place an order:\n`;
      items.forEach((item) => {
        const cleaningText =
          item.cleaningOption === "whole"
            ? "Whole"
            : item.cleaningOption === "cleaned"
            ? "Cleaned"
            : item.cleaningOption === "curry-cut"
            ? "Curry-cut"
            : "Fillet";
        message += `• ${item.species.nameEn} — ${item.weight} (${cleaningText}) x ${item.quantity}\n`;
      });
      message += `\nBranch: ${selectedBranch}\n`;
      if (customerName) message += `Name: ${customerName}\n`;
      if (customerAddress) message += `Address: ${customerAddress}\n`;
      message += `\nPlease confirm availability and total rate.`;
    }

    const encoded = encodeURIComponent(message);
    const phone = PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  return (
    <>
      {/* Sleek Compact WhatsApp Basket Widget (Revealed when items exist) */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.aside
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            aria-label="Basket Order Pill"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40"
          >
            <button
              id="sticky-basket-pill"
              type="button"
              onClick={() => useBasketStore.getState().openDrawer()}
              className="flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#0B9DD8] hover:bg-[#071A24] text-white font-mono-accent text-xs font-bold uppercase tracking-wider shadow-[0_6px_20px_rgba(11,157,216,0.45)] border border-white/20 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-white text-[#071A24] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              </div>
              <span className="hidden sm:inline">
                {isMarathi ? "व्हॉट्सॲप ऑर्डर" : "WhatsApp Order"}
              </span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Drawer Overlay & Body */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="basket-drawer-title"
            className="fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-[#0F1F10]/50 backdrop-blur-sm"
            />

            {/* Drawer Body (Desktop right-drawer / Mobile bottom-sheet) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="relative w-full max-w-md h-full bg-[#FFFFFF] border-l border-[#0F1F10]/10 shadow-2xl flex flex-col z-10 overflow-hidden text-[#0F1F10]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#0F1F10]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF8FF] flex items-center justify-center text-[#0A9AD9]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      id="basket-drawer-title"
                      className="text-lg font-bold text-[#0F1F10] tracking-tight"
                    >
                      {activeSpecies
                        ? isMarathi
                          ? "मासोळी कस्टमाईझ करा"
                          : "Customize Catch"
                        : isMarathi
                        ? `तुमची बास्केट (${totalItemsCount})`
                        : `Your Basket (${totalItemsCount})`}
                    </h3>
                    <div className="text-xs text-[#0F1F10]/60 font-mono-accent">
                      {isMarathi ? "कराड मध्यवर्ती स्टोअर" : "Karad Central Store"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close Drawer"
                  className="p-2 rounded-full hover:bg-[#F5F4F2] text-[#0F1F10]/60 hover:text-[#0F1F10] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Customization Section if a species was clicked */}
                {activeSpecies && (
                  <div className="p-4 rounded-2xl bg-[#F5F4F2] border border-[#0F1F10]/08 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center">
                        <img
                          src={activeSpecies.image}
                          alt={isMarathi ? activeSpecies.nameMr : activeSpecies.nameEn}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#0F1F10]">
                          {isMarathi ? activeSpecies.nameMr : activeSpecies.nameEn}
                        </h4>
                        <div className="text-xs font-mono-accent text-[#0A9AD9] font-bold">
                          {activeSpecies.pricePerKg}
                        </div>
                      </div>
                    </div>

                    {!activeSpecies.available ? (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                        {isMarathi
                          ? "आजची आवक संपली आहे (उद्या सकाळी उपलब्ध / Back Tomorrow)"
                          : "Sold out for today (Back tomorrow 4:00 AM)"}
                      </div>
                    ) : (
                      <>
                        {/* Weight Selection Chips */}
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1F10]/70 mb-2">
                            {isMarathi ? "वजन निवडा (Select Weight):" : "Select Weight:"}
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {["0.5 kg", "1 kg", "2 kg", "custom"].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setSelectedWeight(w)}
                                className={`py-2 px-2 text-xs font-mono-accent rounded-lg font-bold border transition-all ${
                                  selectedWeight === w
                                    ? "bg-[#0A9AD9] text-white border-[#0A9AD9]"
                                    : "bg-white text-[#0F1F10]/70 border-[#0F1F10]/10 hover:border-[#0A9AD9]"
                                }`}
                              >
                                {w === "custom" ? (isMarathi ? "इतर" : "Custom") : w}
                              </button>
                            ))}
                          </div>
                          {selectedWeight === "custom" && (
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              placeholder="e.g. 1.5"
                              value={customWeight}
                              onChange={(e) => setCustomWeight(e.target.value)}
                              className="mt-2 w-full px-3 py-2 rounded-lg bg-white border border-[#0F1F10]/15 text-xs font-mono-accent outline-none focus:border-[#0A9AD9]"
                            />
                          )}
                        </div>

                        {/* Cleaning Options */}
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1F10]/70 mb-2">
                            {isMarathi ? "कटिंग / साफसफाई (Cleaning Option):" : "Cleaning Option:"}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {activeSpecies.cleaningOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedCleaning(opt)}
                                className={`py-2 px-3 text-xs rounded-lg font-semibold border text-left transition-all ${
                                  selectedCleaning === opt
                                    ? "bg-[#0A9AD9] text-white border-[#0A9AD9]"
                                    : "bg-white text-[#0F1F10]/70 border-[#0F1F10]/10 hover:border-[#0A9AD9]"
                                }`}
                              >
                                {opt === "whole"
                                  ? isMarathi
                                    ? "आखा (Whole)"
                                    : "Whole"
                                  : opt === "cleaned"
                                  ? isMarathi
                                    ? "साफ करून (Cleaned)"
                                    : "Cleaned"
                                  : opt === "curry-cut"
                                  ? isMarathi
                                    ? "करी कट (Curry-cut)"
                                    : "Curry-cut"
                                  : isMarathi
                                  ? "फिलेट (Fillet)"
                                  : "Fillet"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-semibold text-[#0F1F10]/70">
                            {isMarathi ? "संख्या (Packs):" : "Packs:"}
                          </span>
                          <div className="flex items-center gap-3 bg-white border border-[#0F1F10]/10 rounded-lg px-2 py-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="p-1 hover:text-[#0A9AD9]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold font-mono-accent w-4 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className="p-1 hover:text-[#0A9AD9]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Add to Basket Action */}
                        <button
                          type="button"
                          onClick={handleAddCustomizedItem}
                          className="w-full py-3 rounded-xl bg-[#0A9AD9] hover:bg-[#063A63] text-white text-xs font-bold font-mono-accent uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{isMarathi ? "बास्केटमध्ये जोडा" : "Add to Basket"}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* 2. Basket Items List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono-accent font-bold uppercase tracking-wider text-[#0F1F10]/60">
                      {isMarathi ? "निवडलेली मासोळी" : "Selected Catch"}
                    </span>
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={clearBasket}
                        className="text-[11px] text-[#0F1F10]/40 hover:text-red-500 transition-colors"
                      >
                        {isMarathi ? "सर्व काढा" : "Clear all"}
                      </button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#F5F4F2] text-center space-y-2 border border-dashed border-[#0F1F10]/10">
                      <ShoppingBag className="w-8 h-8 text-[#0F1F10]/30 mx-auto" />
                      <div className="text-xs font-semibold text-[#0F1F10]/60">
                        {isMarathi
                          ? "तुमची बास्केट रिकामी आहे"
                          : "Your basket is currently empty"}
                      </div>
                      <div className="text-[11px] text-[#0F1F10]/40">
                        {isMarathi
                          ? "आजच्या ताज्या आवकमधून आवडीची मासोळी निवडा"
                          : "Select fresh species from today's catch reel"}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {items.map((item, i) => (
                        <div
                          key={`${item.species.slug}-${item.weight}-${item.cleaningOption}-${i}`}
                          className="p-3.5 rounded-xl bg-white border border-[#0F1F10]/08 shadow-sm flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-sm font-bold text-[#0F1F10]">
                              {isMarathi ? item.species.nameMr : item.species.nameEn}
                            </div>
                            <div className="text-xs font-mono-accent text-[#0F1F10]/60">
                              {item.weight} • {item.cleaningOption}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-[#F5F4F2] rounded-md px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.species.slug,
                                    item.weight,
                                    item.cleaningOption,
                                    -1
                                  )
                                }
                                className="p-0.5 hover:text-red-500"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold font-mono-accent">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.species.slug,
                                    item.weight,
                                    item.cleaningOption,
                                    1
                                  )
                                }
                                className="p-0.5 hover:text-[#0A9AD9]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.species.slug,
                                  item.weight,
                                  item.cleaningOption
                                )
                              }
                              className="text-[#0F1F10]/30 hover:text-red-500 p-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Delivery / Branch Details */}
                {items.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-[#0F1F10]/10">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1F10]/70 mb-1">
                        {isMarathi ? "शाखा / पिकअप पॉईंट" : "Branch / Pickup Point"}
                      </label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#0F1F10]/15 text-xs text-[#0F1F10] outline-none"
                      >
                        <option value="कराड मध्यवर्ती (भाजी मंडई रोड)">
                          कराड मध्यवर्ती (भाजी मंडई रोड) / Karad Central
                        </option>
                        <option value="कोल्हापूर नाका शाखा (Kolhapur Naka)">
                          कोल्हापूर नाका शाखा (Kolhapur Naka)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1F10]/70 mb-1">
                        {isMarathi ? "तुमचे नाव (Name)" : "Your Name"}
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. राहुल जाधव"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#0F1F10]/15 text-xs text-[#0F1F10] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1F10]/70 mb-1">
                        {isMarathi ? "पत्ता / कॉलनी (Address in Karad)" : "Address in Karad"}
                      </label>
                      <input
                        type="text"
                        placeholder="फ्लॅट क्र., कॉलनी / भाग"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#0F1F10]/15 text-xs text-[#0F1F10] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer WhatsApp Action */}
              <div className="p-6 border-t border-[#0F1F10]/10 bg-[#F5F4F2]">
                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={handleSendWhatsAppOrder}
                  className={`w-full py-4 rounded-xl text-white font-mono-accent text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md ${
                    items.length === 0
                      ? "bg-[#0F1F10]/20 cursor-not-allowed"
                      : "bg-[#0A9AD9] hover:bg-[#063A63] cursor-pointer"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isMarathi
                      ? "व्हॉट्सॲपवर ऑर्डर पाठवा (Confirm on WhatsApp)"
                      : "Send Order on WhatsApp"}
                  </span>
                </button>
                <div className="text-center text-[10px] text-[#0F1F10]/50 mt-2 font-mono-accent">
                  Karad Store Line: {PLACEHOLDERS.WHATSAPP_NUMBER}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
