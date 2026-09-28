import type { ReactNode } from "react";
import type { TrustIcon } from "@/lib/theme";
import {
  FaStar,
  FiClock,
  FiCreditCard,
  FiHeadphones,
  FiRepeat,
  FiShield,
  FiSmartphone,
  FiTag,
  FiTruck,
  FiZap,
} from "./icons";

/** A trust-bar icon key → its icon, at the given size (shared by every template's trust bar). */
export function trustIcon(key: TrustIcon, size: number): ReactNode {
  switch (key) {
    case "truck":
      return <FiTruck size={size} />;
    case "shield":
      return <FiShield size={size} />;
    case "phone":
      return <FiSmartphone size={size} />;
    case "returns":
      return <FiRepeat size={size} />;
    case "card":
      return <FiCreditCard size={size} />;
    case "clock":
      return <FiClock size={size} />;
    case "support":
      return <FiHeadphones size={size} />;
    case "tag":
      return <FiTag size={size} />;
    case "zap":
      return <FiZap size={size} />;
    case "star":
      return <FaStar size={size} />;
  }
}
