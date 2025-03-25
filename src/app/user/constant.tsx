import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconList,
  IconCalculator,
  IconClipboardCheck,
  IconUser,
  IconInfoCircle,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Ingredient List",
    path: "/user/ingredient-list",
    icon: <IconList width="24" height="24" />,
  },
  {
    title: "Convert Measurements",
    path: "/user/convert-measurements",
    icon: <IconCalculator width="24" height="24" />,
  },
  {
    title: "Saved Conversions",
    path: "/user/saved-conversions",
    icon: <IconClipboardCheck width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: <IconUser width="24" height="24" />,
  },
  {
    title: "About",
    path: "/user/about",
    icon: <IconInfoCircle width="24" height="24" />,
  },
];
