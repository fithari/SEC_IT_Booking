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

export interface ScheduleItem {
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    subject?: string;
    status?: string;
}

export interface Schedule {
    scheduleId: string;
    availabilityView: string;
    scheduleItems: ScheduleItem[];
}

export interface AvailabilityResponse {
    value: Schedule[];
    mock?: boolean;
}

export interface EventResponse {
    id: string;
    subject: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    body?: { contentType: string; content: string };
}

export interface BookingRequest {
    technicianEmail: string;
    subject: string;
    start: string;
    end: string;
    bodyContent: string;
    priority: "high" | "normal" | "low";
    category: string;
}

export interface SlotResult {
    technicianEmail: string;
    slotStart: Date;
    slotEnd: Date;
}
