export interface GalleryMediaItem {
  id: string;
  type: "video" | "image";
  videoSrc?: string;
  thumbnailSrc: string;
  titleMr: string;
  titleEn: string;
  descMr: string;
  descEn: string;
  category: "all" | "counter" | "hygiene" | "community";
  viewsMr: string;
  viewsEn: string;
  badgeMr: string;
  badgeEn: string;
  youtubeId?: string;
  isRealProfileMedia: boolean;
}

export const OFFICIAL_PROFILE_INFO = {
  instagramHandle: "@an.fishworld",
  instagramUrl: "https://www.instagram.com/an.fishworld",
  instagramFollowers: "1,53,000+",
  instagramFollowersMr: "१,५३,०००+ फॉलोअर्स",
  bioTaglineMr: "आमच्या लाडक्या ग्राहकांची लाडकी फिश कंपनी. असंच भरपूर प्रेम करत रहा.. खुश रहा आणि मासे खावा.",
  bioTaglineEn: "The most loved seafood store for our beloved patrons. Eat fresh fish, stay happy.",
  youtubeHandle: "@anfishworld",
  youtubeUrl: "https://www.youtube.com/@anfishworld",
  youtubeVideosCount: "३३०+ व्हिडिओ",
  whatsappCommunityUrl: "https://chat.whatsapp.com/IqBmVytOXnr6nvYp09WTPB?mode=gi_t",
  googleMapsLocationUrl: "https://share.google/bVISJrEvT2G25N0HU",
  avatarSrc: "/brand/an_instagram_avatar.jpg",
};

export const REAL_GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: "karad-outlet-tour",
    type: "video",
    videoSrc: "/media/gallery/karad-outlet-tour.mp4",
    thumbnailSrc: "/media/gallery/karad-outlet-tour.webp",
    titleMr: "कराड मुख्य दालन — ताजी आवक व प्रत्यक्ष भेट",
    titleEn: "Karad Flagship Hub — Live Fresh Seafood Counter",
    descMr: "दररोज सकाळी ०°C लिक्विड आईसवर मांडलेली टवटवीत सागरी मासोळी आणि ग्राहकांची पसंती.",
    descEn: "Daily dawn harbour arrivals arranged at 0°C crushed ice slurry at Karad flagship store.",
    category: "counter",
    viewsMr: "८,०००+ व्ह्यूज",
    viewsEn: "8,000+ views",
    badgeMr: "कराड दालन",
    badgeEn: "Karad Outlet",
    youtubeId: "BqhCTDVs5Yk",
    isRealProfileMedia: true,
  },
  {
    id: "cutting-mastery",
    type: "video",
    videoSrc: "/media/gallery/cutting-mastery.mp4",
    thumbnailSrc: "/media/gallery/cutting-mastery.webp",
    titleMr: "१० किलो मोडोसा (सकला) माशाचे चोख कटिंग",
    titleEn: "10 Kg Giant Modoso Fish Master Clean & Cut",
    descMr: "उच्च दर्जाची स्वच्छता, शुद्ध आरओ पाणी आणि निष्णात कारागिरांकडून अचूक व सुबक कटिंग.",
    descEn: "Expert fishmongers performing precision slicing, skinning and portioning under RO water.",
    category: "hygiene",
    viewsMr: "३,०००+ व्ह्यूज",
    viewsEn: "3,000+ views",
    badgeMr: "थेट कटिंग",
    badgeEn: "Live Slicing",
    youtubeId: "1ZSfpkIt8BM",
    isRealProfileMedia: true,
  },
  {
    id: "quality-bangda",
    type: "video",
    videoSrc: "/media/gallery/quality-bangda.mp4",
    thumbnailSrc: "/media/gallery/quality-bangda.webp",
    titleMr: "पहाटेच्या बोटींवरून अस्सल ताजा बांगडा आवक",
    titleEn: "Coastal Dawn Catch — Super Fresh Quality Bangda",
    descMr: "रत्नागिरी व मालवण बंदरावरून पहाटे थेट कराडमध्ये दाखल झालेला टवटवीत व चमकदार बांगडा.",
    descEn: "Unbroken cold chain transport straight from coastal harbours to Karad store counters.",
    category: "counter",
    viewsMr: "२७,०००+ व्ह्यूज",
    viewsEn: "27,000+ views",
    badgeMr: "ताजी आवक",
    badgeEn: "Fresh Arrival",
    youtubeId: "IoVJ1-uBcvs",
    isRealProfileMedia: true,
  },
  {
    id: "karad-dhamaka",
    type: "video",
    videoSrc: "/media/gallery/karad-dhamaka.mp4",
    thumbnailSrc: "/media/gallery/karad-dhamaka.webp",
    titleMr: "कराड, पाटण, ईश्वरपूर — धमाका ताजी आवक",
    titleEn: "Karad, Patan & Ishwarpur Mega Dispatch",
    descMr: "सर्व शाखांमध्ये एकाच वेळी ताजी मासोळी दाखल; कराडकर खवय्यांचा अखंड विश्वास व उदंड प्रतिसाद.",
    descEn: "Simultaneous fresh catch dispatch across all regional branches with huge community response.",
    category: "community",
    viewsMr: "१,००,०००+ व्ह्यूज",
    viewsEn: "100K+ views",
    badgeMr: "धमाका आवक",
    badgeEn: "Mega Arrival",
    youtubeId: "JR1IfG-jNEM",
    isRealProfileMedia: true,
  },
  {
    id: "ishwarpur-branch-tuna",
    type: "video",
    videoSrc: "/media/gallery/ishwarpur-branch-tuna.mp4",
    thumbnailSrc: "/media/gallery/ishwarpur-branch-tuna.webp",
    titleMr: "ईश्वरपूर शाखा — यलो ट्यूना (Yellow Tuna) स्पेशल",
    titleEn: "Ishwarpur Branch — Giant Yellowfin Tuna Showcase",
    descMr: "दुर्मिळ व उच्च दर्जाची सागरी ट्यूना मासोळी थेट दालनात ग्राहकांसाठी उपलब्ध व लाइव्ह कटिंग.",
    descEn: "Prime restaurant-grade deep-sea Yellowfin Tuna showcase across our regional counters.",
    category: "counter",
    viewsMr: "१२,०००+ व्ह्यूज",
    viewsEn: "12,000+ views",
    badgeMr: "स्पेशल ट्यूना",
    badgeEn: "Prime Tuna",
    youtubeId: "dTz0Ctolqio",
    isRealProfileMedia: true,
  },
  {
    id: "hotel-bulk-supply",
    type: "video",
    videoSrc: "/media/gallery/hotel-bulk-supply.mp4",
    thumbnailSrc: "/media/gallery/hotel-bulk-supply.webp",
    titleMr: "प्रसिद्ध हॉटेल्स व शेफसाठी अखंड घाऊक पुरवठा",
    titleEn: "Trusted Cold-Chain Supply for Top Hotels & Caterers",
    descMr: "पश्चिम महाराष्ट्रातील नामांकित रेस्टॉरंट्स आणि शेफचा AN Fish World वरील अढळ विश्वास.",
    descEn: "Institutional cold-chain wholesale supply for marquee dining destinations and elite chefs.",
    category: "community",
    viewsMr: "१३,००,०००+ व्ह्यूज",
    viewsEn: "1.3M+ views",
    badgeMr: "घाऊक पुरवठा",
    badgeEn: "Hotel Supply",
    youtubeId: "QkgLl1LtXWA",
    isRealProfileMedia: true,
  },
];
