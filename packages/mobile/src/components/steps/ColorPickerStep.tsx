/**
 * Color picker step
 */

import { motion } from 'framer-motion';
import { PRESET_COLORS } from '@wallflower/shared';
import type { FlowerColor } from '@wallflower/shared';

interface Props {
  selected: FlowerColor;
  onSelect: (color: FlowerColor) => void;
}

export function ColorPickerStep({ selected, onSelect }: Props) {
  const isSelected = (color: FlowerColor) =>
    color.r === selected.r && color.g === selected.g && color.b === selected.b;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Pick a Color</h2>

      <div className="grid grid-cols-5 gap-4 w-full max-w-lg">
        {PRESET_COLORS.map(({ name, color }) => (
          <motion.button
            key={name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(color)}
            className={`
              w-16 h-16 rounded-full transition-all
              ${isSelected(color) ? 'ring-4 ring-primary-500 ring-offset-2' : ''}
            `}
            style={{
              backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            title={name}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 mt-4">
        <div
          className="w-24 h-24 rounded-2xl shadow-lg"
          style={{
            backgroundColor: `rgb(${selected.r}, ${selected.g}, ${selected.b})`,
          }}
        />
        <div className="text-sm text-gray-600">
          RGB: {selected.r}, {selected.g}, {selected.b}
        </div>
      </div>
    </div>
  );
}
