export interface Technician {
    name: string;
    email: string;
    available: boolean;
    nextMeeting: string | null;
    currentStatus: string;
    image?: string; // optional profile picture
}

export interface TechnicianStatusProps {
    technicians: Technician[];
    responseTime: string;
    status: "available" | "busy" | "limited";
}

export interface FormFields {
    location: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    priority: "low" | "normal" | "high";
    serviceLocation: "come-to-me" | "bring-to-tech";
    description: string;
}

export interface TicketData extends FormFields {
    timestamp: string;
    assignedTech?: Technician;
}

export interface AutotaskTicket {
    id: string;
    ticketNumber: string;
    error?: string;
}
