/**
 * Leaf style selection step
 */

import { motion } from 'framer-motion';
import { LEAF_STYLES, LEAF_DISPLAY_NAMES } from '@wallflower/shared';
import type { LeafStyle } from '@wallflower/shared';

interface Props {
  selected: LeafStyle;
  onSelect: (leaves: LeafStyle) => void;
}

const LEAF_ICONS: Record<LeafStyle, string> = {
  simple: '🌿',
  compound: '🍃',
  minimal: '🌱',
};

export function LeavesStep({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Choose Leaf Style</h2>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {LEAF_STYLES.map((style) => (
          <motion.button
            key={style}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(style)}
            className={`
              p-6 rounded-2xl border-2 transition-all flex items-center gap-4
              ${selected === style
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-primary-300'
              }
            `}
          >
            <div className="text-4xl">{LEAF_ICONS[style]}</div>
            <div className="font-semibold text-lg text-gray-800">
              {LEAF_DISPLAY_NAMES[style]}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
