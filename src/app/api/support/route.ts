import { NextRequest, NextResponse } from "next/server";
import { getAvailability, bookMeeting } from "@/utils/graph";
import type { AvailabilityResponse, ScheduleItem, SlotResult, BookingRequest } from "@/types";

const USE_MOCK = process.env.USE_MOCK === "true";
const TECHNICIANS = process.env.GRAPH_TECHNICIANS ? process.env.GRAPH_TECHNICIANS.split(",").map((e) => e.trim()) : [];

// Mock technician levels (for example purposes, this might come from config or DB)
const LEVEL_1_TECHS = TECHNICIANS.filter((email) => email.toLowerCase().includes("level1"));
const LEVEL_2_TECHS = TECHNICIANS.filter((email) => email.toLowerCase().includes("level2"));

// Categories that require Level 2 tech
const LEVEL_2_CATEGORIES = ["hardware", "network"];

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
}

function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function setToTime(date: Date, hours: number, minutes: number) {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}

function isWithinWorkHours(date: Date) {
    const hour = date.getHours();
    return hour >= 9 && hour < 17;
}

function findNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}

// Helper to check free slot with 10-minute buffer after existing events
function isFreeWithBuffer(scheduleItems: ScheduleItem[], start: Date, end: Date): boolean {
    return !scheduleItems.some((item) => {
        const itemStart = new Date(item.start.dateTime);
        const itemEnd = new Date(item.end.dateTime);
        const bufferedEnd = addMinutes(itemEnd, 10);
        return start < bufferedEnd && end > itemStart;
    });
}

async function getTechnicianAvailability(technicians: string[], startISO: string, endISO: string): Promise<AvailabilityResponse> {
    if (technicians.length === 0) return { value: [] };
    return await getAvailability(technicians, startISO, endISO);
}

async function findSlotForTechnician(technicianEmail: string, startWindow: Date, endWindow: Date, slotLengthMinutes: number, earliestStart: Date | null, priority: string) {
    // Get availability for technician
    const availability = await getAvailability([technicianEmail], startWindow.toISOString(), endWindow.toISOString());
    const scheduleItems = availability?.value?.[0]?.scheduleItems || [];

    let cursor = new Date(startWindow);
    if (earliestStart && cursor < earliestStart) {
        cursor = new Date(earliestStart);
    }
    const windowEnd = new Date(endWindow);

    while (cursor.getTime() + slotLengthMinutes * 60000 <= windowEnd.getTime()) {
        const testStart = new Date(cursor);
        const testEnd = addMinutes(testStart, slotLengthMinutes);

        if (priority === "high") {
            // For high priority, book immediately ignoring conflicts
            return { start: testStart, end: testEnd };
        } else {
            // For normal and low, check buffer and conflicts
            if (isFreeWithBuffer(scheduleItems, testStart, testEnd) && isWithinWorkHours(testStart) && isWithinWorkHours(addMinutes(testEnd, -1))) {
                return { start: testStart, end: testEnd };
            }
        }
        // Move cursor forward by 15 minutes
        cursor = addMinutes(cursor, 15);
    }
    return null;
}

async function findSlotWithFallback(techniciansLevel1: string[], techniciansLevel2: string[], category: string, now: Date, slotLengthMinutes: number, priority: string) {
    // Define workday start and end
    const workDayStart = setToTime(now, 9, 0);
    const workDayEnd = setToTime(now, 17, 0);

    // Define earliest start for low priority (12:30)
    const lowPriorityEarliest = setToTime(now, 12, 30);

    // Determine required level
    const requiresLevel2 = LEVEL_2_CATEGORIES.includes(category.toLowerCase());

    // Define earliest start based on priority
    let earliestStart: Date | null = null;
    if (priority === "low") {
        earliestStart = lowPriorityEarliest;
    } else if (priority === "normal") {
        earliestStart = workDayStart;
    } else if (priority === "high") {
        earliestStart = workDayStart; // any time, will ignore conflicts
    }

    // Search for today first
    let searchDate = now;
    for (let attempt = 0; attempt < 2; attempt++) {
        // today and tomorrow
        const dayStart = setToTime(searchDate, 9, 0);
        const dayEnd = setToTime(searchDate, 17, 0);

        let searchEarliestStart = earliestStart && isSameDay(earliestStart, searchDate) ? earliestStart : dayStart;
        if (priority === "low" && attempt === 1) {
            // For low priority rolling to tomorrow, earliest start is 12:30
            searchEarliestStart = setToTime(searchDate, 12, 30);
        }

        // Technician selection logic
        const techListPrimary: string[] = requiresLevel2 ? techniciansLevel2 : techniciansLevel1;
        const techListFallback: string[] = requiresLevel2 ? [] : techniciansLevel2;

        // Try primary techs
        for (const tech of techListPrimary) {
            const slot = await findSlotForTechnician(tech, dayStart, dayEnd, slotLengthMinutes, searchEarliestStart, priority);
            if (slot) {
                return { technicianEmail: tech, slotStart: slot.start, slotEnd: slot.end };
            }
        }
        // Try fallback techs
        for (const tech of techListFallback) {
            const slot = await findSlotForTechnician(tech, dayStart, dayEnd, slotLengthMinutes, searchEarliestStart, priority);
            if (slot) {
                return { technicianEmail: tech, slotStart: slot.start, slotEnd: slot.end };
            }
        }
        // Roll to next day
        searchDate = findNextDay(searchDate);
        earliestStart = null; // reset earliest start for next day iteration
    }
    return null;
}

export async function GET() {
    try {
        if (USE_MOCK) {
            // Return mock data
            return NextResponse.json([
                {
                    email: "mock.tech1@example.com",
                    name: "Mock Tech 1",
                    available: true,
                },
                {
                    email: "mock.tech2@example.com",
                    name: "Mock Tech 2",
                    available: false,
                },
            ]);
        }
        const emails = TECHNICIANS;
        const now = new Date();
        const end = new Date();
        end.setHours(now.getHours() + 4); // look ahead 4h

        const schedule = await getAvailability(emails, now.toISOString(), end.toISOString());

        return NextResponse.json(schedule.value);
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as BookingRequest;
        const { technicianEmail, subject, bodyContent, priority, category } = body;

        // Validate required fields
        if (!technicianEmail || !subject || !bodyContent || !priority || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // Validate technicianEmail is allowed
        if (!TECHNICIANS.includes(technicianEmail)) {
            return NextResponse.json({ error: "Technician not allowed" }, { status: 403 });
        }
        // Validate priority values
        const validPriorities = ["high", "normal", "low"];
        if (!validPriorities.includes(priority.toLowerCase())) {
            return NextResponse.json({ error: "Invalid priority value" }, { status: 400 });
        }
        const priorityLower = priority.toLowerCase();

        const slotLength = 15; // 15 minutes slot
        const bufferMinutes = 10; // 10 minutes buffer after events

        if (USE_MOCK) {
            // Return a mock response with chosen tech, slot, and priority included
            const mockSlotStart = "2025-09-25T10:00:00Z";
            const mockSlotEnd = "2025-09-25T10:15:00Z";
            return NextResponse.json({
                message: `Mock meeting booked with ${technicianEmail} at ${mockSlotStart} - ${mockSlotEnd} with priority ${priorityLower}`,
                technicianEmail,
                slotStart: mockSlotStart,
                slotEnd: mockSlotEnd,
                priority: priorityLower,
                category,
            });
        }

        // Business rules:
        // Work hours 9–5, low priority earliest start 12:30
        // Priority logic:
        // High: book immediately ignoring conflicts
        // Normal: search next free slot today within 9–5 with buffer
        // Low: search free slot today from 12:30 onward with buffer, else roll to tomorrow 12:30

        // Technician assignment logic:
        // Prefer Level 1 tech unless category demands Level 2
        // If Level 1 unavailable, fallback to Level 2

        // Use findSlotWithFallback to get slot and technician
        const now = new Date();
        const result = await findSlotWithFallback(LEVEL_1_TECHS, LEVEL_2_TECHS, category, now, slotLength, priorityLower);

        if (!result) {
            return NextResponse.json({ error: "No available slot found within scheduling rules" }, { status: 409 });
        }

        if (USE_MOCK) {
            // Return mock booking confirmation object
            return NextResponse.json({
                technicianEmail: result.technicianEmail,
                subject,
                start: result.slotStart.toISOString(),
                end: result.slotEnd.toISOString(),
                priority: priorityLower,
                category,
                mock: true,
            });
        }

        // Book the meeting at the found slot with the chosen technician
        const bookingResult = await bookMeeting({
            technicianEmail: result.technicianEmail,
            subject,
            start: result.slotStart.toISOString(),
            end: result.slotEnd.toISOString(),
            bodyContent,
            priority: priorityLower as "high" | "normal" | "low",
            category,
        });

        return NextResponse.json(bookingResult);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to book meeting" }, { status: 500 });
    }
}
