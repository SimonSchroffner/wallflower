/**
 * Arrow navigation buttons
 */

import { motion } from 'framer-motion';

interface Props {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  hideNext?: boolean;
}

export function ArrowNavigation({ onBack, onNext, canGoBack, canGoNext, hideNext }: Props) {
  return (
    <div className="flex justify-between items-center w-full max-w-md px-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        disabled={!canGoBack}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all shadow-lg
          ${canGoBack
            ? 'bg-white text-gray-700 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }
        `}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {!hideNext && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center
            transition-all shadow-lg
            ${canGoNext
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
