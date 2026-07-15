/**
 * FIFACoOS — Stadium FAQ Data
 *
 * Deterministic knowledge base of frequently asked questions.
 * These are injected into the AI context for grounded responses.
 * Keyword matching enables fallback without AI.
 *
 * @see TECHNOLOGY_DECISIONS.md §5.8 — Deterministic Retrieval
 * @see DATABASE_SCHEMA.md §7 — knowledge_articles table
 */

import type { KnowledgeArticle } from "../types/fan.types";

export const FAQS: KnowledgeArticle[] = [
  // -----------------------------------------------------------------------
  // General
  // -----------------------------------------------------------------------
  {
    id: "faq-gates-open",
    question: "What time do the gates open?",
    answer:
      "Gates open at 14:00 (2:00 PM), four hours before kickoff at 18:00 (6:00 PM). We recommend arriving early to avoid long queues at security checkpoints.",
    category: "general",
    keywords: ["gates", "open", "time", "when", "entry", "arrive", "hours"],
  },
  {
    id: "faq-stadium-capacity",
    question: "What is the stadium capacity?",
    answer:
      "FIFA World Cup Stadium Alpha has a capacity of 72,000 spectators across 7 zones including the North and South Concourses, East and West Stands, VIP & Hospitality, and Field Level seating.",
    category: "general",
    keywords: ["capacity", "seats", "how many", "size", "spectators"],
  },
  {
    id: "faq-reentry",
    question: "Can I leave the stadium and come back in?",
    answer:
      "Re-entry is not permitted once you exit the stadium. If you need to leave for a medical or emergency reason, please visit an Information Desk for assistance.",
    category: "general",
    keywords: ["reentry", "re-entry", "leave", "come back", "exit", "return"],
  },

  // -----------------------------------------------------------------------
  // Gates & Entry
  // -----------------------------------------------------------------------
  {
    id: "faq-which-gate",
    question: "Which gate should I use?",
    answer:
      "Your ticket indicates a recommended gate. Gates A and B serve the North Concourse, Gates E and F serve the South Concourse. Gate C is for the East Stand (stairs only). Gate D is the VIP and accessible entrance. All gates except C and F have accessible ramps.",
    category: "gates",
    keywords: ["gate", "entrance", "entry", "which", "enter", "door"],
  },
  {
    id: "faq-security-screening",
    question: "What does security screening involve?",
    answer:
      "All attendees pass through metal detectors and bag checks. Clear bags (12x6x12 inches max) are recommended. Small clutch bags (4.5x6.5 inches) are allowed. Expect 15-30 minutes during peak entry times.",
    category: "security",
    keywords: ["security", "screening", "metal detector", "bag check", "search"],
  },

  // -----------------------------------------------------------------------
  // Food & Drinks
  // -----------------------------------------------------------------------
  {
    id: "faq-food-options",
    question: "What food options are available?",
    answer:
      "The North Food Court offers burgers, pizza, tacos, sushi, salads, ice cream, BBQ, and vegetarian options. The International Food Village in the South Concourse has Indian, Middle Eastern, Mexican, and Asian fusion with halal and kosher options. VIP ticket holders have access to premium dining.",
    category: "food",
    keywords: [
      "food",
      "eat",
      "restaurant",
      "concession",
      "hungry",
      "snack",
      "menu",
      "halal",
      "kosher",
      "vegetarian",
      "vegan",
    ],
  },
  {
    id: "faq-water",
    question: "Can I bring water into the stadium?",
    answer:
      "You may bring one factory-sealed water bottle (500ml max) per person. Empty reusable bottles are also permitted and can be refilled at water stations located near all restroom blocks. No outside food or other beverages are allowed.",
    category: "food",
    keywords: ["water", "bottle", "drink", "bring", "outside", "refill"],
  },
  {
    id: "faq-alcohol",
    question: "Is alcohol available at the stadium?",
    answer:
      "Beer and wine are available at designated concession stands in the North and South Concourses. Alcohol sales stop at the 75th minute. You must be 21 or older with valid ID. VIP areas have full bar service.",
    category: "food",
    keywords: ["alcohol", "beer", "wine", "drink", "bar", "age"],
  },

  // -----------------------------------------------------------------------
  // Accessibility
  // -----------------------------------------------------------------------
  {
    id: "faq-wheelchair",
    question: "Is the stadium wheelchair accessible?",
    answer:
      "Yes. Gates A, B, D, and E have accessible ramps. Accessible seating is available in all zones on Level 1 with companion seats. The North Information Desk offers complimentary wheelchair loans on a first-come basis. Accessible restrooms are available at North Restroom Block A and South Restroom Block E.",
    category: "accessibility",
    keywords: [
      "wheelchair",
      "accessible",
      "disability",
      "ramp",
      "elevator",
      "mobility",
      "handicap",
    ],
  },
  {
    id: "faq-hearing-impaired",
    question: "What services are available for hearing-impaired guests?",
    answer:
      "Assistive listening devices are available at both Information Desks. Match commentary is streamed with live captions via the official FIFA app. Sign language interpreters are stationed at the North Information Desk during peak hours.",
    category: "accessibility",
    keywords: ["hearing", "deaf", "listening", "caption", "sign language", "impaired"],
  },

  // -----------------------------------------------------------------------
  // Medical
  // -----------------------------------------------------------------------
  {
    id: "faq-medical-emergency",
    question: "What do I do in a medical emergency?",
    answer:
      "Call 911 or alert the nearest staff member or volunteer. The North Medical Station (near Gate A) is staffed by paramedics with AED equipment. A South First Aid Post is near Gate E for minor injuries. Medical staff can be identified by red vests.",
    category: "medical",
    keywords: [
      "medical",
      "emergency",
      "hurt",
      "injured",
      "sick",
      "doctor",
      "paramedic",
      "first aid",
      "health",
      "ambulance",
    ],
  },
  {
    id: "faq-lost-child",
    question: "What if my child gets lost?",
    answer:
      "Go immediately to the nearest Information Desk (North or South). All lost children are escorted to the North Information Desk by security staff. We recommend writing your phone number on your child's wristband before entry. The Family Zone also has wristband stations.",
    category: "general",
    keywords: ["lost", "child", "kid", "children", "missing", "found"],
  },

  // -----------------------------------------------------------------------
  // Parking & Transportation
  // -----------------------------------------------------------------------
  {
    id: "faq-parking",
    question: "Where can I park?",
    answer:
      "Three parking lots are available: Lot 1 (North, near Gate A, 5,000 spaces, $30 pre-paid/$40 day-of), Lot 2 (East, 3,000 spaces, 15-min walk to Gate C), and Lot 3 (South, near Gate E, accessible parking available). Pre-paid parking is strongly recommended.",
    category: "parking",
    keywords: ["parking", "park", "car", "lot", "drive", "vehicle", "cost"],
  },
  {
    id: "faq-public-transit",
    question: "How do I get to the stadium by public transit?",
    answer:
      "A free shuttle service runs from Houston Metro stations every 10 minutes starting at 12:00. The shuttle drops off at the South Transit Hub near Gate E. Rideshare drop-off is at Lot 1 (North). After the match, shuttles run until 2 hours post-final whistle.",
    category: "transport",
    keywords: [
      "transit",
      "bus",
      "shuttle",
      "train",
      "metro",
      "uber",
      "lyft",
      "rideshare",
      "taxi",
      "transport",
      "get to",
    ],
  },

  // -----------------------------------------------------------------------
  // Prohibited Items
  // -----------------------------------------------------------------------
  {
    id: "faq-prohibited",
    question: "What items are prohibited in the stadium?",
    answer:
      "Prohibited items include: weapons of any kind, fireworks/flares, laser pointers, drones, large umbrellas, professional cameras (lenses > 200mm), outside food and beverages (except one sealed 500ml water bottle), flags larger than 2x1.5 meters, noisemakers (air horns, vuvuzelas), and any items deemed dangerous by security.",
    category: "prohibited_items",
    keywords: [
      "prohibited",
      "banned",
      "not allowed",
      "bring",
      "items",
      "weapons",
      "camera",
      "flag",
      "umbrella",
      "drone",
      "fireworks",
    ],
  },

  // -----------------------------------------------------------------------
  // Weather
  // -----------------------------------------------------------------------
  {
    id: "faq-weather",
    question: "What happens if it rains?",
    answer:
      "The stadium has a partial retractable roof covering 60% of seating. Covered areas include all concourse levels and the West Stand. Ponchos are sold at merchandise stands. Large umbrellas are not permitted but compact umbrellas are allowed. In severe weather, announcements will be made via the PA system and digital displays.",
    category: "weather",
    keywords: ["rain", "weather", "roof", "cover", "umbrella", "storm", "hot", "sun"],
  },

  // -----------------------------------------------------------------------
  // Ticketing
  // -----------------------------------------------------------------------
  {
    id: "faq-ticket-issue",
    question: "My ticket is not scanning. What do I do?",
    answer:
      "Visit the nearest Information Desk with your confirmation email or ID. Staff can verify your booking and issue a replacement. Ensure your phone brightness is at maximum when scanning QR codes. Screenshots of tickets are not accepted — use the official FIFA app.",
    category: "ticketing",
    keywords: ["ticket", "scan", "not working", "QR", "code", "app", "booking"],
  },

  // -----------------------------------------------------------------------
  // Miscellaneous
  // -----------------------------------------------------------------------
  {
    id: "faq-wifi",
    question: "Is there free Wi-Fi?",
    answer:
      "Yes, complimentary Wi-Fi is available throughout the stadium. Connect to 'FIFA_WC2026_Guest'. No password required. Bandwidth may be limited during peak usage. For best experience, use the official FIFA app which is optimized for low bandwidth.",
    category: "general",
    keywords: ["wifi", "wi-fi", "internet", "connect", "network", "data"],
  },
  {
    id: "faq-smoking",
    question: "Is smoking allowed?",
    answer:
      "Smoking, including e-cigarettes and vaping, is strictly prohibited throughout the stadium interior. Designated smoking areas are located in the Exterior zone near each parking lot entrance.",
    category: "general",
    keywords: ["smoke", "smoking", "cigarette", "vape", "vaping", "e-cigarette"],
  },
  {
    id: "faq-lost-found",
    question: "Where is lost and found?",
    answer:
      "Lost and found is managed at the North Information Desk during the event and for 48 hours after. Report lost items to any staff member or volunteer. Valuable items (phones, wallets, passports) are securely stored and require ID for retrieval.",
    category: "general",
    keywords: ["lost", "found", "missing", "forgot", "left", "property"],
  },
];
