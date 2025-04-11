export interface DamageWithoutRuneModsResult {
  pdps: number;
  edps: number;
  dps: number;
}

export const getDamageWithoutRuneMods = ({
  pdps,
  edps,
  runeMods,
  increasedPhysicalDamage,
  attackSpeed,
}: {
  pdps: number;
  edps: number;
  runeMods: string[];
  increasedPhysicalDamage: number;
  attackSpeed: number;
}) => {
  let pdpsWithoutRuneMods = pdps;
  let edpsWithoutRuneMods = edps;

  runeMods?.map((mod) => {
    if (mod.includes("increased [Physical] Damage")) {
      const matches = mod.match(/(\d+)% increased \[Physical\] Damage/);
      if (matches && matches[1]) {
        const runeIncreasedPhysicalDamage = parseInt(matches[1]);

        const pdpsWithoutIncreasedPhysicalDamage =
          pdpsWithoutRuneMods /
          (1 + (increasedPhysicalDamage + runeIncreasedPhysicalDamage) / 100);

        pdpsWithoutRuneMods =
          pdpsWithoutIncreasedPhysicalDamage *
          (1 + increasedPhysicalDamage / 100);
      }
    } else if (mod.includes("Adds") && mod.includes("[Fire|Fire] Damage")) {
      const matches = mod.match(/Adds (\d+) to (\d+) \[Fire\|Fire\] Damage/);
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (mod.includes("Adds") && mod.includes("[Cold|Cold] Damage")) {
      const matches = mod.match(/Adds (\d+) to (\d+) \[Cold\|Cold\] Damage/);
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (
      mod.includes("Adds") &&
      mod.includes("[Lightning|Lightning] Damage")
    ) {
      const matches = mod.match(
        /Adds (\d+) to (\d+) \[Lightning\|Lightning\] Damage/
      );
      if (matches && matches[1] && matches[2]) {
        const minDamage = parseInt(matches[1]);
        const maxDamage = parseInt(matches[2]);
        const avgDamage = (minDamage + maxDamage) / 2;
        edpsWithoutRuneMods -= avgDamage * attackSpeed;
      }
    } else if (mod.includes("increased [Attack] Speed")) {
      const matches = mod.match(/(\d+)% increased \[Attack\] Speed/);
      if (matches && matches[1]) {
        const runeIcreasedAttackSpeed = parseInt(matches[1]);

        pdpsWithoutRuneMods = pdpsWithoutRuneMods / attackSpeed;
        pdpsWithoutRuneMods =
          pdpsWithoutRuneMods *
          (attackSpeed * (1 + runeIcreasedAttackSpeed / 100));

        edpsWithoutRuneMods = edpsWithoutRuneMods / attackSpeed;
        edpsWithoutRuneMods =
          edpsWithoutRuneMods *
          (attackSpeed * (1 + runeIcreasedAttackSpeed / 100));
      }
    }
  });

  return {
    pdps: parseFloat(pdpsWithoutRuneMods.toFixed(2)),
    edps: parseFloat(edpsWithoutRuneMods.toFixed(2)),
    dps: parseFloat((pdpsWithoutRuneMods + edpsWithoutRuneMods).toFixed(2)),
  } as DamageWithoutRuneModsResult;
};
