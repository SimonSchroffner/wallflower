/**
 * Final confirmation step
 */

import { motion } from 'framer-motion';
import type { FlowerCustomization } from '@wallflower/shared';
import { FLOWER_DISPLAY_NAMES, LEAF_DISPLAY_NAMES } from '@wallflower/shared';

interface Props {
  customization: FlowerCustomization;
}

export function ConfirmStep({ customization }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Your Flower</h2>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-xl"
        style={{
          backgroundColor: `rgb(${customization.color.r}, ${customization.color.g}, ${customization.color.b})`,
        }}
      >
        🌸
      </motion.div>

      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type:</span>
            <span className="font-semibold">
              {FLOWER_DISPLAY_NAMES[customization.flowerType]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Color:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{
                  backgroundColor: `rgb(${customization.color.r}, ${customization.color.g}, ${customization.color.b})`,
                }}
              />
              <span className="text-sm">
                RGB({customization.color.r}, {customization.color.g}, {customization.color.b})
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Leaves:</span>
            <span className="font-semibold">
              {LEAF_DISPLAY_NAMES[customization.leaves]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Petals:</span>
            <span className="font-semibold">{customization.petalCount}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-600 max-w-md">
        Ready to plant your flower in the garden? Click the button below!
      </p>
    </div>
  );
}
