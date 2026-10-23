"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useDepthStore } from "@/store/useDepthStore";
import { useBasketStore } from "@/store/basket";
import { PLACEHOLDERS } from "@/data/placeholders";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  X,
  Trash2,
  Send,
  ShoppingBag,
} from "lucide-react";

const orderSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  address: z.string().min(5, "Please enter your address in Karad"),
  slot: z.enum(["morning", "evening"]),
  specialNotes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export function OrderDrawer() {
  const t = useTranslations("orderModal");
  const tCommon = useTranslations("common");
  const tFish = useTranslations("fish");
  const locale = useLocale();
  const isMarathi = locale === "mr";

  const isDepthOpen = useDepthStore((state) => state.isOrderDrawerOpen);
  const closeDepthOrderDrawer = useDepthStore((state) => state.closeOrderDrawer);
  const selectedFish = useDepthStore((state) => state.selectedFishForOrder);
  const cart = useDepthStore((state) => state.cart);
  const removeFromCart = useDepthStore((state) => state.removeFromCart);
  const clearCart = useDepthStore((state) => state.clearCart);

  const isBasketOpen = useBasketStore((state) => state.isOpen);
  const closeBasketDrawer = useBasketStore((state) => state.closeDrawer);
  const basketItems = useBasketStore((state) => state.items);
  const activeSpecies = useBasketStore((state) => state.activeSpecies);
  const removeBasketItem = useBasketStore((state) => state.removeItem);
  const clearBasket = useBasketStore((state) => state.clearBasket);

  const isOpen = isDepthOpen || isBasketOpen;

  const handleClose = () => {
    closeDepthOrderDrawer();
    closeBasketDrawer();
  };

  // Form State
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    phone: "",
    address: "",
    slot: "morning",
    specialNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const data = result.data;

    // Generate WhatsApp Order Message
    const allItems: string[] = [];

    if (cart.length > 0) {
      cart.forEach((item) => {
        allItems.push(
          `${isMarathi ? item.fish.marathiName : tFish(item.fish.nameKey)} (${item.weight}, ${item.cut}) x ${item.quantity}`
        );
      });
    }

    if (basketItems.length > 0) {
      basketItems.forEach((item) => {
        const name = isMarathi
          ? item.species.marathiName || item.species.nameMr
          : (item.species.nameKey ? tFish(item.species.nameKey) : item.species.nameEn);
        const cut = item.cut || item.cleaningOption || "standard";
        allItems.push(`${name} (${item.weight}, ${cut}) x ${item.quantity}`);
      });
    }

    if (allItems.length === 0) {
      if (selectedFish) {
        allItems.push(
          `${isMarathi ? selectedFish.marathiName : tFish(selectedFish.nameKey)} (Curry Cut, 1kg)`
        );
      } else if (activeSpecies) {
        allItems.push(
          `${isMarathi ? activeSpecies.marathiName || activeSpecies.nameMr : activeSpecies.nameEn} (Curry Cut, 1kg)`
        );
      } else {
        allItems.push("Daily Fresh Catch Inquiry");
      }
    }

    const itemsList = allItems.map((item, i) => `${i + 1}. ${item}`).join("\n");

    const message =
      `*ए एन फिश वर्ल्ड - कराड (New Fresh Catch Order)*\n\n` +
      `*ग्राहक:* ${data.fullName}\n` +
      `*मोबाईल:* ${data.phone}\n` +
      `*डिलिव्हरी पत्ता:* ${data.address}\n` +
      `*वेळ:* ${data.slot === "morning" ? "Morning Harvest (8:30-11:30 AM)" : "Evening Harvest (5:00-7:30 PM)"}\n` +
      (data.specialNotes ? `*विशेष सूचना:* ${data.specialNotes}\n` : "") +
      `\n*मागवलेली मासोळी:*\n${itemsList}\n\n` +
      `कृपया आजचे दर व कन्फर्मेशन पाठवावे.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PLACEHOLDERS.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${encoded}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    clearBasket();
    setFormData({
      fullName: "",
      phone: "",
      address: "",
      slot: "morning",
      specialNotes: "",
    });
    setErrors({});
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-section="order-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-drawer-title"
          className="fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#05080C]/80 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg h-full bg-[#02111F] border-l border-[#6EC6F0]/25 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#6EC6F0]/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A9AD9]/20 flex items-center justify-center text-[#6EC6F0]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="order-drawer-title"
                    className={`${
                      isMarathi ? "font-marathi-display" : "font-latin-display"
                    } text-xl font-bold text-white`}
                  >
                    {t("title")}
                  </h3>
                  <div className="text-xs text-white/50">{tCommon("city")}</div>
                </div>
              </div>

              <button
                id="close-order-drawer-btn"
                type="button"
                onClick={handleClose}
                aria-label={tCommon("close")}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basket Items Summary */}
              {cart.length > 0 || basketItems.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#6EC6F0]">
                    <span>{tCommon("exploreCatch")}</span>
                    <button
                      id="clear-cart-btn"
                      type="button"
                      onClick={() => {
                        clearCart();
                        clearBasket();
                      }}
                      className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {cart.map((item, idx) => (
                    <div
                      key={`depth-cart-${idx}`}
                      className="p-3.5 rounded-xl bg-[#05080C]/60 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">
                          {isMarathi
                            ? item.fish.marathiName
                            : tFish(item.fish.nameKey)}
                        </div>
                        <div className="text-xs font-mono-accent text-white/60">
                          {item.weight} • Cut: {item.cut} • Qty: {item.quantity}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.fish.id, item.cut)}
                        aria-label="Remove item"
                        className="p-2 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {basketItems.map((item, idx) => (
                    <div
                      key={`basket-item-${idx}`}
                      className="p-3.5 rounded-xl bg-[#05080C]/60 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">
                          {isMarathi
                            ? item.species.marathiName || item.species.nameMr
                            : (item.species.nameKey ? tFish(item.species.nameKey) : item.species.nameEn)}
                        </div>
                        <div className="text-xs font-mono-accent text-white/60">
                          {item.weight} • Cut: {item.cut || item.cleaningOption || "standard"} • Qty: {item.quantity}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeBasketItem(item.species.slug, item.weight, item.cleaningOption)}
                        aria-label="Remove item"
                        className="p-2 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : selectedFish ? (
                <div className="p-4 rounded-xl bg-[#063A63]/30 border border-[#0A9AD9]/40">
                  <div className="text-xs font-semibold text-[#6EC6F0] mb-1">
                    Selected Catch:
                  </div>
                  <div className="text-base font-bold text-white">
                    {isMarathi
                      ? selectedFish.marathiName
                      : tFish(selectedFish.nameKey)}
                  </div>
                  <div className="text-xs text-white/70 mt-1 font-mono-accent">
                    Rate: {selectedFish.price}
                  </div>
                </div>
              ) : activeSpecies ? (
                <div className="p-4 rounded-xl bg-[#063A63]/30 border border-[#0A9AD9]/40">
                  <div className="text-xs font-semibold text-[#6EC6F0] mb-1">
                    Selected Catch:
                  </div>
                  <div className="text-base font-bold text-white">
                    {isMarathi
                      ? activeSpecies.marathiName || activeSpecies.nameMr
                      : (activeSpecies.nameKey ? tFish(activeSpecies.nameKey) : activeSpecies.nameEn)}
                  </div>
                  <div className="text-xs text-white/70 mt-1 font-mono-accent">
                    Rate: {activeSpecies.marketPrice || activeSpecies.pricePerKg}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#05080C]/50 border border-white/5 text-center text-xs text-white/60">
                  {t("cartEmpty")}
                </div>
              )}

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* Full Name */}
                <div>
                  <label htmlFor="order-form-fullname" className="block text-xs font-semibold text-white/80 mb-1.5">
                    {t("fullName")} *
                  </label>
                  <input
                    id="order-form-fullname"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="उदा. राहुल जाधव"
                    className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/15 focus:border-[#0A9AD9] text-white text-sm outline-none transition-colors"
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="order-form-phone" className="block text-xs font-semibold text-white/80 mb-1.5">
                    {t("phone")} *
                  </label>
                  <input
                    id="order-form-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/15 focus:border-[#0A9AD9] text-white text-sm outline-none transition-colors font-mono-accent"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Address in Karad */}
                <div>
                  <label htmlFor="order-form-address" className="block text-xs font-semibold text-white/80 mb-1.5">
                    {t("address")} *
                  </label>
                  <textarea
                    id="order-form-address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="फ्लॅट क्र., कॉलनी / भाग, कराड"
                    className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/15 focus:border-[#0A9AD9] text-white text-sm outline-none transition-colors resize-none"
                  />
                  {errors.address && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* Delivery Slot */}
                <div>
                  <span className="block text-xs font-semibold text-white/80 mb-1.5">
                    {t("slot")}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-[#05080C]/60 border border-white/10 cursor-pointer text-xs text-white">
                      <input
                        id="order-slot-morning"
                        type="radio"
                        name="slot"
                        value="morning"
                        checked={formData.slot === "morning"}
                        onChange={handleChange}
                        className="accent-[#0A9AD9]"
                      />
                      <span>{t("slotMorning")}</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-[#05080C]/60 border border-white/10 cursor-pointer text-xs text-white">
                      <input
                        id="order-slot-evening"
                        type="radio"
                        name="slot"
                        value="evening"
                        checked={formData.slot === "evening"}
                        onChange={handleChange}
                        className="accent-[#0A9AD9]"
                      />
                      <span>{t("slotEvening")}</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label htmlFor="order-form-notes" className="block text-xs font-semibold text-white/80 mb-1.5">
                    {t("notes")}
                  </label>
                  <input
                    id="order-form-notes"
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    type="text"
                    placeholder="उदा. बारीक तुकडे, डोके वेगळे हवे"
                    className="w-full px-4 py-3 rounded-xl bg-[#05080C]/80 border border-white/15 focus:border-[#0A9AD9] text-white text-sm outline-none transition-colors"
                  />
                </div>

                {/* Submit to WhatsApp Button */}
                <div className="pt-4">
                  <button
                    id="order-form-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#0A9AD9] hover:bg-[#6EC6F0] hover:text-[#05080C] text-white font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(10,154,217,0.5)] transition-all duration-200 flex items-center justify-center gap-2.5 focus-visible:outline-[#FFFFFF] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t("submitWhatsapp")}</span>
                  </button>
                  <div className="text-center text-[11px] text-white/40 mt-2">
                    Direct line to Karad Flagship Store: {PLACEHOLDERS.WHATSAPP_NUMBER}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
