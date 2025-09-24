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
            image: "/Images/Ray.jpg",
        },
    ]);

    const responseTime = calculateResponseTime(technicians);

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden text-black">
                <header className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-2xl">
                    <div className="flex flex-row justify-between items-center w-full">
                        {/* Left Logo */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28">
                            <Image src="/Images/Salt.svg" alt="Salt Logo" width={96} height={96} className="w-full h-full object-contain" />
                        </div>

                        {/* Right Logo */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28">
                            <Image src="/Images/fidelityitsolutionslogo.png" alt="Fidelity IT Solutions Logo" width={96} height={96} className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <div className="w-full text-center mt-4">
                        <h1 className="text-2xl sm:text-4xl font-bold mb-1">🛠️ IT Support Request</h1>
                        <p className="opacity-90 text-base sm:text-lg">We&apos;re here to help! Submit your request below.</p>
                    </div>
                </header>

                <section className="p-4 sm:p-6">
                    <TechnicianStatus technicians={technicians} responseTime={responseTime.time} status={responseTime.status} />

                    <SupportForm technicians={technicians} responseTime={responseTime} />
                </section>
            </div>
        </main>
    );
}
