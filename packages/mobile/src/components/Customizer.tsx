/**
 * Main customizer component
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomizer } from '../hooks/useCustomizer';
import { mobileSocket } from '../socket/mobile-socket';
import { FlowerTypeStep } from './steps/FlowerTypeStep';
import { ColorPickerStep } from './steps/ColorPickerStep';
import { LeavesStep } from './steps/LeavesStep';
import { PetalsStep } from './steps/PetalsStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { ArrowNavigation } from './ArrowNavigation';
import { PlantButton } from './PlantButton';
import { SuccessModal } from './SuccessModal';

export function Customizer() {
  const customizer = useCustomizer();
  const [isPlanting, setIsPlanting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlant = async () => {
    setIsPlanting(true);
    setError(null);

    try {
      const result = await mobileSocket.plantFlower(customizer.getCustomization());

      if (result.success) {
        setShowSuccess(true);
      } else {
        setError(result.error || 'Failed to plant flower');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsPlanting(false);
    }
  };

  const handlePlantAnother = () => {
    setShowSuccess(false);
    customizer.reset();
  };

  const renderStep = () => {
    switch (customizer.currentStep) {
      case 'type':
        return (
          <FlowerTypeStep
            selected={customizer.flowerType}
            onSelect={customizer.setFlowerType}
          />
        );
      case 'color':
        return (
          <ColorPickerStep
            selected={customizer.color}
            onSelect={customizer.setColor}
          />
        );
      case 'leaves':
        return (
          <LeavesStep
            selected={customizer.leaves}
            onSelect={customizer.setLeaves}
          />
        );
      case 'petals':
        return (
          <PetalsStep
            count={customizer.petalCount}
            onChange={customizer.setPetalCount}
          />
        );
      case 'confirm':
        return <ConfirmStep customization={customizer.getCustomization()} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      {/* Header with progress */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Create Your Flower</h1>
          <div className="text-sm text-gray-600">
            Step {customizer.currentStepIndex + 1} of {customizer.totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((customizer.currentStepIndex + 1) / customizer.totalSteps) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={customizer.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Navigation */}
      <div className="p-6 pt-4 flex flex-col items-center gap-4">
        {customizer.currentStep === 'confirm' ? (
          <PlantButton onClick={handlePlant} loading={isPlanting} />
        ) : null}

        <ArrowNavigation
          onBack={customizer.goBack}
          onNext={customizer.goNext}
          canGoBack={customizer.canGoBack}
          canGoNext={customizer.canGoNext}
          hideNext={customizer.currentStep === 'confirm'}
        />
      </div>

      {/* Success modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onPlantAnother={handlePlantAnother}
      />
    </div>
  );
}
