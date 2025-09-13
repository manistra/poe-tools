import { ItemData } from "src/shared/types";

export const mockData = [
  {
    id: "af080ef6476337bba7c3813c2d65eb3381f74776735a05c0aec5ade7898ec8a6",
    listing: {
      method: "psapi",
      indexed: "2025-09-12T15:04:18Z",
      stash: {
        name: "~price 500 exalted",
        x: 8,
        y: 0,
      },
      price: {
        type: "~price",
        amount: 500,
        currency: "exalted",
      },
      account: {
        name: "PivoWaRus#1265",
        online: {
          league: "Rise of the Abyssal",
        },
        lastCharacterName: "AbysLich",
        language: "ru_RU",
        realm: "poe2",
      },
      whisper:
        '@AbysLich Здравствуйте, хочу купить у вас Шёпот братства Кольцо с сапфиром за 500 exalted в лиге Rise of the Abyssal (секция "~price 500 exalted"; позиция: 9 столбец, 1 ряд)',
      whisper_token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI3ZjlhN2IwZTExZDAwMjQ3ZjE2MDBhMGRkYTYwZmY3NyIsImlzcyI6IjJLZXdRWG9vVWsiLCJhdWQiOiJiOGVkOGM0MC04YTJkLTQ1ODgtODg4OC1jN2I5YjhiYmZkZjIiLCJkc3QiOiJBYnlzTGljaCIsImxvYyI6InJ1X1JVIiwidG9rIjoiaXRlbSIsInN1YiI6ImFmMDgwZWY2NDc2MzM3YmJhN2MzODEzYzJkNjVlYjMzODFmNzQ3NzY3MzVhMDVjMGFlYzVhZGU3ODk4ZWM4YTYiLCJkYXQiOiI4NDM3N2I2M2I3YjE1ZDEyMzM3YjE3MmVjYmUxNjljZiIsImlhdCI6MTc1Nzc3MjIwMCwiZXhwIjoxNzU3NzcyNTAwfQ.86eigyu_euuzCqWwf0my41KxIyqSFwJVdirM42IMn1s",
    },
    item: {
      realm: "poe2",
      verified: true,
      w: 1,
      h: 1,
      icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvUmluZ3MvVW5pcXVlcy9XaGlzcGVyT2ZUaGVCcm90aGVyaG9vZCIsInciOjEsImgiOjEsInNjYWxlIjoxLCJyZWFsbSI6InBvZTIifV0/4f026422fc/WhisperOfTheBrotherhood.png",
      league: "Rise of the Abyssal",
      id: "af080ef6476337bba7c3813c2d65eb3381f74776735a05c0aec5ade7898ec8a6",
      name: "Whisper of the Brotherhood",
      typeLine: "Sapphire Ring",
      baseType: "Sapphire Ring",
      rarity: "Unique",
      ilvl: 79,
      identified: true,
      properties: [
        {
          name: "Ring",
          values: [],
          displayMode: 0,
        },
      ],
      requirements: [
        {
          name: "Level",
          values: [["32", 0]],
          displayMode: 0,
          type: 62,
        },
      ],
      implicitMods: ["+30% to [Resistances|Cold Resistance]"],
      explicitMods: [
        "5% increased [SkillSpeed|Skill Speed]",
        "+17 to [Dexterity|Dexterity]",
        "34% increased Mana Regeneration Rate",
        "100% of [Cold] Damage [Conversion|Converted] to [Lightning] Damage",
      ],
      flavourText: [
        "Forged by the last remaining brother\r",
        "to return all that was once given.",
      ],
      frameType: 3,
      extended: {
        mods: {
          explicit: [
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_3261801346",
                  min: "10",
                  max: "20",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 40,
              magnitudes: [
                {
                  hash: "explicit.stat_789117908",
                  min: "25",
                  max: "35",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_970213192",
                  min: "5",
                  max: "10",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_1686824704",
                  min: "100",
                  max: "100",
                },
              ],
            },
          ],
          implicit: [
            {
              name: "",
              tier: "",
              level: 15,
              magnitudes: [
                {
                  hash: "implicit.stat_4220027924",
                  min: "20",
                  max: "30",
                },
              ],
            },
          ],
        },
        hashes: {
          explicit: [
            ["explicit.stat_970213192", [2]],
            ["explicit.stat_3261801346", [0]],
            ["explicit.stat_789117908", [1]],
            ["explicit.stat_1686824704", [3]],
          ],
          implicit: [["implicit.stat_4220027924", [0]]],
        },
      },
    },
  },

  {
    searchLabel: "Dev Mock Search",
    id: "1bc532e2949867b0bf5beaed0f67085e95b5b08cf4c8f28062b0d56efd5cbb52",
    listing: {
      method: "psapi",
      indexed: "2025-04-10T21:11:38Z",
      stash: {
        name: "Sell",
        x: 8,
        y: 0,
      },
      whisper:
        '@MikeKwasowski Hi, I would like to buy your Grim Wind Gemini Bow listed for 1 exalted in Dawn of the Hunt (stash tab "Sell"; position: left 9, top 1)',
      whisper_token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxMTIwY2FhN2JjODgxMjZkYmVlNzVlYzJhZjdiZWE3OSIsImlzcyI6Ik16NFYzNU1JSiIsImF1ZCI6ImI4ZWQ4YzQwLThhMmQtNDU4OC04ODg4LWM3YjliOGJiZmRmMiIsImRzdCI6Ik1pa2VLd2Fzb3dza2kiLCJsb2MiOiJlbl9VUyIsInRvayI6Iml0ZW0iLCJzdWIiOiIxYmM1MzJlMjk0OTg2N2IwYmY1YmVhZWQwZjY3MDg1ZTk1YjViMDhjZjRjOGYyODA2MmIwZDU2ZWZkNWNiYjUyIiwiZGF0IjoiNmZmNGJjMDg5OGUzMDNhYTRlYjM3NTRmM2FkMzkwNTQiLCJpYXQiOjE3NDQzMjA0MTksImV4cCI6MTc0NDMyMDcxOX0.Crs7RI85y8mCdJS8av05auxahrgwM6e_Sa_Nckinof4",
      account: {
        name: "Anomaliii#6054",
        online: {
          league: "Dawn of the Hunt",
        },
        lastCharacterName: "MikeKwasowski",
        language: "en_US",
        realm: "poe2",
      },
      price: {
        type: "~price",
        amount: 1,
        currency: "exalted",
      },
    },
    item: {
      realm: "poe2",
      verified: true,
      w: 2,
      h: 4,
      icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Cb3dzL0Jhc2V0eXBlcy9Cb3cwNiIsInciOjIsImgiOjQsInNjYWxlIjoxLCJyZWFsbSI6InBvZTIifV0/b0a606586d/Bow06.png",
      league: "Dawn of the Hunt",
      id: "1bc532e2949867b0bf5beaed0f67085e95b5b08cf4c8f28062b0d56efd5cbb52",
      sockets: [
        {
          group: 0,
          type: "rune",
          item: "rune",
        },
        {
          group: 1,
          type: "rune",
          item: "rune",
        },
        {
          group: 2,
          type: "rune",
          item: "rune",
        },
      ],
      name: "Test Bow",
      typeLine: "Gemini Bow",
      baseType: "Gemini Bow",
      rarity: "Rare",
      ilvl: 81,
      identified: true,
      note: "~price 1 exalted",
      corrupted: true,
      properties: [
        {
          name: "[Bow]",
          values: [],
          displayMode: 0,
        },
        {
          name: "[Physical] Damage",
          values: [["49-94", 1]],
          displayMode: 0,
          type: 9,
        },
        {
          name: "[ElementalDamage|Elemental] Damage",
          values: [
            ["18-25", 5],
            ["3-90", 6],
          ],
          displayMode: 0,
          type: 10,
        },
        {
          name: "[Critical|Critical Hit] Chance",
          values: [["5.00%", 0]],
          displayMode: 0,
          type: 12,
        },
        {
          name: "Attacks per Second",
          values: [["1.20", 0]],
          displayMode: 0,
          type: 13,
        },
      ],
      requirements: [
        {
          name: "Level",
          values: [["78", 0]],
          displayMode: 0,
          type: 62,
        },
        {
          name: "[Dexterity|Dex]",
          values: [["148", 1]],
          displayMode: 1,
          type: 64,
        },
      ],
      runeMods: ["Adds 3 to 90 [Lightning|Lightning] Damage"],
      implicitMods: ["Bow [Attack|Attacks] fire an additional Arrow"],
      explicitMods: [
        "Adds 10 to 21 [Physical|Physical] Damage",
        "Adds 18 to 25 [Cold|Cold] Damage",
        "+353 to [Accuracy|Accuracy] Rating",
        "30% reduced [Attributes|Attribute] Requirements",
        "Bow [Attack|Attacks] fire an additional Arrow",
        "Grants 4 Life per Enemy [HitDamage|Hit]",
      ],
      frameType: 2,
      socketedItems: [
        {
          realm: "poe2",
          verified: true,
          w: 1,
          h: 1,
          icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvUnVuZXMvTGlnaHRuaW5nUnVuZVRpZXIyIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/f012a6530b/LightningRuneTier2.png",
          stackSize: 1,
          maxStackSize: 10,
          league: "Dawn of the Hunt",
          id: "ac1af98510543e04cb37d0960ff3574fe565d79578331ce915a0e50bbbd35604",
          name: "",
          typeLine: "Greater Storm Rune",
          baseType: "Greater Storm Rune",
          ilvl: 0,
          identified: true,
          properties: [
            {
              name: "Stack Size",
              values: [["1/10", 0]],
              displayMode: 0,
              type: 32,
            },
          ],
          requirements: [
            {
              name: "Level",
              values: [["30", 0]],
              displayMode: 0,
              type: 62,
            },
          ],
          explicitMods: [
            "[MartialWeapon|Martial Weapon]: Adds 1 to 30 [Lightning|Lightning] Damage",
            "Armour: +14% to [Resistances|Lightning Resistance]",
          ],
          descrText:
            "Place into an empty Rune Socket in a [MartialWeapon|Martial Weapon] or Armour to apply its effect to that item. Once socketed it cannot be removed.",
          frameType: 5,
          socket: 0,
        },
        {
          realm: "poe2",
          verified: true,
          w: 1,
          h: 1,
          icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvUnVuZXMvTGlnaHRuaW5nUnVuZVRpZXIyIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/f012a6530b/LightningRuneTier2.png",
          stackSize: 1,
          maxStackSize: 10,
          league: "Dawn of the Hunt",
          id: "7de7c0edc1b797b6c86d2f4267d61582c36f8c12eb2e63fc215cd052e97768be",
          name: "",
          typeLine: "Greater Storm Rune",
          baseType: "Greater Storm Rune",
          ilvl: 0,
          identified: true,
          properties: [
            {
              name: "Stack Size",
              values: [["1/10", 0]],
              displayMode: 0,
              type: 32,
            },
          ],
          requirements: [
            {
              name: "Level",
              values: [["30", 0]],
              displayMode: 0,
              type: 62,
            },
          ],
          explicitMods: [
            "[MartialWeapon|Martial Weapon]: Adds 1 to 30 [Lightning|Lightning] Damage",
            "Armour: +14% to [Resistances|Lightning Resistance]",
          ],
          descrText:
            "Place into an empty Rune Socket in a [MartialWeapon|Martial Weapon] or Armour to apply its effect to that item. Once socketed it cannot be removed.",
          frameType: 5,
          socket: 1,
        },
        {
          realm: "poe2",
          verified: true,
          w: 1,
          h: 1,
          icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvUnVuZXMvTGlnaHRuaW5nUnVuZVRpZXIyIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsInJlYWxtIjoicG9lMiJ9XQ/f012a6530b/LightningRuneTier2.png",
          stackSize: 1,
          maxStackSize: 10,
          league: "Dawn of the Hunt",
          id: "8ccd7c1470e750972bff810147eb67fb39f7adbb11e4b5cf525a317fcf2e3e13",
          name: "",
          typeLine: "Greater Storm Rune",
          baseType: "Greater Storm Rune",
          ilvl: 0,
          identified: true,
          properties: [
            {
              name: "Stack Size",
              values: [["1/10", 0]],
              displayMode: 0,
              type: 32,
            },
          ],
          requirements: [
            {
              name: "Level",
              values: [["30", 0]],
              displayMode: 0,
              type: 62,
            },
          ],
          explicitMods: [
            "[MartialWeapon|Martial Weapon]: Adds 1 to 30 [Lightning|Lightning] Damage",
            "Armour: +14% to [Resistances|Lightning Resistance]",
          ],
          descrText:
            "Place into an empty Rune Socket in a [MartialWeapon|Martial Weapon] or Armour to apply its effect to that item. Once socketed it cannot be removed.",
          frameType: 5,
          socket: 2,
        },
      ],
      extended: {
        dps: 167.4,
        pdps: 85.8,
        edps: 81.6,
        mods: {
          explicit: [
            {
              name: "of Splintering",
              tier: "S1",
              level: 55,
              magnitudes: [
                {
                  hash: "explicit.stat_3885405204",
                  min: "1",
                  max: "1",
                },
              ],
            },
            {
              name: "of Regrowth",
              tier: "S3",
              level: 30,
              magnitudes: [
                {
                  hash: "explicit.stat_821021828",
                  min: "4",
                  max: "4",
                },
              ],
            },
            {
              name: "Freezing",
              tier: "P5",
              level: 34,
              magnitudes: [
                {
                  hash: "explicit.stat_1037193709",
                  min: "12",
                  max: "18",
                },
                {
                  hash: "explicit.stat_1037193709",
                  min: "19",
                  max: "28",
                },
              ],
            },
            {
              name: "of the Skilled",
              tier: "S4",
              level: 52,
              magnitudes: [
                {
                  hash: "explicit.stat_3639275092",
                  min: "-30",
                  max: "-30",
                },
              ],
            },
            {
              name: "Ranger's",
              tier: "P8",
              level: 63,
              magnitudes: [
                {
                  hash: "explicit.stat_691932474",
                  min: "347",
                  max: "450",
                },
              ],
            },
            {
              name: "Honed",
              tier: "P4",
              level: 29,
              magnitudes: [
                {
                  hash: "explicit.stat_1940865751",
                  min: "8",
                  max: "12",
                },
                {
                  hash: "explicit.stat_1940865751",
                  min: "14",
                  max: "21",
                },
              ],
            },
          ],
          implicit: [
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "implicit.stat_3885405204",
                  min: "1",
                  max: "1",
                },
              ],
            },
          ],
        },
        hashes: {
          explicit: [
            ["explicit.stat_1940865751", [5]],
            ["explicit.stat_1037193709", [2]],
            ["explicit.stat_691932474", [4]],
            ["explicit.stat_3639275092", [3]],
            ["explicit.stat_3885405204", [0]],
            ["explicit.stat_821021828", [1]],
          ],
          implicit: [["implicit.stat_3885405204", [0]]],
          rune: [["rune.stat_3336890334", null]],
        },
      },
    },
  },

  {
    searchLabel: "Dev Mock Search",
    id: "bf07bbd017e5156defdb04f61ad9633a7604d9ec7b80c417a663d0088363eebc",
    listing: {
      method: "psapi",
      indexed: "2025-09-13T11:39:27Z",
      stash: {
        name: "4",
        x: 10,
        y: 1,
      },
      price: {
        type: "~b/o",
        amount: 2,
        currency: "divine",
      },
      fee: 9988,
      account: {
        name: "15867481747#4436",
        online: null,
      },
      hideout_token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1Y2JkY2M1ZmU0NmUzZWUzZTg2OGZlZjE2ZTMzYWRiOCIsImlzcyI6IlFMS0wyVmdPdXciLCJhdWQiOiJiOGVkOGM0MC04YTJkLTQ1ODgtODg4OC1jN2I5YjhiYmZkZjIiLCJ0b2siOiJoaWRlb3V0Iiwic3ViIjoiYmYwN2JiZDAxN2U1MTU2ZGVmZGIwNGY2MWFkOTYzM2E3NjA0ZDllYzdiODBjNDE3YTY2M2QwMDg4MzYzZWViYyIsImRhdCI6ImE5NDgzOWY3OTg5ZjllMTE5ZDc5NmQwZWU5NzVmZTBmIiwiaWF0IjoxNzU3NzY4MDA2LCJleHAiOjE3NTc3NjgzMDZ9.34L8NmR4fvt9TnheU-i9_0COizwGf3LRRD5x6Tqbbhw",
    },
    item: {
      realm: "poe2",
      verified: true,
      w: 2,
      h: 4,
      icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvV2VhcG9ucy9Ud29IYW5kV2VhcG9ucy9Cb3dzL0Jhc2V0eXBlcy9Cb3cwNiIsInciOjIsImgiOjQsInNjYWxlIjoxLCJyZWFsbSI6InBvZTIifV0/b0a606586d/Bow06.png",
      league: "Rise of the Abyssal",
      id: "bf07bbd017e5156defdb04f61ad9633a7604d9ec7b80c417a663d0088363eebc",
      name: "",
      typeLine: "Flaring Gemini Bow of Ruin",
      baseType: "Gemini Bow",
      rarity: "Magic",
      ilvl: 80,
      identified: true,
      note: "~b/o 2 divine",
      properties: [
        {
          name: "[Bow]",
          values: [],
          displayMode: 0,
        },
        {
          name: "[Physical] Damage",
          values: [["71-137", 1]],
          displayMode: 0,
          type: 9,
        },
        {
          name: "[Critical|Critical Hit] Chance",
          values: [["9.28%", 1]],
          displayMode: 0,
          type: 12,
        },
        {
          name: "Attacks per Second",
          values: [["1.10", 0]],
          displayMode: 0,
          type: 13,
        },
      ],
      requirements: [
        {
          name: "Level",
          values: [["78", 0]],
          displayMode: 0,
          type: 62,
        },
        {
          name: "[Dexterity|Dex]",
          values: [["163", 0]],
          displayMode: 1,
          type: 64,
        },
      ],
      implicitMods: ["Bow [Attack|Attacks] fire an additional Arrow"],
      explicitMods: [
        "Adds 32 to 65 [Physical|Physical] Damage",
        "+4.28% to [Critical|Critical Hit] Chance",
      ],
      frameType: 1,
      extended: {
        dps: 136.95,
        pdps: 136.95,
        edps: 0,
        dps_aug: true,
        pdps_aug: true,
        mods: {
          explicit: [
            {
              name: "Flaring",
              tier: "P1",
              level: 75,
              magnitudes: [
                {
                  hash: "explicit.stat_1940865751",
                  min: "26",
                  max: "39",
                },
                {
                  hash: "explicit.stat_1940865751",
                  min: "44",
                  max: "66",
                },
              ],
            },
            {
              name: "of Ruin",
              tier: "S2",
              level: 59,
              magnitudes: [
                {
                  hash: "explicit.stat_518292764",
                  min: "3.81",
                  max: "4.4",
                },
              ],
            },
          ],
          implicit: [
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "implicit.stat_3885405204",
                  min: "1",
                  max: "1",
                },
              ],
            },
          ],
        },
        hashes: {
          explicit: [
            ["explicit.stat_1940865751", [0]],
            ["explicit.stat_518292764", [1]],
          ],
          implicit: [["implicit.stat_3885405204", [0]]],
        },
      },
    },
  },

  {
    searchLabel: "Dev Mock Search",
    id: "38d3c582f92a92a383131a1050f2625ed4ada6ddc8d752bc9dd5f6b47fa52202",
    listing: {
      method: "psapi",
      indexed: "2025-09-12T15:38:51Z",
      stash: {
        name: "~price 500 exalted",
        x: 6,
        y: 0,
      },
      price: {
        type: "~price",
        amount: 500,
        currency: "exalted",
      },
      account: {
        name: "PivoWaRus#1265",
        online: {
          league: "Rise of the Abyssal",
        },
        lastCharacterName: "AbysLich",
        language: "ru_RU",
        realm: "poe2",
      },
      whisper:
        '@AbysLich Здравствуйте, хочу купить у вас Северные лапы Замшевые наручи за 500 exalted в лиге Rise of the Abyssal (секция "~price 500 exalted"; позиция: 7 столбец, 1 ряд)',
      whisper_token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTE3YzY5YmIxYjVmNTgyYTgwNjg2MDY4MzQ1OTk2NyIsImlzcyI6IjJLZXdRWG9vVWsiLCJhdWQiOiJiOGVkOGM0MC04YTJkLTQ1ODgtODg4OC1jN2I5YjhiYmZkZjIiLCJkc3QiOiJBYnlzTGljaCIsImxvYyI6InJ1X1JVIiwidG9rIjoiaXRlbSIsInN1YiI6IjM4ZDNjNTgyZjkyYTkyYTM4MzEzMWExMDUwZjI2MjVlZDRhZGE2ZGRjOGQ3NTJiYzlkZDVmNmI0N2ZhNTIyMDIiLCJkYXQiOiIxZGFmZjA0YjQ5MjZmNzNkM2I3MzA5YzM5MGVlOTYzOSIsImlhdCI6MTc1Nzc2OTYwNiwiZXhwIjoxNzU3NzY5OTA2fQ.oD8PiEtCSfOPD7v-TuhVTgYGDdgWgSYj5EcaxvLpHPQ",
    },
    item: {
      realm: "poe2",
      verified: true,
      w: 2,
      h: 2,
      icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQXJtb3Vycy9HbG92ZXMvVW5pcXVlcy9Ob3J0aHBhdyIsInciOjIsImgiOjIsInNjYWxlIjoxLCJyZWFsbSI6InBvZTIifV0/14ac29a0a2/Northpaw.png",
      league: "Rise of the Abyssal",
      id: "38d3c582f92a92a383131a1050f2625ed4ada6ddc8d752bc9dd5f6b47fa53202",
      name: "Northpaw",
      typeLine: "Suede Bracers",
      baseType: "Suede Bracers",
      rarity: "Unique",
      ilvl: 81,
      identified: true,
      properties: [
        {
          name: "Gloves",
          values: [],
          displayMode: 0,
        },
        {
          name: "[Evasion|Evasion Rating]",
          values: [["25", 1]],
          displayMode: 0,
          type: 17,
        },
      ],
      explicitMods: [
        "+15 to [Evasion] Rating",
        "Adds 4 to 10 [Physical|Physical] Damage to [Attack|Attacks]",
        "12% increased [CriticalDamageBonus|Critical Damage Bonus]",
        "Base [Critical|Critical Hit] Chance for [Attack|Attacks] with [MartialWeapon|Weapons] is 7%",
      ],
      flavourText: ["Fight with the ferocity of the First Ones."],
      frameType: 3,
      extended: {
        ev: 30,
        ev_aug: true,
        mods: {
          explicit: [
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_3556824919",
                  min: "10",
                  max: "15",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_3032590688",
                  min: "3",
                  max: "5",
                },
                {
                  hash: "explicit.stat_3032590688",
                  min: "8",
                  max: "10",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_2635559734",
                  min: "7",
                  max: "7",
                },
              ],
            },
            {
              name: "",
              tier: "",
              level: 1,
              magnitudes: [
                {
                  hash: "explicit.stat_53045048",
                  min: "15",
                  max: "25",
                },
              ],
            },
          ],
        },
        hashes: {
          explicit: [
            ["explicit.stat_53045048", [3]],
            ["explicit.stat_3032590688", [1]],
            ["explicit.stat_3556824919", [0]],
            ["explicit.stat_2635559734", [2]],
          ],
        },
      },
    },
  },
] as unknown as ItemData[];
