"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { MessageCircle, Phone, Sparkles, Check, Clock, MapPin, Send } from "lucide-react";
import { PLACEHOLDERS } from "@/data/placeholders";

export function OrderSection() {
  const locale = useLocale();
  const isMarathi = locale === "mr";
  const isHindi = locale === "hi";

  const [fishSpecies, setFishSpecies] = useState("सिल्व्हर पापलेट (Silver Pomfret)");
  const [weight, setWeight] = useState("१ किलो (1 kg)");
  const [cutType, setCutType] = useState("तवा फ्राय कट (Tawa Fry Slices)");
  const [customerName, setCustomerName] = useState("");
  const [deliveryType, setDeliveryType] = useState("home");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const cleanWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDERS.WHATSAPP_NUMBER).replace(
    /[^0-9]/g,
    ""
  );

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderText = isMarathi
      ? `*नवीन ताजी मासोळी ऑर्डर — AN Fish World कराड*\n\n` +
        `🐟 *माशाचा प्रकार:* ${fishSpecies}\n` +
        `⚖️ *वजन:* ${weight}\n` +
        `🔪 *कटिंग पद्धत:* ${cutType}\n` +
        `📦 *डिलिव्हरी:* ${deliveryType === "home" ? "घरपोच डिलिव्हरी कराड" : "स्टोअरवरून स्वतः नेणार (Self Pickup)"}\n` +
        `👤 *नाव:* ${customerName || "ग्राहक"}\n` +
        `📱 *मोबाईल:* ${phone || "उपलब्ध नाही"}\n` +
        `📍 *पत्ता:* ${address || "कराड"}\n\n` +
        `कृपया आजचा दर आणि डिलिव्हरी वेळ कन्फर्म करा.`
      : isHindi
      ? `*नई ताजी मछली ऑर्डर — AN Fish World कराड*\n\n` +
        `🐟 *मछली का प्रकार:* ${fishSpecies}\n` +
        `⚖️ *वजन:* ${weight}\n` +
        `🔪 *कटिंग प्रकार:* ${cutType}\n` +
        `📦 *डिलीवरी:* ${deliveryType === "home" ? "होम डिलीवरी कराड" : "स्टोर से खुद लेंगे (Self Pickup)"}\n` +
        `👤 *नाम:* ${customerName || "ग्राहक"}\n` +
        `📱 *मोबाइल:* ${phone || "उपलब्ध नहीं"}\n` +
        `📍 *पता:* ${address || "कराड"}\n\n` +
        `कृपया आज का भाव और डिलीवरी समय कन्फर्म करें।`
      : `*NEW FRESH FISH ORDER — AN Fish World Karad*\n\n` +
        `🐟 *Fish Variety:* ${fishSpecies}\n` +
        `⚖️ *Weight:* ${weight}\n` +
        `🔪 *Cut Preference:* ${cutType}\n` +
        `📦 *Delivery Mode:* ${deliveryType === "home" ? "Home Delivery (Karad)" : "Self Pickup"}\n` +
        `👤 *Name:* ${customerName || "Customer"}\n` +
        `📱 *Phone:* ${phone || "Not provided"}\n` +
        `📍 *Address:* ${address || "Karad"}\n\n` +
        `Please confirm today's market price and delivery slot.`;

    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(orderText)}`;
    window.open(url, "_blank");
  };

  return (
    <section
      id="order"
      className="relative py-20 lg:py-28 bg-[#071A24] text-white overflow-hidden scroll-mt-20"
      aria-label="Order Fresh Fish"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0A9AD9]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A9AD9]/15 border border-[#0A9AD9]/30 text-xs font-semibold text-[#6EC6F0] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#6EC6F0]" />
            <span>
              {isMarathi ? "सोपी व जलद ऑर्डर" : isHindi ? "आसान व त्वरित ऑर्डर" : "Quick & Easy Ordering"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-marathi-display text-white">
            {isMarathi
              ? "आजच आपली ताजी मासोळी ऑर्डर करा!"
              : isHindi
              ? "आज ही अपनी ताजी मछली ऑर्डर करें!"
              : "Order Today's Fresh Fish Now!"}
          </h2>

          <p className="text-sm sm:text-base text-white/75 font-marathi-body leading-relaxed">
            {isMarathi
              ? "खालील तपशील निवडा आणि थेट आमच्या व्हॉट्सॲपवर पाठवा. आम्ही लगेच संपर्क साधून ताजी मासोळी आपल्या घरी पोहोचवू."
              : isHindi
              ? "नीचे दिए गए विवरण चुनें और सीधे हमारे व्हाट्सएप पर भेजें। हम तुरंत संपर्क करके ताजी मछली आपके घर पहुंचाएंगे।"
              : "Select your preferred species, cut and weight. Order goes directly to our Karad counter on WhatsApp."}
          </p>
        </div>

        {/* Order Card Container */}
        <div className="bg-[#0D2634] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
            
            {/* Row 1: Fish Species & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "१. माशाचा प्रकार निवडा *" : isHindi ? "१. मछली का प्रकार चुनें *" : "1. Select Fish Species *"}
                </label>
                <select
                  value={fishSpecies}
                  onChange={(e) => setFishSpecies(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0A9AD9] focus:ring-1 focus:ring-[#0A9AD9]"
                >
                  <option value="सिल्व्हर पापलेट (Silver Pomfret)">सिल्व्हर पापलेट (Silver Pomfret)</option>
                  <option value="किंग सुरमई स्टेक्स (King Surmai)">किंग सुरमई स्टेक्स (King Surmai)</option>
                  <option value="इंडियन सामन रावस (Rawas Salmon)">इंडियन सामन / रावस (Rawas)</option>
                  <option value="रॉयल टायगर कोळंबी (Tiger Prawns)">रॉयल टायगर कोळंबी (Tiger Prawns)</option>
                  <option value="ताजा बांगडा (Fresh Mackerel)">ताजा बांगडा (Fresh Mackerel)</option>
                  <option value="कृष्णा-कोयना रोहू (Rohu)">कृष्णा-कोयना रोहू (Rohu)</option>
                  <option value="कोयना-कृष्णा कटला (Catla)">कोयना-कृष्णा कटला (Catla)</option>
                  <option value="जिवंत चिंबोरी / खेकडे (Mud Crabs)">जिवंत चिंबोरी / खेकडे (Mud Crabs)</option>
                  <option value="जिताडा / सीबास (Jitada)">जिताडा / सीबास (Jitada)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "२. आवश्यक वजन *" : isHindi ? "२. आवश्यक वजन *" : "2. Weight / Quantity *"}
                </label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0A9AD9] focus:ring-1 focus:ring-[#0A9AD9]"
                >
                  <option value="५०० ग्रॅम (500g)">५०० ग्रॅम (500g)</option>
                  <option value="१ किलो (1 kg)">१ किलो (1 kg)</option>
                  <option value="१.५ किलो (1.5 kg)">१.५ किलो (1.5 kg)</option>
                  <option value="२ किलो (2 kg)">२ किलो (2 kg)</option>
                  <option value="३+ किलो घाऊक / पार्टी ऑर्डर">३+ किलो (हॉटेल / पार्टी ऑर्डर)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Cutting Style & Delivery Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "३. कटिंग पद्धत (मोफत) *" : isHindi ? "३. कटिंग प्रकार (मुफ्त) *" : "3. Cut Preference (Free) *"}
                </label>
                <select
                  value={cutType}
                  onChange={(e) => setCutType(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0A9AD9] focus:ring-1 focus:ring-[#0A9AD9]"
                >
                  <option value="तवा फ्राय कट (रवा फ्राय स्टेक्स)">तवा फ्राय कट (रवा फ्राय स्टेक्स)</option>
                  <option value="कालवण / करी कट">कालवण / करी कट (Curry Slices)</option>
                  <option value="अखंड स्वच्छ धुवून (Whole Cleaned)">अखंड स्वच्छ धुवून (Whole Cleaned)</option>
                  <option value="बोनलेस फिलेट (Boneless Fillet)">बोनलेस फिलेट (Boneless Fillet)</option>
                  <option value="कोळंबी सोलून (Deveined Prawns)">कोळंबी सोलून स्वच्छ (Deveined)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "४. डिलिव्हरी प्रकार *" : isHindi ? "४. डिलीवरी प्रकार *" : "4. Delivery Mode *"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`py-3 px-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                      deliveryType === "home"
                        ? "bg-[#0A9AD9] text-[#071A24] border-[#0A9AD9] shadow-md"
                        : "bg-[#071A24] text-white/70 border-white/20 hover:border-white/40"
                    }`}
                  >
                    {isMarathi ? "घरपोच डिलिव्हरी" : isHindi ? "होम डिलीवरी" : "Home Delivery"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`py-3 px-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                      deliveryType === "pickup"
                        ? "bg-[#0A9AD9] text-[#071A24] border-[#0A9AD9] shadow-md"
                        : "bg-[#071A24] text-white/70 border-white/20 hover:border-white/40"
                    }`}
                  >
                    {isMarathi ? "स्टोअर पिकअप" : isHindi ? "स्टोर पिकअप" : "Store Pickup"}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Name, Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "आपले नाव" : isHindi ? "आपका नाम" : "Your Name"}
                </label>
                <input
                  type="text"
                  placeholder={isMarathi ? "उदा. अमोल पाटील" : isHindi ? "उदा. राहुल शर्मा" : "e.g. Amol Patil"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0A9AD9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "मोबाईल क्रमांक" : isHindi ? "मोबाइल नंबर" : "Phone Number"}
                </label>
                <input
                  type="tel"
                  placeholder={isMarathi ? "उदा. 98XXXXXXXX" : isHindi ? "उदा. 98XXXXXXXX" : "e.g. 98XXXXXXXX"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0A9AD9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6EC6F0] mb-2 font-marathi-display">
                  {isMarathi ? "पत्ता / कराड परिसर" : isHindi ? "पता / कराड क्षेत्र" : "Karad Area / Address"}
                </label>
                <input
                  type="text"
                  placeholder={isMarathi ? "उदा. विद्यानगर, कराड" : isHindi ? "उदा. विद्यानगर, कराड" : "e.g. Vidyanagar, Karad"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#071A24] border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0A9AD9]"
                />
              </div>
            </div>

            {/* Submit Button (WhatsApp Direct) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Clock className="w-4 h-4 text-[#6EC6F0]" />
                <span>
                  {isMarathi
                    ? "सकाळी ७:०० ते १:०० • संध्याकाळी ४:३० ते ९:०० चालू"
                    : isHindi
                    ? "सुबह ७:०० से १:०० • शाम ४:३० से ९:०० खुला"
                    : "Open: 7:00 AM - 1:00 PM • 4:30 PM - 9:00 PM"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-green-900/30 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{isMarathi ? "व्हॉट्सॲपवर ऑर्डर पाठवा" : isHindi ? "व्हाट्सएप पर ऑर्डर भेजें" : "Send Order on WhatsApp"}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}
