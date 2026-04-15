import { RegionCode, UsageType } from "@/generated/prisma/enums";

export const iphoneSteps = [
  "Open Settings > Cellular > Add eSIM.",
  "Scan the QR code from this order or enter the activation code manually.",
  "Label the new line as Travel or esimQ.",
  "Enable Data Roaming for the eSIM once you arrive.",
];

export const androidSteps = [
  "Open Settings > Network & Internet > SIMs or Mobile Network.",
  "Tap Add eSIM and scan the QR code.",
  "If needed, choose Enter activation code manually and paste the LPA code.",
  "Set the esimQ line as your mobile data SIM and enable roaming when you land.",
];

export const troubleshootingTips = [
  "Make sure your device is eSIM compatible and carrier unlocked.",
  "If the QR code does not scan, use the manual activation code instead.",
  "Toggle airplane mode once after arriving to force network registration.",
  "If the line is installed but data does not work, confirm roaming is enabled for the eSIM.",
];

export const commonFaqs = [
  {
    question: "When should I install the eSIM?",
    answer: "Install it before departure, then switch it on once you arrive so setup is frictionless.",
  },
  {
    question: "Does eSIM replace my SIM card?",
    answer: "No. Most dual-SIM devices let you keep your physical SIM for calls and use the eSIM for data.",
  },
  {
    question: "What happens if I run out of data?",
    answer: "You can purchase another plan and install it alongside the existing one if your device allows multiple eSIM profiles.",
  },
  {
    question: "Can I use hotspot?",
    answer: "Yes, unless the network restricts it. Heavier plans are the best fit for hotspot usage.",
  },
];

export const usageLabels: Record<
  UsageType,
  { title: string; description: string }
> = {
  [UsageType.LIGHT]: {
    title: "Light usage",
    description: "Maps, messaging, ride-hailing and email.",
  },
  [UsageType.STANDARD]: {
    title: "Standard usage",
    description: "Social media, navigation, cloud sync and regular browsing.",
  },
  [UsageType.HEAVY]: {
    title: "Heavy usage",
    description: "Hotspot sessions, video and large uploads while traveling.",
  },
};

export const regionLabels: Record<RegionCode, string> = {
  [RegionCode.EUROPE]: "Europe",
  [RegionCode.ASIA]: "Asia",
  [RegionCode.MIDDLE_EAST]: "Middle East",
  [RegionCode.GLOBAL]: "Global",
  [RegionCode.NORTH_AMERICA]: "North America",
  [RegionCode.SOUTH_AMERICA]: "South America",
  [RegionCode.AFRICA]: "Africa",
  [RegionCode.OCEANIA]: "Oceania",
};

export const affiliateLandingPages = {
  nomadlist: {
    title: "esimQ for remote teams",
    subtitle: "Reliable travel data for founders, operators and distributed teams.",
    affiliateCode: "NOMADLIST",
  },
  creatorclub: {
    title: "esimQ for creators on the move",
    subtitle: "Fast setup, flexible plans and instant delivery for content trips.",
    affiliateCode: "CREATORCLUB",
  },
} as const;
