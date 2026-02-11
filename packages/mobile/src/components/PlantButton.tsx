/**
 * Plant flower button
 */

import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PlantButton({ onClick, disabled, loading }: Props) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-12 py-4 rounded-full font-bold text-lg shadow-xl
        transition-all
        ${disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-primary-500 text-white hover:bg-primary-600'
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Planting...
        </span>
      ) : (
        '🌱 Plant Flower'
      )}
    </motion.button>
  );
}
