const NUTRITION_DATA_CHANGED_EVENT = 'nutrition-data-changed';

export const notifyNutritionDataChanged = () => {
  const timestamp = String(Date.now());

  localStorage.setItem('nutrition-data-updated-at', timestamp);
  window.dispatchEvent(new CustomEvent(NUTRITION_DATA_CHANGED_EVENT, { detail: timestamp }));
};

export const subscribeNutritionDataChanged = (listener: () => void) => {
  const handleChanged = () => {
    listener();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'nutrition-data-updated-at') {
      listener();
    }
  };

  window.addEventListener(NUTRITION_DATA_CHANGED_EVENT, handleChanged);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(NUTRITION_DATA_CHANGED_EVENT, handleChanged);
    window.removeEventListener('storage', handleStorage);
  };
};
