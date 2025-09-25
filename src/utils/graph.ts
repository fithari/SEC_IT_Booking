const USE_MOCK = process.env.USE_MOCK === "true";
import "cross-fetch/polyfill";
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import type { AvailabilityResponse, BookingRequest, EventResponse, Schedule } from "@/types";

let _client: Client | null = null;

function getClient() {
    if (_client) return _client;

    const tenantId = process.env.AZURE_TENANT_ID!;
    const clientId = process.env.AZURE_CLIENT_ID!;
    const clientSecret = process.env.AZURE_CLIENT_SECRET!;

    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ["https://graph.microsoft.com/.default"],
    });

    _client = Client.initWithMiddleware({ authProvider });
    return _client;
}

export async function getAvailability(technicians: string[], startTime: string, endTime: string): Promise<AvailabilityResponse> {
    if (USE_MOCK) {
        const mockSchedules: Schedule[] = technicians.map((email, idx) => ({
            scheduleId: email,
            availabilityView: idx === 0 ? "000000000000000000000000" : "111111000000000000000000",
            scheduleItems: idx === 0 ? [] : [
                {
                    start: { dateTime: startTime },
                    end: { dateTime: new Date(new Date(startTime).setHours(14, 30, 0, 0)).toISOString() },
                    subject: "Meeting",
                    status: "busy"
                }
            ]
        }));
        return { value: mockSchedules, mock: true };
    }

    const client = getClient();
    const response = await client.api("/me/calendar/getSchedule").post({
        schedules: technicians,
        startTime: { dateTime: startTime, timeZone: "UTC" },
        endTime: { dateTime: endTime, timeZone: "UTC" },
        availabilityViewInterval: 30,
    });
    return response as AvailabilityResponse;
}

export async function bookMeeting(request: BookingRequest): Promise<EventResponse> {
    if (USE_MOCK) {
        return {
            id: "mock-id",
            subject: request.subject,
            start: { dateTime: request.start, timeZone: "UTC" },
            end: { dateTime: request.end, timeZone: "UTC" },
            body: { contentType: "Text", content: "Booked via IT Support app" }
        };
    }

    const client = getClient();
    const response = await client.api(`/users/${request.technicianEmail}/events`).post({
        subject: request.subject,
        start: { dateTime: request.start, timeZone: "UTC" },
        end: { dateTime: request.end, timeZone: "UTC" },
        body: { contentType: "Text", content: request.bodyContent },
    });
    return response as EventResponse;
}
