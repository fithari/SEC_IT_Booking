"use client";

import { useState } from "react";
import { Technician } from "@/types";
import { TechnicianStatus } from "@/components/TechnicianStatus";
import { SupportForm } from "@/components/SupportForm";
import { calculateResponseTime } from "@/utils/support";
import Image from "next/image";

export default function Home() {
    const [technicians] = useState<Technician[]>([
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
            image: "/Images/ray.jpg",
        },
    ]);

    const responseTime = calculateResponseTime(technicians);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-5">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden text-black">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-8 flex items-center justify-between">
                    {/* Left Logo */}
                    <div className="w-24 h-24">
                        <Image src="/Images/Salt.svg" alt="Left Logo" width={96} height={96} className="w-full h-full object-contain" />
                    </div>

                    {/* Center Content */}
                    <div className="text-center flex-1">
                        <h1 className="text-3xl font-bold mb-1">🛠️ IT Support Request</h1>
                        <p className="opacity-90">We&apos;re here to help! Submit your request below.</p>
                    </div>

                    {/* Right Logo */}
                    <div className="w-24 h-24">
                        <Image src="/Images/fidelityitsolutionslogo.png" alt="Right Logo" width={96} height={96} className="w-full h-full object-contain" />
                    </div>
                </div>

                <TechnicianStatus technicians={technicians} responseTime={responseTime.time} status={responseTime.status} />

                <SupportForm technicians={technicians} responseTime={responseTime} />
            </div>
        </div>
    );
}
