type LocationType = "come-to-me" | "bring-to-tech";

interface LocationSelectorProps {
    value: LocationType;
    onChange: (value: LocationType) => void;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Location Preference</label>
            <div className="flex flex-wrap justify-between gap-4">
                <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all max-w-full w-full text-center ${value === "come-to-me" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
                    onClick={() => onChange("come-to-me")}
                >
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">🏃‍♂️➡️</span>
                        <div>
                            <p className="font-semibold">Come to Me</p>
                            <p className="text-sm text-gray-600">Tech comes to your location</p>
                        </div>
                    </div>
                </div>

                <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all max-w-full w-full text-center ${value === "bring-to-tech" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
                    onClick={() => onChange("bring-to-tech")}
                >
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">🏃‍♀️⬅️</span>
                        <div>
                            <p className="font-semibold">I&apos;ll Come to You</p>
                            <p className="text-sm text-gray-600">Bring device to IT area</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
