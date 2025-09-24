"use client";

import { useState } from "react";
import { LocationSelector } from "./LocationSelector";
import { PrioritySelector } from "./PrioritySelector";
import { SuccessMessage } from "./SuccessMessage";
import { FormFields, Technician } from "@/types";

interface SupportFormProps {
    technicians: Technician[];
    responseTime: {
        time: string;
        status: "available" | "busy" | "limited";
    };
}

interface TicketResponse {
    ticketNumber: string;
    success: boolean;
    error?: string;
}

export function SupportForm({ technicians, responseTime }: SupportFormProps) {
    const [formData, setFormData] = useState<FormFields>({
        location: "",
        name: "",
        email: "",
        phone: "",
        category: "",
        priority: "normal",
        serviceLocation: "come-to-me",
        description: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ticketNumber, setTicketNumber] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/submit-ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit ticket");
            }

            const data: TicketResponse = await response.json();
            if (data.success) {
                setTicketNumber(data.ticketNumber);
                setIsSuccess(true);
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
            alert("Failed to submit ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    if (isSuccess) {
        return <SuccessMessage ticketNumber={ticketNumber} responseTime={responseTime.time} />;
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-black">
            <div className="space-y-4">
                {/* Move LocationSelector and PrioritySelector to the top */}
                <LocationSelector value={formData.serviceLocation} onChange={(value) => setFormData((prev) => ({ ...prev, serviceLocation: value }))} />
                <PrioritySelector value={formData.priority} onChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Conditionally render location input only when 'come-to-me' is selected */}
                    {formData.serviceLocation === "come-to-me" && (
                        <div className="form-group">
                            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                            Phone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="form-group w-full">
                    <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
                        Issue Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
                        required
                    >
                        <option value="">Select a category...</option>
                        <option value="computer">Computer/Laptop Issues</option>
                        <option value="printer">Printer Problems</option>
                        <option value="network">Network/Internet</option>
                        <option value="software">Software Issues</option>
                        <option value="email">Email Problems</option>
                        <option value="hardware">Hardware Request</option>
                        <option value="other">Other</option>
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                        placeholder="Please provide as much detail as possible about the issue..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-md 
                             hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        "Submit Support Request"
                    )}
                </button>
            </div>
        </form>
    );
}
