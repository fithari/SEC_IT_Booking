interface SuccessMessageProps {
    ticketNumber: string;
    responseTime: string;
}

export function SuccessMessage({ ticketNumber, responseTime }: SuccessMessageProps) {
    return (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center space-y-4">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800">Request Submitted Successfully!</h3>
                <div className="space-y-2 text-green-700">
                    <p>
                        Your ticket number is <strong>#{ticketNumber}</strong>
                    </p>
                    <p>
                        Estimated response time: <strong>{responseTime}</strong>
                    </p>
                </div>
                <p className="text-sm text-green-600 mt-4">You&apos;ll receive a confirmation email shortly with these details.</p>
            </div>
        </div>
    );
}
