/**
 * Flower type selection step
 */

import { motion } from 'framer-motion';
import { FLOWER_TYPES, FLOWER_DISPLAY_NAMES } from '@wallflower/shared';
import type { FlowerType } from '@wallflower/shared';

interface Props {
  selected: FlowerType;
  onSelect: (type: FlowerType) => void;
}

export function FlowerTypeStep({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Choose Your Flower</h2>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {FLOWER_TYPES.map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(type)}
            className={`
              p-6 rounded-2xl border-2 transition-all
              ${selected === type
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-primary-300'
              }
            `}
          >
            <div className="text-4xl mb-2">🌸</div>
            <div className="font-semibold text-gray-800">
              {FLOWER_DISPLAY_NAMES[type]}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
