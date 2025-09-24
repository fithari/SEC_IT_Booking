type PriorityType = "low" | "normal" | "high";

interface PrioritySelectorProps {
    value: PriorityType;
    onChange: (value: PriorityType) => void;
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
    const priorities = [
        { id: "low" as const, label: "Low", desc: "Can wait", color: "gray" },
        { id: "normal" as const, label: "Normal", desc: "Standard", color: "blue" },
        { id: "high" as const, label: "High", desc: "Urgent", color: "red" },
    ];

    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priorities.map((priority) => (
                    <div
                        key={priority.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                            value === priority.id ? `border-${priority.color}-500 bg-${priority.color}-50` : "border-gray-200 hover:border-blue-200"
                        }`}
                        onClick={() => onChange(priority.id)}
                    >
                        <p className="font-semibold">{priority.label}</p>
                        <p className="text-sm text-gray-600">{priority.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
