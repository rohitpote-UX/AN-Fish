export interface JournalArticle {
  slug: string;
  categoryEn: string;
  categoryMr: string;
  image: string;
  dateEn: string;
  dateMr: string;
  titleEn: string;
  titleMr: string;
  excerptEn: string;
  excerptMr: string;
  readTimeEn: string;
  readTimeMr: string;
  featured?: boolean;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "how-to-identify-fresh-fish",
    categoryEn: "Fish Guide",
    categoryMr: "मासोळी मार्गदर्शक",
    image: "/media/cutting-hygiene.jpg",
    dateEn: "October 18, 2026",
    dateMr: "१८ ऑक्टोबर २०२६",
    titleEn: "How to Spot Truly Fresh Fish in Under 10 Seconds",
    titleMr: "अवघ्या १० सेकंदात अस्सल ताजी मासोळी कशी ओळखावी?",
    excerptEn: "Clear convex eyes, deep red gills without slime, and flesh that springs right back: three foolproof checks every home cook must know before buying.",
    excerptMr: "पारदर्शक फुगीर डोळे, चिकट नसलेले लालसर कल्ले आणि बोटाने दाबल्यावर लगेच पूर्ववत होणारे घट्ट मांस: खरेदी करताना प्रत्येक गृहिणीला उपयुक्त ३ चाचण्या.",
    readTimeEn: "4 min read",
    readTimeMr: "४ मिनिटे वाचन",
    featured: true,
  },
  {
    slug: "dawn-auctions-malvan-to-karad",
    categoryEn: "Videos & Media",
    categoryMr: "व्हिडीओ व वार्ता",
    image: "/media/harbour-catch.jpg",
    dateEn: "October 12, 2026",
    dateMr: "१२ ऑक्टोबर २०२६",
    titleEn: "4:00 AM Harbour Rush: From Malvan Boats to Karad Tables",
    titleMr: "पहाटे ४:०० ची लगबग: मालवण लिलाव ते कराडमधील स्वयंपाकघर",
    excerptEn: "Watch our sourcing team bid for the dawn catch, chill it immediately in sub-zero slurry, and rush it over the ghats before morning breakfast.",
    excerptMr: "पहाटेच्या सागरी लिलावातून सर्वोत्तम मासे निवडणे, ०°C लिक्विड आईसमध्ये सुरक्षित पॅक करणे आणि घाट ओलांडून सकाळी कराडमध्ये पोहोचवणे.",
    readTimeEn: "3 min watch",
    readTimeMr: "३ मिनिटे व्हिडीओ",
    featured: true,
  },
  {
    slug: "perfect-crispy-rava-surmai",
    categoryEn: "Culinary Tips",
    categoryMr: "पाककृती व टिप्स",
    image: "/media/family-dinner.jpg",
    dateEn: "October 05, 2026",
    dateMr: "०५ ऑक्टोबर २०२६",
    titleEn: "The Secret to Restaurant-Style Crispy Rava Fry Surmai at Home",
    titleMr: "हॉटेलसारखी कुरकुरीत रवा फ्राय सुरमई घरच्या तव्यावर कशी करावी?",
    excerptEn: "Why marinating in Malvani masala and coarse semolina without eggs yields that quintessential crunchy crust and succulent flake inside.",
    excerptMr: "मालवणी मसाला, लिंबाचा रस आणि बारीक रवा यांचे योग्य प्रमाण वापरून घरच्या घरी कुरकुरीत आणि आतून मऊ सुरमई फ्राय करण्याचे रहस्य.",
    readTimeEn: "5 min read",
    readTimeMr: "५ मिनिटे वाचन",
  },
  {
    slug: "wholesale-cold-chain-logistics",
    categoryEn: "Business Insights",
    categoryMr: "हॉटेल व्यवसाय",
    image: "/media/b2b-chef.jpg",
    dateEn: "September 28, 2026",
    dateMr: "२८ सप्टेंबर २०२६",
    titleEn: "How Leading Karad Restaurants Maintain Zero Fish Wastage",
    titleMr: "कराडमधील नामांकित हॉटेल्स माशांची नासाडी कशी रोखतात?",
    excerptEn: "Predictable morning bulk deliveries at consistent 0°C temperatures help culinary businesses eliminate spoilage and guarantee diner praise.",
    excerptMr: "वेळेवर घाऊक पुरवठा आणि अखंड ०°C शीतसाखळीमुळे हॉटेल चालकांना मिळणारा दर्जेदार माल आणि वाढणारा नफा.",
    readTimeEn: "4 min read",
    readTimeMr: "४ मिनिटे वाचन",
  },
];
