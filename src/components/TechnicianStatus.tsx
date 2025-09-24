"use client";

import Image from "next/image";
import { TechnicianStatusProps } from "@/types";

export function TechnicianStatus({ technicians, responseTime, status }: TechnicianStatusProps) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 rounded-2xl shadow-xl border border-gray-200 my-6 mx-5">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          📅 Technician Availability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technicians.map((tech, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md hover:shadow-xl transition ${
                tech.available ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                {tech.image ? (
                  <Image
                    src={tech.image}
                    alt={tech.name}
                    width={64}
                    height={64}
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-lg">
                    {tech.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      tech.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <strong className="text-base">{tech.name}</strong>
                </div>
                <p className="text-xs text-gray-700">{tech.currentStatus}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-5 rounded-xl shadow-inner text-center">
          <strong className="text-gray-900">Estimated Response Time:</strong>{" "}
          <span className="text-gray-700">{responseTime}</span>
        </div>
      </div>
    );
}
