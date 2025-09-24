import { Technician } from "@/types";

export const calculateResponseTime = (technicians: Technician[]) => {
    const availableTechs = technicians.filter((tech) => tech.available);

    if (availableTechs.length === 0) {
        return { time: "45-60 minutes", status: "busy" as const };
    } else if (availableTechs.length === 1) {
        return { time: "20-35 minutes", status: "limited" as const };
    } else {
        return { time: "15-30 minutes", status: "available" as const };
    }
};
