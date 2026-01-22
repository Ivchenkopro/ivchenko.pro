import { ICON_MAP } from "@/lib/icons";

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-lg max-h-40 overflow-y-auto">
      {Object.entries(ICON_MAP).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`p-2 rounded-lg transition-colors ${
            value === name 
              ? "bg-black text-white" 
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
          title={name}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}
