"use client";

import Image from "next/image";
import { TechnicianStatusProps } from "@/types";

export function TechnicianStatus({ technicians, responseTime, status }: TechnicianStatusProps) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 rounded-2xl shadow-xl border border-gray-200 my-6 mx-5">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          📅 Technician Availability
        </h3>

        <div className="flex flex-col gap-3">
          {technicians.map((tech, index) => (
            <div
              key={index}
              className={`flex flex-row items-center justify-start p-2 rounded-xl border ${
                tech.available ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="w-16 h-16 overflow-hidden border-2 border-gray-300 shadow-md mr-3 flex-shrink-0 rounded-lg">
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
              <div className="flex flex-col">
                <strong className="text-base">{tech.name}</strong>
                <p className="text-xs text-gray-700">{tech.currentStatus}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <span className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-blue-800 font-medium">
            ⏱ Estimated Wait: {responseTime}
          </span>
        </div>
      </div>
    );
}
