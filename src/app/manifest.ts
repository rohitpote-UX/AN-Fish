import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AN Fish World — कराडची लाडकी मासोळी",
    short_name: "AN Fish World",
    description: "Karad's trusted fresh fish retail brand. 4:00 AM coastal dock harvest, 0°C cold chain.",
    start_url: "/mr",
    display: "standalone",
    background_color: "#05080C",
    theme_color: "#0A9AD9",
    icons: [
      {
        src: "/brand/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
