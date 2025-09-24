type PriorityType = "low" | "normal" | "high";

interface PrioritySelectorProps {
    value: PriorityType;
    onChange: (value: PriorityType) => void;
}

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
    const priorities = [
        { id: "low" as const, label: "Low", desc: "Can wait", color: "var(--priority-low)", bgColor: "#f0fdf4" },
        { id: "normal" as const, label: "Normal", desc: "Standard", color: "var(--priority-normal)", bgColor: "#fffbeb" },
        { id: "high" as const, label: "High", desc: "Urgent", color: "var(--priority-high)", bgColor: "#fef2f2" },
    ];

    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div className="flex flex-wrap gap-3 justify-between">
                {priorities.map((priority) => (
                    <div
                        key={priority.id}
                        className={`cursor-pointer rounded-md px-3 py-2 text-center flex-1 min-w-[90px] transition-all border-2 border-white shadow-sm`}
                        style={
                            value === priority.id
                                ? { borderColor: priority.color, backgroundColor: priority.bgColor, boxShadow: `0 0 0 3px ${priority.color}40` }
                                : {}
                        }
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
