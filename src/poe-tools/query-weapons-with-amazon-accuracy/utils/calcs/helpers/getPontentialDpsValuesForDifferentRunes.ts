import { DamageWithoutRuneModsResult } from "./getDamageWithoutRuneMods";

export interface RunePotentialDpsValues {
  potentialPhysRuneDps: number;
  potentialEleRuneDps: number;
  potentialAccuracyRuneDps: number;
  potentialAttackSpeedRuneDps: number;
}
export const getPontentialDpsValuesForDifferentRunes = (
  numberOfRuneSockets: number,
  increasedPhysicalDamage: number,
  attackSpeed: number,
  totalDamageWithoutRuneMods: DamageWithoutRuneModsResult,
  calculateForAmazonAscendancy: boolean,
  totalAccuracy: number
) => {
  // Phys Rune
  const pdpsWithoutIncreasedPhysicalDamage =
    totalDamageWithoutRuneMods.pdps / (1 + increasedPhysicalDamage / 100);

  const potentialPhysRuneDps =
    pdpsWithoutIncreasedPhysicalDamage *
      (1 + (increasedPhysicalDamage + 25 * numberOfRuneSockets) / 100) +
    totalDamageWithoutRuneMods.edps;

  const potentialEleRuneDps =
    totalDamageWithoutRuneMods.dps + numberOfRuneSockets * (15.5 * attackSpeed);

  const potentialAccuracyRuneDps =
    totalDamageWithoutRuneMods.dps + numberOfRuneSockets * (110 / 4);

  const potentialAttackSpeedRuneDps =
    (totalDamageWithoutRuneMods.dps / attackSpeed) *
    (attackSpeed * (1 + (numberOfRuneSockets * 5) / 100));
  return {
    potentialPhysRuneDps: parseFloat(
      (
        potentialPhysRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialEleRuneDps: parseFloat(
      (
        potentialEleRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialAccuracyRuneDps: parseFloat(
      (
        potentialAccuracyRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
    potentialAttackSpeedRuneDps: parseFloat(
      (
        potentialAttackSpeedRuneDps +
        (calculateForAmazonAscendancy ? totalAccuracy / 4 : 0)
      ).toFixed(2)
    ),
  } as RunePotentialDpsValues;
};
