import { Book } from "@/generated/prisma/client";
import {
  LucideProps,
  Clock,
  CheckCircle2,
  Bookmark,
  CalendarMinus,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const statusConfig: Record<
  Book["status"],
  {
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    label: string;
    color: string;
    iconColor: string;
  }
> = {
  READING: {
    icon: Clock,
    label: "Читаю",
    color: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-600",
  },
  COMPLETED: {
    icon: CheckCircle2,
    label: "Прочитано",
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-600",
  },
  PLANNED: {
    icon: Bookmark,
    label: "В планах",
    color: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-600",
  },
  DROPPED: {
    icon: CalendarMinus,
    label: "Брошено",
    color: "bg-red-100 text-red-700",
    iconColor: "text-red-600",
  },
};
