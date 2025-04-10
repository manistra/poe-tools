/**
 * Extracts accuracy value from a mod string
 * @param mod The mod string containing accuracy information
 * @returns The accuracy value as a number, or 0 if no accuracy found
 */
const extractAccuracyValue = (mod: string): number => {
  // Match patterns like "+110 to Accuracy Rating" or "+553 to [Accuracy|Accuracy] Rating"
  const accuracyRegex = /\+(\d+) to (?:\[Accuracy\|Accuracy\]|Accuracy) Rating/;
  const match = mod.match(accuracyRegex);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  return 0;
};

/**
 * Calculates the total accuracy from all item mods
 * @param item The item data containing mods
 * @returns The total accuracy value
 */
export const calculateTotalAccuracy = (item: any): number => {
  if (!item) return 0;

  let totalAccuracy = 0;

  // Check runeMods
  if (item.runeMods && Array.isArray(item.runeMods)) {
    item.runeMods.forEach((mod: string) => {
      totalAccuracy += extractAccuracyValue(mod);
    });
  }

  // Check fracturedMods
  if (item.fracturedMods && Array.isArray(item.fracturedMods)) {
    item.fracturedMods.forEach((mod: string) => {
      totalAccuracy += extractAccuracyValue(mod);
    });
  }

  // Check explicitMods
  if (item.explicitMods && Array.isArray(item.explicitMods)) {
    item.explicitMods.forEach((mod: string) => {
      totalAccuracy += extractAccuracyValue(mod);
    });
  }

  return totalAccuracy;
};
