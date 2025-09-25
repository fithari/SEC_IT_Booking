import { NextResponse } from "next/server";
import type { Technician } from "@/types";

export async function GET() {
    const technicians: Technician[] = [
        {
            name: "Lauren Chu",
            email: "lauren.chu@fidelityit.com",
            available: true,
            nextMeeting: "2024-01-15T15:00:00",
            currentStatus: "Available until 3:00 PM",
            image: "/Images/Lauren.jpg",
        },
        {
            name: "Ray Akhunzada",
            email: "ray.akhunzada@fidelityit.com",
            available: false,
            nextMeeting: "2024-01-15T14:30:00",
            currentStatus: "In meeting until 2:30 PM",
            image: "/Images/Ray.jpg",
        },
    ];

    return NextResponse.json(technicians);
}
