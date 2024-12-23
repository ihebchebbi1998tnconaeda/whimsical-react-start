import React from 'react';
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  selectedColor: string;
  colors: Record<string, string>;
  onColorSelect: (color: string) => void;
}

const ColorSelector = ({ selectedColor, colors, onColorSelect }: ColorSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">Couleur: {selectedColor}</span>
        <span className="text-xs text-gray-500">6 couleurs disponibles</span>
      </div>
      <div className="flex gap-1.5">
        {Object.entries(colors).map(([colorName, colorCode]) => (
          <button
            key={colorName}
            onClick={() => onColorSelect(colorName)}
            className={cn(
              "w-7 h-7 rounded-full transition-all duration-200 hover:scale-110",
              selectedColor === colorName ? 'ring-2 ring-[#700100] ring-offset-2' : 'ring-1 ring-gray-200'
            )}
            style={{ backgroundColor: colorCode }}
            title={colorName}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;