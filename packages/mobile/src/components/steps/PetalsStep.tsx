/**
 * Petal count adjustment step
 */

import { motion } from 'framer-motion';
import { PETAL_COUNT_RANGE } from '@wallflower/shared';

interface Props {
  count: number;
  onChange: (count: number) => void;
}

export function PetalsStep({ count, onChange }: Props) {
  const { min, max } = PETAL_COUNT_RANGE;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Adjust Petals</h2>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <div className="text-6xl font-bold text-primary-600">{count}</div>
        <div className="text-gray-600">petals</div>

        <div className="w-full px-4">
          <input
            type="range"
            min={min}
            max={max}
            value={count}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="flex justify-between w-full px-4 text-sm text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
