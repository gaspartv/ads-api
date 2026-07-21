import { PrismaPg } from '@prisma/adapter-pg';
import { generate } from 'rxjs';
import { envConfig } from 'src/configs/env.config';
import { generateCode } from 'src/functions/generate-code';
import {
  BattleyeType,
  CharmType,
  Location,
  PrismaClient,
  PvpType,
} from 'src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: envConfig.DATABASE_URL,
  }),
});

const worlds: {
  name: string;
  location: Location;
  battleye: BattleyeType | null;
  pvpType: PvpType;
}[] = [
  {
    name: 'Aethera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Antica',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Astera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Belobra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Blumera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Bona',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Bravoria',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Calmera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Cantabra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Celebra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Celesta',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Citra',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Collabra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Descubra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Dia',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Dracobra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Eclipta',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Epoca',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Escura',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Etebra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Ferobra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Firmera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Floribra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Gentebra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Gladera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Gladibra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Harmonia',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Havera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Honbra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Hostera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Idyllia',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Ignibra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Ignitera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Inabra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Issobra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Jadebra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Junera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Kalanta',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Kalibra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Kalimera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Kanda',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Karmeya',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Lobera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Luminera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Lutabra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Luzibra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Maligna',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Menera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Monstera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'RETRO_HARDCORE_PVP',
  },
  {
    name: 'Monza',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Mystera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Nefera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Nevia',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Noctalia',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Oceanis',
    location: 'OCEANIA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Ombra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Opulera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Ourobra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Pacera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Peloria',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Penumbra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Premia',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Quelibra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Quidera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Quintera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Rasteibra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Refugia',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Retalia',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'RETRO_HARDCORE_PVP',
  },
  {
    name: 'Secura',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Serdebra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Solidera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Sombra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Sonira',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Stralis',
    location: 'OCEANIA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Talera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Tempestera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'RETRO_OPEN_PVP',
  },
  {
    name: 'Terribra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'RETRO_HARDCORE_PVP',
  },
  {
    name: 'Thyria',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Tornabra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Unebra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Ustebra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Venebra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Victoris',
    location: 'OCEANIA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Vunira',
    location: 'REINO_UNIDO',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Wintera',
    location: 'EUA',
    battleye: 'YELLOW',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Xybra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Xyla',
    location: 'REINO_UNIDO',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Xymera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPEN_PVP',
  },
  {
    name: 'Yonabra',
    location: 'BRASIL',
    battleye: 'YELLOW',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Yovera',
    location: 'EUA',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Yubra',
    location: 'BRASIL',
    battleye: 'GREEN',
    pvpType: 'OPTIONAL_PVP',
  },
  {
    name: 'Zuna',
    location: 'REINO_UNIDO',
    battleye: null,
    pvpType: 'HARDCORE_PVP',
  },
  {
    name: 'Zunera',
    location: 'EUA',
    battleye: null,
    pvpType: 'HARDCORE_PVP',
  },
];

const outfits: {
  name: string;
  type: string;
  gender: {
    female: {
      outfit: string;
      addon_1: string | null;
      addon_2: string | null;
      full: string | null;
    };
    male: {
      outfit: string;
      addon_1: string | null;
      addon_2: string | null;
      full: string | null;
    };
  };
}[] = [
  {
    name: 'Citizen Outfits',
    type: 'Free',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Citizen_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Citizen_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Citizen_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Citizen_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Citizen_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Citizen_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Citizen_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Citizen_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Hunter Outfits',
    type: 'Free',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Hunter_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Hunter_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Hunter_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Hunter_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Hunter_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Hunter_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Hunter_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Hunter_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Knight Outfits',
    type: 'Free',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Knight_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Knight_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Knight_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Knight_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Knight_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Knight_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Knight_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Knight_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Mage Outfits',
    type: 'Free',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Mage_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Mage_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Mage_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Mage_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Mage_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Mage_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Mage_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Mage_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Monk Outfits',
    type: 'Free',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Monk_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Monk_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Monk_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Monk_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Monk_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Monk_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Monk_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Monk_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Barbarian Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Barbarian_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Barbarian_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Barbarian_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Barbarian_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Barbarian_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Barbarian_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Barbarian_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Barbarian_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Druid Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Druid_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Druid_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Druid_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Druid_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Druid_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Druid_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Druid_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Druid_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Nobleman Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Nobleman_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Nobleman_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Nobleman_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nobleman_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Nobleman_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Nobleman_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Nobleman_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nobleman_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Oriental Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Oriental_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Oriental_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Oriental_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Oriental_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Oriental_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Oriental_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Oriental_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Oriental_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Summoner Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Summoner_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Summoner_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Summoner_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Summoner_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Summoner_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Summoner_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Summoner_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Summoner_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Warrior Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Warrior_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Warrior_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Warrior_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Warrior_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Warrior_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Warrior_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Warrior_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Warrior_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Wizard Outfits',
    type: 'Premium',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Wizard_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Wizard_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Wizard_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Wizard_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Wizard_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Wizard_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Wizard_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Wizard_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Afflicted Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Afflicted_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Afflicted_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Afflicted_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Afflicted_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Afflicted_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Afflicted_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Afflicted_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Afflicted_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Ancient Aucar Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Ancient_Aucar_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Ancient_Aucar_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Ancient_Aucar_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ancient_Aucar_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Ancient_Aucar_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Ancient_Aucar_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Ancient_Aucar_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ancient_Aucar_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Assassin Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Assassin_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Assassin_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Assassin_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Assassin_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Assassin_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Assassin_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Assassin_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Assassin_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Battle Mage Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Battle_Mage_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Battle_Mage_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Battle_Mage_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Battle_Mage_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Battle_Mage_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Battle_Mage_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Battle_Mage_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Battle_Mage_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Beggar Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Beggar_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Beggar_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Beggar_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beggar_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Beggar_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Beggar_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Beggar_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beggar_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Brotherhood of Bones Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit:
          '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Brotherhood_of_Bones_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Cave Explorer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Cave_Explorer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Cave_Explorer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Cave_Explorer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Cave_Explorer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Cave_Explorer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Cave_Explorer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Cave_Explorer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Cave_Explorer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Citizen of Issavi Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Citizen_of_Issavi_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Crystal Warlord Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Crystal_Warlord_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Crystal_Warlord_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Crystal_Warlord_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Crystal_Warlord_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Crystal_Warlord_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Crystal_Warlord_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Crystal_Warlord_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Crystal_Warlord_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Decaying Defender Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Decaying_Defender_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Decaying_Defender_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Decaying_Defender_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Decaying_Defender_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Decaying_Defender_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Decaying_Defender_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Decaying_Defender_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Decaying_Defender_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Deepling Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Deepling_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Deepling_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Deepling_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Deepling_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Deepling_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Deepling_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Deepling_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Deepling_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Demon Hunter Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Demon_Hunter_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Demon_Hunter_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Demon_Hunter_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Demon_Hunter_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Demon_Hunter_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Demon_Hunter_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Demon_Hunter_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Demon_Hunter_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Demon Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Demon_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Demon_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Demon_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Demon_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Demon_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Demon_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Demon_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Demon_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Discoverer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Discoverer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Discoverer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Discoverer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Discoverer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Discoverer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Discoverer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Discoverer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Discoverer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Draccoon Herald Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Draccoon_Herald_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Draccoon_Herald_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Draccoon_Herald_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Draccoon_Herald_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Draccoon_Herald_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Draccoon_Herald_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Draccoon_Herald_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Draccoon_Herald_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Dragon Slayer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Dragon_Slayer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dragon_Slayer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dragon_Slayer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dragon_Slayer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Dragon_Slayer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dragon_Slayer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dragon_Slayer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dragon_Slayer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Dream Warden Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Dream_Warden_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dream_Warden_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dream_Warden_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dream_Warden_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Dream_Warden_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Dream_Warden_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Dream_Warden_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dream_Warden_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Dream Warrior Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Dream_Warrior_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dream_Warrior_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dream_Warrior_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dream_Warrior_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Dream_Warrior_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dream_Warrior_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dream_Warrior_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dream_Warrior_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Elementalist Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Elementalist_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Elementalist_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Elementalist_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Elementalist_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Elementalist_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Elementalist_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Elementalist_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Elementalist_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Festive Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Festive_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Festive_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Festive_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Festive_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Festive_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Festive_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Festive_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Festive_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Fiend Slayer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Fiend_Slayer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Fiend_Slayer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Fiend_Slayer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fiend_Slayer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Fiend_Slayer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Fiend_Slayer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Fiend_Slayer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fiend_Slayer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Fire-Fighter Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Fire-Fighter_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Fire-Fighter_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Fire-Fighter_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fire-Fighter_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Fire-Fighter_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Fire-Fighter_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Fire-Fighter_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fire-Fighter_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Formal Dress Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Formal_Dress_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Formal_Dress_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Formal_Dress_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Formal_Dress_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Formal_Dress_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Formal_Dress_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Formal_Dress_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Formal_Dress_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Glooth Engineer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Glooth_Engineer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Glooth_Engineer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Glooth_Engineer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Glooth_Engineer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Glooth_Engineer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Glooth_Engineer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Glooth_Engineer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Glooth_Engineer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Golden Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Golden_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Golden_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Golden_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Golden_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Golden_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Golden_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Golden_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Golden_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Hand of the Inquisition Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Female_Addon_3.gif',
      },
      male: {
        outfit:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Hand_of_the_Inquisition_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Illuminated Warrior Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Illuminated_Warrior_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Illuminated_Warrior_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Illuminated_Warrior_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Illuminated_Warrior_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Illuminated_Warrior_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Illuminated_Warrior_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Illuminated_Warrior_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Illuminated_Warrior_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Illuminator Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Illuminator_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Illuminator_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Illuminator_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Illuminator_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Illuminator_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Illuminator_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Illuminator_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Illuminator_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Insectoid Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Insectoid_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Insectoid_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Insectoid_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Insectoid_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Insectoid_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Insectoid_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Insectoid_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Insectoid_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Jester Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Jester_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Jester_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Jester_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Jester_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Jester_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Jester_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Jester_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Jester_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Makeshift Warrior Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Makeshift_Warrior_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Makeshift_Warrior_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Makeshift_Warrior_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Makeshift_Warrior_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Makeshift_Warrior_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Makeshift_Warrior_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Makeshift_Warrior_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Makeshift_Warrior_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Newly Wed Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Newly_Wed_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Newly_Wed_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Nightmare Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Nightmare_Knights_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Nightmare_Knights_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Nightmare_Knights_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nightmare_Knights_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Nightmare_Knights_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Nightmare_Knights_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Nightmare_Knights_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nightmare_Knights_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Norseman Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Norseman_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Norseman_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Norseman_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Norseman_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Norseman_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Norseman_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Norseman_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Norseman_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Orcsoberfest Garb Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Orcsoberfest_Garb_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Percht Raider Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Percht_Raider_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Percht_Raider_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Percht_Raider_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Percht_Raider_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Percht_Raider_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Percht_Raider_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Percht_Raider_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Percht_Raider_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Pirate Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Pirate_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Pirate_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Pirate_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pirate_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Pirate_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Pirate_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Pirate_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pirate_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Poltergeist Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Poltergeist_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Poltergeist_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Poltergeist_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Poltergeist_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Poltergeist_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Poltergeist_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Poltergeist_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Poltergeist_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Rascoohan Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Rascoohan_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rascoohan_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rascoohan_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rascoohan_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Rascoohan_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rascoohan_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rascoohan_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rascoohan_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Revenant Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Revenant_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Revenant_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Revenant_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Revenant_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Revenant_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Revenant_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Revenant_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Revenant_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Rift Warrior Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Rift_Warrior_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Rift_Warrior_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Rift_Warrior_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rift_Warrior_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Rift_Warrior_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rift_Warrior_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rift_Warrior_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rift_Warrior_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Rootwalker Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Rootwalker_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rootwalker_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rootwalker_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rootwalker_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Rootwalker_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rootwalker_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rootwalker_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rootwalker_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Royal Bounacean Advisor Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Female_Addon_3.gif',
      },
      male: {
        outfit:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Bounacean_Advisor_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Royal Costume Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Royal_Costume_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Costume_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Costume_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Costume_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Royal_Costume_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Costume_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Costume_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Costume_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Shaman Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Shaman_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Shaman_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Shaman_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Shaman_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Shaman_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Shaman_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Shaman_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Shaman_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Soil Guardian Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Soil_Guardian_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Soil_Guardian_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Soil_Guardian_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Soil_Guardian_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Soil_Guardian_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Soil_Guardian_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Soil_Guardian_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Soil_Guardian_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Warmaster Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Warmaster_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Warmaster_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Warmaster_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Warmaster_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Warmaster_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Warmaster_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Warmaster_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Warmaster_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Wayfarer Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Wayfarer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Wayfarer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Wayfarer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Wayfarer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Wayfarer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Wayfarer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Wayfarer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Wayfarer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Yalaharian Outfits',
    type: 'Quest',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Yalaharian_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Yalaharian_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Yalaharian_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Yalaharian_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Yalaharian_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Yalaharian_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Yalaharian_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Yalaharian_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Recruiter Outfits',
    type: 'Special Offer',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Recruiter_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Recruiter_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Recruiter_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Recruiter_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Recruiter_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Recruiter_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Recruiter_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Recruiter_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Arbalester Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Arbalester_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Arbalester_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Arbalester_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Arbalester_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Arbalester_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Arbalester_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Arbalester_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Arbalester_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Arena Champion Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Arena_Champion_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Arena_Champion_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Arena_Champion_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Arena_Champion_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Arena_Champion_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Arena_Champion_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Arena_Champion_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Arena_Champion_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Armoured Archer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Armoured_Archer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Armoured_Archer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Armoured_Archer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Armoured_Archer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Armoured_Archer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Armoured_Archer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Armoured_Archer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Armoured_Archer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Bat Knight Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Bat_Knight_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Bat_Knight_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Bat_Knight_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Bat_Knight_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Bat_Knight_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Bat_Knight_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Bat_Knight_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Bat_Knight_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Beastmaster Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Beastmaster_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Beastmaster_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Beastmaster_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beastmaster_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Beastmaster_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Beastmaster_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Beastmaster_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beastmaster_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Beekeeper Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Beekeeper_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Beekeeper_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Beekeeper_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beekeeper_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Beekeeper_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Beekeeper_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Beekeeper_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Beekeeper_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Blade Dancer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Blade_Dancer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Blade_Dancer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Blade_Dancer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Blade_Dancer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Blade_Dancer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Blade_Dancer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Blade_Dancer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Blade_Dancer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Breezy Garb Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Breezy_Garb_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Breezy_Garb_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Breezy_Garb_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Breezy_Garb_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Breezy_Garb_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Breezy_Garb_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Breezy_Garb_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Breezy_Garb_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Celestial Avenger Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Celestial_Avenger_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Celestial_Avenger_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Celestial_Avenger_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Celestial_Avenger_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Celestial_Avenger_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Celestial_Avenger_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Celestial_Avenger_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Celestial_Avenger_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Ceremonial Garb Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Ceremonial_Garb_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Ceremonial_Garb_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Ceremonial_Garb_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ceremonial_Garb_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Ceremonial_Garb_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Ceremonial_Garb_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Ceremonial_Garb_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ceremonial_Garb_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Champion Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Champion_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Champion_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Champion_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Champion_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Champion_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Champion_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Champion_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Champion_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Chaos Acolyte Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Chaos_Acolyte_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Chaos_Acolyte_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Chaos_Acolyte_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Chaos_Acolyte_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Chaos_Acolyte_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Chaos_Acolyte_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Chaos_Acolyte_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Chaos_Acolyte_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Conjurer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Conjurer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Conjurer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Conjurer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Conjurer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Conjurer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Conjurer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Conjurer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Conjurer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Darklight Evoker Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Darklight_Evoker_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Darklight_Evoker_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Darklight_Evoker_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Darklight_Evoker_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Darklight_Evoker_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Darklight_Evoker_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Darklight_Evoker_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Darklight_Evoker_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Death Herald Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Death_Herald_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Death_Herald_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Death_Herald_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Death_Herald_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Death_Herald_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Death_Herald_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Death_Herald_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Death_Herald_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Doom Knight Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Doom_Knight_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Doom_Knight_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Doom_Knight_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Doom_Knight_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Doom_Knight_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Doom_Knight_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Doom_Knight_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Doom_Knight_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Dragon Knight Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Dragon_Knight_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dragon_Knight_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dragon_Knight_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dragon_Knight_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Dragon_Knight_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Dragon_Knight_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Dragon_Knight_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Dragon_Knight_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Entrepreneur Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Entrepreneur_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Entrepreneur_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Entrepreneur_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Entrepreneur_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Entrepreneur_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Entrepreneur_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Entrepreneur_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Entrepreneur_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Evoker Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Evoker_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Evoker_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Evoker_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Evoker_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Evoker_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Evoker_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Evoker_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Evoker_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Fencer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Fencer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Fencer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Fencer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fencer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Fencer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Fencer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Fencer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Fencer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Field Surgeon Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Field_Surgeon_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Field_Surgeon_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Field_Surgeon_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Field_Surgeon_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Field_Surgeon_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Field_Surgeon_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Field_Surgeon_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Field_Surgeon_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Flamefury Mage Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Flamefury_Mage_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Flamefury_Mage_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Flamefury_Mage_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Flamefury_Mage_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Flamefury_Mage_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Flamefury_Mage_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Flamefury_Mage_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Flamefury_Mage_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Forest Warden Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Forest_Warden_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Forest_Warden_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Forest_Warden_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Forest_Warden_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Forest_Warden_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Forest_Warden_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Forest_Warden_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Forest_Warden_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Frost Tracer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Frost_Tracer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Frost_Tracer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Frost_Tracer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Frost_Tracer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Frost_Tracer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Frost_Tracer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Frost_Tracer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Frost_Tracer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Ghost Blade Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Ghost_Blade_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Ghost_Blade_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Ghost_Blade_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ghost_Blade_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Ghost_Blade_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Ghost_Blade_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Ghost_Blade_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ghost_Blade_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Grove Keeper Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Grove_Keeper_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Grove_Keeper_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Grove_Keeper_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Grove_Keeper_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Grove_Keeper_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Grove_Keeper_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Grove_Keeper_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Grove_Keeper_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Guidon Bearer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Guidon_Bearer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Guidon_Bearer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Guidon_Bearer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Guidon_Bearer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Guidon_Bearer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Guidon_Bearer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Guidon_Bearer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Guidon_Bearer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Herbalist Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Herbalist_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Herbalist_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Herbalist_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Herbalist_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Herbalist_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Herbalist_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Herbalist_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Herbalist_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Herder Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Herder_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Herder_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Herder_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Herder_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Herder_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Herder_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Herder_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Herder_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Jouster Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Jouster_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Jouster_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Jouster_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Jouster_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Jouster_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Jouster_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Jouster_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Jouster_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Lupine Warden Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Lupine_Warden_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Lupine_Warden_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Lupine_Warden_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Lupine_Warden_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Lupine_Warden_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Lupine_Warden_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Lupine_Warden_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Lupine_Warden_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Martial Artist Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Martial_Artist_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Martial_Artist_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Martial_Artist_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Martial_Artist_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Martial_Artist_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Martial_Artist_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Martial_Artist_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Martial_Artist_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Mercenary Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Mercenary_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Mercenary_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Mercenary_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Mercenary_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Mercenary_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Mercenary_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Mercenary_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Mercenary_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Merry Garb Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Merry_Garb_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Merry_Garb_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Merry_Garb_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Merry_Garb_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Merry_Garb_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Merry_Garb_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Merry_Garb_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Merry_Garb_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Moth Cape Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Moth_Cape_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Moth_Cape_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Moth_Cape_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Moth_Cape_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Moth_Cape_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Moth_Cape_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Moth_Cape_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Moth_Cape_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Necromancer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Necromancer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Necromancer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Necromancer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Necromancer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Necromancer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Necromancer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Necromancer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Necromancer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Nordic Chieftain Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Nordic_Chieftain_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Nordic_Chieftain_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Nordic_Chieftain_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nordic_Chieftain_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Nordic_Chieftain_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Nordic_Chieftain_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Nordic_Chieftain_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Nordic_Chieftain_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Owl Keeper Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Owl_Keeper_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Owl_Keeper_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Owl_Keeper_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Owl_Keeper_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Owl_Keeper_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Owl_Keeper_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Owl_Keeper_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Owl_Keeper_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Pharaoh Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Pharaoh_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Pharaoh_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Pharaoh_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pharaoh_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Pharaoh_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Pharaoh_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Pharaoh_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pharaoh_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Philosopher Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Philosopher_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Philosopher_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Philosopher_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Philosopher_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Philosopher_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Philosopher_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Philosopher_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Philosopher_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Phoenix Evoker Outfit',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Phoenix_Evoker_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Phoenix_Evoker_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Phoenix_Evoker_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Phoenix_Evoker_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Phoenix_Evoker_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Phoenix_Evoker_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Phoenix_Evoker_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Phoenix_Evoker_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Pumpkin Mummy Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Pumpkin_Mummy_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Puppeteer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Puppeteer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Puppeteer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Puppeteer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Puppeteer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Puppeteer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Puppeteer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Puppeteer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Puppeteer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Ranger Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Ranger_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Ranger_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Ranger_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ranger_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Ranger_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Ranger_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Ranger_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Ranger_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Retro Citizen Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Citizen_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Citizen_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Hunter Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Hunter_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Hunter_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Knight Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Knight_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Knight_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Mage Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Mage_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Mage_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Nobleman Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Nobleman_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Nobleman_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Summoner Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Summoner_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Summoner_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Retro Warrior Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Warrior_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Retro_Warrior_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Royal Pumpkin Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Royal_Pumpkin_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Pumpkin_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Pumpkin_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Pumpkin_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Royal_Pumpkin_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Royal_Pumpkin_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Royal_Pumpkin_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Royal_Pumpkin_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Rune Master Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Rune_Master_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Rune_Master_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Rune_Master_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rune_Master_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Rune_Master_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Rune_Master_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Rune_Master_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Rune_Master_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Sea Dog Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Sea_Dog_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Sea_Dog_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Sea_Dog_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sea_Dog_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Sea_Dog_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Sea_Dog_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Sea_Dog_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sea_Dog_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Seaweaver Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Seaweaver_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Seaweaver_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Seaweaver_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Seaweaver_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Seaweaver_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Seaweaver_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Seaweaver_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Seaweaver_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Shadowlotus Disciple Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit:
          '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Shadowlotus_Disciple_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Siege Master Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Siege_Master_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Siege_Master_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Siege_Master_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Siege_Master_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Siege_Master_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Siege_Master_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Siege_Master_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Siege_Master_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Sinister Archer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Sinister_Archer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Sinister_Archer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Sinister_Archer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sinister_Archer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Sinister_Archer_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Sinister_Archer_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Sinister_Archer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sinister_Archer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Spirit Caller Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Spirit_Caller_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Spirit_Caller_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Spirit_Caller_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Spirit_Caller_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Spirit_Caller_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Spirit_Caller_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Spirit_Caller_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Spirit_Caller_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Sun Priest Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Sun_Priest_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Sun_Priest_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Sun_Priest_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sun_Priest_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Sun_Priest_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Sun_Priest_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Sun_Priest_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Sun_Priest_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Trailblazer Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Trailblazer_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Trailblazer_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Trailblazer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Trailblazer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Trailblazer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Trailblazer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Trailblazer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Trailblazer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Trophy Hunter Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Trophy_Hunter_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Trophy_Hunter_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Trophy_Hunter_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Trophy_Hunter_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Trophy_Hunter_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Trophy_Hunter_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Trophy_Hunter_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Trophy_Hunter_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Veteran Paladin Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Veteran_Paladin_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Veteran_Paladin_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Veteran_Paladin_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Veteran_Paladin_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Veteran_Paladin_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Veteran_Paladin_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Veteran_Paladin_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Veteran_Paladin_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Void Master Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Void_Master_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Void_Master_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Void_Master_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Void_Master_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Void_Master_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Void_Master_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Void_Master_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Void_Master_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Winged Druid Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Winged_Druid_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Winged_Druid_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Winged_Druid_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Winged_Druid_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Winged_Druid_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Winged_Druid_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Winged_Druid_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Winged_Druid_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Winter Warden Outfits',
    type: 'Store',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Winter_Warden_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Winter_Warden_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Winter_Warden_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Winter_Warden_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Winter_Warden_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Winter_Warden_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Winter_Warden_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Winter_Warden_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Gamemaster Outfits',
    type: 'Event',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Gamemaster_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Gamemaster_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },
  {
    name: 'Jersey Outfits',
    type: 'Event',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Jersey_Female.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Jersey_Male.gif',
        addon_1: null,
        addon_2: null,
        full: null,
      },
    },
  },

  {
    name: 'Falconer Outfits',
    type: 'Hunting Task',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Falconer_Female.gif',
        addon_1: '/uploads/system/outfits/Outfit_Falconer_Female_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Falconer_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Falconer_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Falconer_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Falconer_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Falconer_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Falconer_Male_Addon_3.gif',
      },
    },
  },
  {
    name: 'Feral Trapper Outfits',
    type: 'Hunting Task',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Feral_Trapper_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Feral_Trapper_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Feral_Trapper_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Feral_Trapper_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Feral_Trapper_Male.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Feral_Trapper_Male_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Feral_Trapper_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Feral_Trapper_Male_Addon_3.gif',
      },
    },
  },

  {
    name: 'Lion of War Outfits',
    type: 'Tibiadrome',
    gender: {
      female: {
        outfit: '/uploads/system/outfits/Outfit_Lion_of_War_Female.gif',
        addon_1:
          '/uploads/system/outfits/Outfit_Lion_of_War_Female_Addon_1.gif',
        addon_2:
          '/uploads/system/outfits/Outfit_Lion_of_War_Female_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Lion_of_War_Female_Addon_3.gif',
      },
      male: {
        outfit: '/uploads/system/outfits/Outfit_Lion_of_War_Male.gif',
        addon_1: '/uploads/system/outfits/Outfit_Lion_of_War_Male_Addon_1.gif',
        addon_2: '/uploads/system/outfits/Outfit_Lion_of_War_Male_Addon_2.gif',
        full: '/uploads/system/outfits/Outfit_Lion_of_War_Male_Addon_3.gif',
      },
    },
  },
];

const charms: {
  name: string;
  image: string;
  type: CharmType;
  description: string;
}[] = [
  {
    name: 'Carnage',
    image: '/uploads/system/charms/Carnage_Icon.gif',
    type: 'MAJOR',
    description:
      'Matando uma criatura tem a chance de 10% - 20% - 22% causar 15% de Physical Damage em uma área em volta da criatura, baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Curse',
    image: '/uploads/system/charms/Curse_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque amaldiçoa a criatura e tem 5% - 10% - 11% de chance de causar 5% de Death Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Divine Wrath',
    image: '/uploads/system/charms/Divine_Wrath_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque tem 5% - 10% - 11% de chance de causar 5% de Holy Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Dodge',
    image: '/uploads/system/charms/Dodge_Icon.gif',
    type: 'MAJOR',
    description:
      'Esquiva de um ataque, com 5% - 10% - 11% chance, sem sofrer nenhum dano.',
  },
  {
    name: 'Enflame',
    image: '/uploads/system/charms/Enflame_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque queima a criatura e tem 5% - 10% - 11% de chance de causar 5% de Fire Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Freeze',
    image: '/uploads/system/charms/Freeze_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque congela a criatura e tem 5% - 10% - 11% de chance de causar 5% de Ice Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Low Blow',
    image: '/uploads/system/charms/Low_Blow_Icon.gif',
    type: 'MAJOR',
    description:
      'Adiciona 4% - 8% - 9% de chance de ataque crítico em ataques com armas críticas na criatura escolhida.',
  },
  {
    name: 'Overpower',
    image: '/uploads/system/charms/Overpower_Icon.gif',
    type: 'MAJOR',
    description:
      'Seus ataques tem chance de 5% - 10% - 11% causar um dano de até 5% de dano baseado na vida total do seu personagem, limitado a 8% da vida total da criatura selecionada.',
  },
  {
    name: 'Overflux',
    image: '/uploads/system/charms/Overflux_Icon.gif',
    type: 'MAJOR',
    description:
      'Seus ataques tem chance de 5% - 10% - 11% causar um dano de até 2.5% de dano baseado na mana total do seu personagem, limitado a 8% da vida total da criatura selecionada.',
  },
  {
    name: 'Parry',
    image: '/uploads/system/charms/Parry_Icon.gif',
    type: 'MAJOR',
    description:
      'Qualquer dano recebido é refletido para o agressor com 5% - 10% - 11% de chance. A resistência do monstro/criatura é ignorada, somente a armadura é levada em consideração.',
  },
  {
    name: 'Poison',
    image: '/uploads/system/charms/Poison_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque envenena a criatura e tem 5% - 10% - 11% de chance de causar 5% de Earth Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Savage Blow',
    image: '/uploads/system/charms/Savage_Blow_Icon.gif',
    type: 'MAJOR',
    description:
      'Adiciona 20% - 40% - 44% de dano crítico extra em ataques com armas críticas.',
  },
  {
    name: 'Wound',
    image: '/uploads/system/charms/Wound_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque fere a criatura e tem 5% - 10% - 11% de chance de causar 5% de Physical Damage baseado na vida total da criatura selecionada.',
  },
  {
    name: 'Zap',
    image: '/uploads/system/charms/Zap_Icon.gif',
    type: 'MAJOR',
    description:
      'Seu ataque eletrocuta a criatura e tem 5% - 10% - 11% de chance de causar 5% de Energy Damage baseado na vida total da criatura selecionada.',
  },

  {
    name: 'Adrenaline Burst',
    image: '/uploads/system/charms/Adrenaline_Burst_Icon.gif',
    type: 'MINOR',
    description:
      'Após receber um ataque, explosões de adrenalina aumentam seus reflexos, com 6% - 9% - 12% de chance e permitem que você se mova 150% mais rápido por 10 segundos.',
  },
  {
    name: 'Bless',
    image: '/uploads/system/charms/Bless_Icon.gif',
    type: 'MINOR',
    description:
      'Abençoe você e reduz a perda de skills e experiência em 6% - 9% - 12% quando é morto pela criatura escolhida.',
  },
  {
    name: 'Cleanse',
    image: '/uploads/system/charms/Cleanse_Icon.gif',
    type: 'MINOR',
    description:
      'Após receber um ataque, com 6% - 9% - 12% de chance, você elimina uma condição especial aleatória e por 11 segundos o torna imune contra ela.',
  },
  {
    name: 'Cripple',
    image: '/uploads/system/charms/Cripple_Icon.gif',
    type: 'MINOR',
    description:
      'Debilita a criatura com 6% - 9% - 12% chance e paralisa o alvo por 10 segundos.',
  },
  {
    name: 'Gut',
    image: '/uploads/system/charms/Gut_Icon.gif',
    type: 'MINOR',
    description:
      'Força a criatura a produzir 6% - 9% - 12% mais Produtos de Criaturas.',
  },
  {
    name: 'Numb',
    image: '/uploads/system/charms/Numb_Icon.gif',
    type: 'MINOR',
    description:
      'Após receber um ataque, com 6% - 9% - 12% de chance, você paralisa a criatura por 10 segundos.',
  },
  {
    name: 'Scavenge',
    image: '/uploads/system/charms/Scavenge_Icon.gif',
    type: 'MINOR',
    description:
      'Melhora em 60% - 90% - 120% suas chances de Skinning/Dusting em criaturas que permitem esta ação.',
  },
  {
    name: 'Fatal Hold',
    image: '/uploads/system/charms/Fatal_Hold_Icon.gif',
    type: 'MINOR',
    description:
      'Seus ataques tem 30% - 45% - 60% de prevenir que a criatura fuja com vida baixa por 30 segundos.',
  },
  {
    name: 'Vampiric Embrace',
    image: '/uploads/system/charms/Vampiric_Embrace_Icon.gif',
    type: 'MINOR',
    description:
      'Aumenta em 1.6% - 2.4% - 3.2% o Life Leech se estiver usando equipamentos que possuam essa função.',
  },
  {
    name: 'Void Inversion',
    image: '/uploads/system/charms/Void_Inversion_Icon.gif',
    type: 'MINOR',
    description:
      '20% - 30% - 40% de chance de ganhar mana do que perder em ataques de Mana Drain.',
  },
  {
    name: "Void's Call",
    image: '/uploads/system/charms/Voids_Call_Icon.gif',
    type: 'MINOR',
    description:
      'Aumenta em 0.8% - 1.2% - 1.6% o Mana Leech se estiver usando equipamentos que possuam essa função.',
  },
];

const mounts: {
  name: string;
  speed: number;
  image: string;
}[] = [
  {
    name: 'Alpha Demonosaur',
    speed: 10,
    image: '/uploads/system/mounts/Alpha_Demonosaur.gif',
  },
  {
    name: 'Antelope',
    speed: 10,
    image: '/uploads/system/mounts/Antelope.gif',
  },
  {
    name: 'Arctic Unicorn',
    speed: 10,
    image: '/uploads/system/mounts/Arctic_Unicorn.gif',
  },
  {
    name: 'Armoured War Horse',
    speed: 10,
    image: '/uploads/system/mounts/Armoured_War_Horse.gif',
  },
  {
    name: 'Ashen Coast Predator',
    speed: 10,
    image: '/uploads/system/mounts/Ashen_Coast_Predator.gif',
  },
  {
    name: 'Azudocus',
    speed: 10,
    image: '/uploads/system/mounts/Azudocus.gif',
  },
  {
    name: 'Batcat',
    speed: 10,
    image: '/uploads/system/mounts/Batcat.gif',
  },
  {
    name: 'Battle Badger',
    speed: 10,
    image: '/uploads/system/mounts/Battle_Badger.gif',
  },
  {
    name: 'Battle Werewolf',
    speed: 10,
    image: '/uploads/system/mounts/Battle_Werewolf.gif',
  },
  {
    name: 'Battlefrazzle',
    speed: 10,
    image: '/uploads/system/mounts/Battlefrazzle.gif',
  },
  {
    name: 'Benevolent Coral Rhea',
    speed: 10,
    image: '/uploads/system/mounts/Benevolent_Coral_Rhea.gif',
  },
  {
    name: 'Benevolent Eventide Nandu',
    speed: 10,
    image: '/uploads/system/mounts/Benevolent_Eventide_Nandu.gif',
  },
  {
    name: 'Benevolent Savanna Ostrich',
    speed: 10,
    image: '/uploads/system/mounts/Benevolent_Savanna_Ostrich.gif',
  },
  {
    name: 'Black Sheep (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Black_Sheep_(Mount).gif',
  },
  {
    name: 'Black Stag',
    speed: 10,
    image: '/uploads/system/mounts/Black_Stag.gif',
  },
  {
    name: 'Blackpelt',
    speed: 10,
    image: '/uploads/system/mounts/Blackpelt.gif',
  },
  {
    name: 'Blazebringer',
    speed: 10,
    image: '/uploads/system/mounts/Blazebringer.gif',
  },
  {
    name: 'Blazing Unicorn',
    speed: 10,
    image: '/uploads/system/mounts/Blazing_Unicorn.gif',
  },
  {
    name: 'Bloodcurl',
    speed: 10,
    image: '/uploads/system/mounts/Bloodcurl.gif',
  },
  {
    name: 'Blue Rolling Barrel',
    speed: 10,
    image: '/uploads/system/mounts/Blue_Rolling_Barrel.gif',
  },
  {
    name: 'Bog Tyrant',
    speed: 10,
    image: '/uploads/system/mounts/Bog_Tyrant.gif',
  },
  {
    name: 'Bogwurm',
    speed: 10,
    image: '/uploads/system/mounts/Bogwurm.gif',
  },
  {
    name: 'Boisterous Bull',
    speed: 10,
    image: '/uploads/system/mounts/Boisterous_Bull.gif',
  },
  {
    name: 'Boreal Owl',
    speed: 10,
    image: '/uploads/system/mounts/Boreal_Owl.gif',
  },
  {
    name: 'Brass Speckled Koi',
    speed: 10,
    image: '/uploads/system/mounts/Brass_Speckled_Koi.gif',
  },
  {
    name: 'Bright Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Bright_Percht_Sleigh.gif',
  },
  {
    name: 'Bright Percht Sleigh Variant',
    speed: 10,
    image: '/uploads/system/mounts/Bright_Percht_Sleigh_Variant.gif',
  },
  {
    name: 'Bumblebee',
    speed: 10,
    image: '/uploads/system/mounts/Bumblebee.gif',
  },
  {
    name: 'Bunny Dray',
    speed: 10,
    image: '/uploads/system/mounts/Bunny_Dray.gif',
  },
  {
    name: 'Caped Snowman',
    speed: 10,
    image: '/uploads/system/mounts/Caped_Snowman.gif',
  },
  {
    name: 'Carpacosaurus',
    speed: 10,
    image: '/uploads/system/mounts/Carpacosaurus.gif',
  },
  {
    name: 'Cave Tarantula',
    speed: 10,
    image: '/uploads/system/mounts/Cave_Tarantula.gif',
  },
  {
    name: 'Cerberus Champion',
    speed: 10,
    image: '/uploads/system/mounts/Cerberus_Champion.gif',
  },
  {
    name: 'Cinderhoof',
    speed: 10,
    image: '/uploads/system/mounts/Cinderhoof.gif',
  },
  {
    name: 'Cinnamon Ibex',
    speed: 10,
    image: '/uploads/system/mounts/Cinnamon_Ibex.gif',
  },
  {
    name: 'Cold Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Cold_Percht_Sleigh.gif',
  },
  {
    name: 'Cold Percht Sleigh Variant',
    speed: 10,
    image: '/uploads/system/mounts/Cold_Percht_Sleigh_Variant.gif',
  },
  {
    name: 'Cony Cart',
    speed: 10,
    image: '/uploads/system/mounts/Cony_Cart.gif',
  },
  {
    name: 'Copper Fly',
    speed: 10,
    image: '/uploads/system/mounts/Copper_Fly.gif',
  },
  {
    name: 'Coral Rhea',
    speed: 10,
    image: '/uploads/system/mounts/Coral_Rhea.gif',
  },
  {
    name: 'Coralripper',
    speed: 10,
    image: '/uploads/system/mounts/Coralripper.gif',
  },
  {
    name: 'Corpse Phoenix',
    speed: 10,
    image: '/uploads/system/mounts/Corpse_Phoenix.gif',
  },
  {
    name: 'Corpsefire Skull',
    speed: 10,
    image: '/uploads/system/mounts/Corpsefire_Skull.gif',
  },
  {
    name: 'Cranium Spider',
    speed: 10,
    image: '/uploads/system/mounts/Cranium_Spider.gif',
  },
  {
    name: 'Crimson Bay Predator',
    speed: 10,
    image: '/uploads/system/mounts/Crimson_Bay_Predator.gif',
  },
  {
    name: 'Crimson Fang',
    speed: 10,
    image: '/uploads/system/mounts/Crimson_Fang.gif',
  },
  {
    name: 'Crimson Ray',
    speed: 10,
    image: '/uploads/system/mounts/Crimson_Ray.gif',
  },
  {
    name: 'Crystal Wolf (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Crystal_Wolf_(Mount).gif',
  },
  {
    name: 'Cunning Hyaena',
    speed: 10,
    image: '/uploads/system/mounts/Cunning_Hyaena.gif',
  },
  {
    name: 'Dandelion',
    speed: 10,
    image: '/uploads/system/mounts/Dandelion.gif',
  },
  {
    name: 'Dark Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Dark_Percht_Sleigh.gif',
  },
  {
    name: 'Dark Percht Sleigh Variant',
    speed: 10,
    image: '/uploads/system/mounts/Dark_Percht_Sleigh_Variant.gif',
  },
  {
    name: 'Darkfire Devourer',
    speed: 10,
    image: '/uploads/system/mounts/Darkfire_Devourer.gif',
  },
  {
    name: 'Dawn Strayer',
    speed: 10,
    image: '/uploads/system/mounts/Dawn_Strayer.gif',
  },
  {
    name: 'Dawnbringer Pegasus',
    speed: 10,
    image: '/uploads/system/mounts/Dawnbringer_Pegasus.gif',
  },
  {
    name: 'Death Crawler',
    speed: 10,
    image: '/uploads/system/mounts/Death_Crawler.gif',
  },
  {
    name: 'Death Phoenix',
    speed: 10,
    image: '/uploads/system/mounts/Death_Phoenix.gif',
  },
  {
    name: 'Desert King',
    speed: 10,
    image: '/uploads/system/mounts/Desert_King.gif',
  },
  {
    name: 'Donkey',
    speed: 10,
    image: '/uploads/system/mounts/Donkey.gif',
  },
  {
    name: 'Doom Skull',
    speed: 10,
    image: '/uploads/system/mounts/Doom_Skull.gif',
  },
  {
    name: 'Doombringer',
    speed: 10,
    image: '/uploads/system/mounts/Doombringer.gif',
  },
  {
    name: 'Dragonling (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Dragonling_(Mount).gif',
  },
  {
    name: 'Draptor (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Draptor_(Mount).gif',
  },
  {
    name: 'Dreadhare',
    speed: 10,
    image: '/uploads/system/mounts/Dreadhare.gif',
  },
  {
    name: 'Dromedary (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Dromedary_(Mount).gif',
  },
  {
    name: 'Dusk Pryer',
    speed: 10,
    image: '/uploads/system/mounts/Dusk_Pryer.gif',
  },
  {
    name: 'Ebony Tiger',
    speed: 10,
    image: '/uploads/system/mounts/Ebony_Tiger.gif',
  },
  {
    name: 'Ember Saurian',
    speed: 10,
    image: '/uploads/system/mounts/Ember_Saurian.gif',
  },
  {
    name: 'Emerald Raven',
    speed: 10,
    image: '/uploads/system/mounts/Emerald_Raven.gif',
  },
  {
    name: 'Emerald Sphinx',
    speed: 10,
    image: '/uploads/system/mounts/Emerald_Sphinx.gif',
  },
  {
    name: 'Emerald Waccoon',
    speed: 10,
    image: '/uploads/system/mounts/Emerald_Waccoon.gif',
  },
  {
    name: 'Emperor Deer',
    speed: 10,
    image: '/uploads/system/mounts/Emperor_Deer.gif',
  },
  {
    name: 'Ether Badger',
    speed: 10,
    image: '/uploads/system/mounts/Ether_Badger.gif',
  },
  {
    name: 'Eventide Nandu',
    speed: 10,
    image: '/uploads/system/mounts/Eventide_Nandu.gif',
  },
  {
    name: 'Feral Tiger',
    speed: 10,
    image: '/uploads/system/mounts/Feral_Tiger.gif',
  },
  {
    name: 'Festive Mammoth',
    speed: 10,
    image: '/uploads/system/mounts/Festive_Mammoth.gif',
  },
  {
    name: 'Festive Snowman',
    speed: 10,
    image: '/uploads/system/mounts/Festive_Snowman.gif',
  },
  {
    name: 'Finished Bright Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Finished_Bright_Percht_Sleigh.gif',
  },
  {
    name: 'Finished Cold Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Finished_Cold_Percht_Sleigh.gif',
  },
  {
    name: 'Finished Dark Percht Sleigh',
    speed: 10,
    image: '/uploads/system/mounts/Finished_Dark_Percht_Sleigh.gif',
  },
  {
    name: 'Flame Bear',
    speed: 10,
    image: '/uploads/system/mounts/Flame_Bear.gif',
  },
  {
    name: 'Flamesteed',
    speed: 10,
    image: '/uploads/system/mounts/Flamesteed.gif',
  },
  {
    name: 'Fleeting Knowledge',
    speed: 10,
    image: '/uploads/system/mounts/Fleeting_Knowledge.gif',
  },
  {
    name: 'Flitterkatzen',
    speed: 10,
    image: '/uploads/system/mounts/Flitterkatzen.gif',
  },
  {
    name: 'Floating Augur',
    speed: 10,
    image: '/uploads/system/mounts/Floating_Augur.gif',
  },
  {
    name: 'Floating Kashmir',
    speed: 10,
    image: '/uploads/system/mounts/Floating_Kashmir.gif',
  },
  {
    name: 'Floating Sage',
    speed: 10,
    image: '/uploads/system/mounts/Floating_Sage.gif',
  },
  {
    name: 'Floating Scholar',
    speed: 10,
    image: '/uploads/system/mounts/Floating_Scholar.gif',
  },
  {
    name: 'Flying Divan',
    speed: 10,
    image: '/uploads/system/mounts/Flying_Divan.gif',
  },
  {
    name: 'Foxmouse (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Foxmouse_(Mount).gif',
  },
  {
    name: 'Frostbringer',
    speed: 10,
    image: '/uploads/system/mounts/Frostbringer.gif',
  },
  {
    name: 'Frostflare',
    speed: 10,
    image: '/uploads/system/mounts/Frostflare.gif',
  },
  {
    name: 'Giant Beaver (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Giant_Beaver_(Mount).gif',
  },
  {
    name: 'Glacier Vagabond',
    speed: 10,
    image: '/uploads/system/mounts/Glacier_Vagabond.gif',
  },
  {
    name: 'Glacier Wyrm',
    speed: 10,
    image: '/uploads/system/mounts/Glacier_Wyrm.gif',
  },
  {
    name: 'Gloom Maw (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Gloom_Maw_(Mount).gif',
  },
  {
    name: 'Gloom Widow',
    speed: 10,
    image: '/uploads/system/mounts/Gloom_Widow.gif',
  },
  {
    name: 'Gloomwurm',
    speed: 10,
    image: '/uploads/system/mounts/Gloomwurm.gif',
  },
  {
    name: 'Glooth Glider',
    speed: 10,
    image: '/uploads/system/mounts/Glooth_Glider.gif',
  },
  {
    name: 'Gloothomotive',
    speed: 10,
    image: '/uploads/system/mounts/Gloothomotive.gif',
  },
  {
    name: 'Gnarlhound (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Gnarlhound_(Mount).gif',
  },
  {
    name: 'Gold Sphinx',
    speed: 10,
    image: '/uploads/system/mounts/Gold_Sphinx.gif',
  },
  {
    name: 'Golden Dragonfly',
    speed: 10,
    image: '/uploads/system/mounts/Golden_Dragonfly.gif',
  },
  {
    name: 'Gorgon Hydra',
    speed: 10,
    image: '/uploads/system/mounts/Gorgon_Hydra.gif',
  },
  {
    name: 'Gorongra',
    speed: 10,
    image: '/uploads/system/mounts/Gorongra.gif',
  },
  {
    name: 'Green Rolling Barrel',
    speed: 10,
    image: '/uploads/system/mounts/Green_Rolling_Barrel.gif',
  },
  {
    name: 'Gryphon (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Gryphon_(Mount).gif',
  },
  {
    name: 'Guardian Lion',
    speed: 10,
    image: '/uploads/system/mounts/Guardian_Lion.gif',
  },
  {
    name: 'Hailstorm Fury',
    speed: 10,
    image: '/uploads/system/mounts/Hailstorm_Fury.gif',
  },
  {
    name: 'Haze',
    speed: 10,
    image: '/uploads/system/mounts/Haze.gif',
  },
  {
    name: 'Hell Demonosaur',
    speed: 10,
    image: '/uploads/system/mounts/Hell_Demonosaur.gif',
  },
  {
    name: 'Hibernal Moth (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Hibernal_Moth_(Mount).gif',
  },
  {
    name: 'Highland Yak',
    speed: 10,
    image: '/uploads/system/mounts/Highland_Yak.gif',
  },
  {
    name: 'Holiday Mammoth',
    speed: 10,
    image: '/uploads/system/mounts/Holiday_Mammoth.gif',
  },
  {
    name: 'Hyacinth',
    speed: 10,
    image: '/uploads/system/mounts/Hyacinth.gif',
  },
  {
    name: 'Icebreacher',
    speed: 10,
    image: '/uploads/system/mounts/Icebreacher.gif',
  },
  {
    name: 'Ink Spotted Koi',
    speed: 10,
    image: '/uploads/system/mounts/Ink_Spotted_Koi.gif',
  },
  {
    name: 'Ironblight (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Ironblight_(Mount).gif',
  },
  {
    name: 'Ivory Fang',
    speed: 10,
    image: '/uploads/system/mounts/Ivory_Fang.gif',
  },
  {
    name: 'Jackalope',
    speed: 10,
    image: '/uploads/system/mounts/Jackalope.gif',
  },
  {
    name: 'Jade Lion',
    speed: 10,
    image: '/uploads/system/mounts/Jade_Lion.gif',
  },
  {
    name: 'Jade Pincer',
    speed: 10,
    image: '/uploads/system/mounts/Jade_Pincer.gif',
  },
  {
    name: 'Jade Shrine',
    speed: 10,
    image: '/uploads/system/mounts/Jade_Shrine.gif',
  },
  {
    name: 'Jaracal (Montaria)',
    speed: 10,
    image: '/uploads/system/mounts/Jaracal_(Montaria).gif',
  },
  {
    name: 'Jousting Eagle',
    speed: 10,
    image: '/uploads/system/mounts/Jousting_Eagle.gif',
  },
  {
    name: 'Jousting Horse',
    speed: 10,
    image: '/uploads/system/mounts/Jousting_Horse.gif',
  },
  {
    name: 'Jungle Saurian',
    speed: 10,
    image: '/uploads/system/mounts/Jungle_Saurian.gif',
  },
  {
    name: 'Jungle Tiger',
    speed: 10,
    image: '/uploads/system/mounts/Jungle_Tiger.gif',
  },
  {
    name: 'Kingly Deer',
    speed: 10,
    image: '/uploads/system/mounts/Kingly_Deer.gif',
  },
  {
    name: 'Krakoloss',
    speed: 10,
    image: '/uploads/system/mounts/Krakoloss.gif',
  },
  {
    name: 'Lacewing Moth (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Lacewing_Moth_(Mount).gif',
  },
  {
    name: 'Ladybug (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Ladybug_(Mount).gif',
  },
  {
    name: 'Lagoon Saurian',
    speed: 10,
    image: '/uploads/system/mounts/Lagoon_Saurian.gif',
  },
  {
    name: 'Leaf Locust',
    speed: 10,
    image: '/uploads/system/mounts/Leaf_Locust.gif',
  },
  {
    name: 'Leafscuttler',
    speed: 10,
    image: '/uploads/system/mounts/Leafscuttler.gif',
  },
  {
    name: 'Magic Carpet (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Magic_Carpet_(Mount).gif',
  },
  {
    name: 'Magma Crawler (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Magma_Crawler_(Mount).gif',
  },
  {
    name: 'Magma Skull',
    speed: 10,
    image: '/uploads/system/mounts/Magma_Skull.gif',
  },
  {
    name: 'Manta Ray (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Manta_Ray_(Mount).gif',
  },
  {
    name: 'Marsh Toad',
    speed: 10,
    image: '/uploads/system/mounts/Marsh_Toad.gif',
  },
  {
    name: 'Merry Mammoth',
    speed: 10,
    image: '/uploads/system/mounts/Merry_Mammoth.gif',
  },
  {
    name: 'Midnight Panther (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Midnight_Panther_(Mount).gif',
  },
  {
    name: 'Mint Ibex',
    speed: 10,
    image: '/uploads/system/mounts/Mint_Ibex.gif',
  },
  {
    name: 'Mole (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Mole_(Mount).gif',
  },
  {
    name: 'Mould Shell',
    speed: 10,
    image: '/uploads/system/mounts/Mould_Shell.gif',
  },
  {
    name: 'Mouldpincer',
    speed: 10,
    image: '/uploads/system/mounts/Mouldpincer.gif',
  },
  {
    name: 'Muffled Snowman',
    speed: 10,
    image: '/uploads/system/mounts/Muffled_Snowman.gif',
  },
  {
    name: 'Mutated Abomination (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Mutated_Abomination_(Mount).gif',
  },
  {
    name: 'Mystic Jaguar (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Mystic_Jaguar_(Mount).gif',
  },
  {
    name: 'Mystic Raven',
    speed: 10,
    image: '/uploads/system/mounts/Mystic_Raven.gif',
  },
  {
    name: 'Neon Sparkid',
    speed: 10,
    image: '/uploads/system/mounts/Neon_Sparkid.gif',
  },
  {
    name: 'Nethersteed',
    speed: 10,
    image: '/uploads/system/mounts/Nethersteed.gif',
  },
  {
    name: 'Night Locust',
    speed: 10,
    image: '/uploads/system/mounts/Night_Locust.gif',
  },
  {
    name: 'Night Waccoon',
    speed: 10,
    image: '/uploads/system/mounts/Night_Waccoon.gif',
  },
  {
    name: 'Nightdweller',
    speed: 10,
    image: '/uploads/system/mounts/Nightdweller.gif',
  },
  {
    name: 'Nightmarish Crocovile',
    speed: 10,
    image: '/uploads/system/mounts/Nightmarish_Crocovile.gif',
  },
  {
    name: 'Nightstinger',
    speed: 10,
    image: '/uploads/system/mounts/Nightstinger.gif',
  },
  {
    name: 'Noble Lion (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Noble_Lion_(Mount).gif',
  },
  {
    name: 'Noctungra',
    speed: 10,
    image: '/uploads/system/mounts/Noctungra.gif',
  },
  {
    name: 'Obsidian Shrine',
    speed: 10,
    image: '/uploads/system/mounts/Obsidian_Shrine.gif',
  },
  {
    name: 'Obstinate Ox',
    speed: 10,
    image: '/uploads/system/mounts/Obstinate_Ox.gif',
  },
  {
    name: 'Pallbearer',
    speed: 10,
    image: '/uploads/system/mounts/Pallbearer.gif',
  },
  {
    name: 'Parade Horse',
    speed: 10,
    image: '/uploads/system/mounts/Parade_Horse.gif',
  },
  {
    name: 'Pearl Locust',
    speed: 10,
    image: '/uploads/system/mounts/Pearl_Locust.gif',
  },
  {
    name: 'Pegasus',
    speed: 10,
    image: '/uploads/system/mounts/Pegasus.gif',
  },
  {
    name: 'Peony',
    speed: 10,
    image: '/uploads/system/mounts/Peony.gif',
  },
  {
    name: 'Phant (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Phant_(Mount).gif',
  },
  {
    name: 'Phantasmal Jade',
    speed: 10,
    image: '/uploads/system/mounts/Phantasmal_Jade.gif',
  },
  {
    name: 'Platesaurian',
    speed: 10,
    image: '/uploads/system/mounts/Platesaurian.gif',
  },
  {
    name: 'Plumfish',
    speed: 10,
    image: '/uploads/system/mounts/Plumfish.gif',
  },
  {
    name: 'Poisonbane',
    speed: 10,
    image: '/uploads/system/mounts/Poisonbane.gif',
  },
  {
    name: 'Poppy Ibex',
    speed: 10,
    image: '/uploads/system/mounts/Poppy_Ibex.gif',
  },
  {
    name: 'Primal Demonosaur',
    speed: 10,
    image: '/uploads/system/mounts/Primal_Demonosaur.gif',
  },
  {
    name: 'Prismatic Unicorn',
    speed: 10,
    image: '/uploads/system/mounts/Prismatic_Unicorn.gif',
  },
  {
    name: 'Rabbit Rickshaw',
    speed: 10,
    image: '/uploads/system/mounts/Rabbit_Rickshaw.gif',
  },
  {
    name: 'Racing Bird',
    speed: 10,
    image: '/uploads/system/mounts/Racing_Bird.gif',
  },
  {
    name: 'Radiant Nimbus',
    speed: 10,
    image: '/uploads/system/mounts/Radiant_Nimbus.gif',
  },
  {
    name: 'Radiant Raven',
    speed: 10,
    image: '/uploads/system/mounts/Radiant_Raven.gif',
  },
  {
    name: 'Rapid Boar',
    speed: 10,
    image: '/uploads/system/mounts/Rapid_Boar.gif',
  },
  {
    name: 'Razorcreep',
    speed: 10,
    image: '/uploads/system/mounts/Razorcreep.gif',
  },
  {
    name: 'Red Rolling Barrel',
    speed: 10,
    image: '/uploads/system/mounts/Red_Rolling_Barrel.gif',
  },
  {
    name: 'Reed Lurker',
    speed: 10,
    image: '/uploads/system/mounts/Reed_Lurker.gif',
  },
  {
    name: 'Reliable Ram',
    speed: 10,
    image: '/uploads/system/mounts/Reliable_Ram.gif',
  },
  {
    name: 'Rented Horse (Marrom Escuro)',
    speed: 10,
    image: '/uploads/system/mounts/Rented_Horse_(Marrom_Escuro).gif',
  },
  {
    name: 'Rift Runner',
    speed: 10,
    image: '/uploads/system/mounts/Rift_Runner.gif',
  },
  {
    name: 'Rift Watcher',
    speed: 10,
    image: '/uploads/system/mounts/Rift_Watcher.gif',
  },
  {
    name: 'Ringtail Waccoon',
    speed: 10,
    image: '/uploads/system/mounts/Ringtail_Waccoon.gif',
  },
  {
    name: 'Ripptor',
    speed: 10,
    image: '/uploads/system/mounts/Ripptor.gif',
  },
  {
    name: 'River Crocovile',
    speed: 10,
    image: '/uploads/system/mounts/River_Crocovile.gif',
  },
  {
    name: 'Rune Watcher',
    speed: 10,
    image: '/uploads/system/mounts/Rune_Watcher.gif',
  },
  {
    name: 'Rustwurm',
    speed: 10,
    image: '/uploads/system/mounts/Rustwurm.gif',
  },
  {
    name: 'Sanguine Frog',
    speed: 10,
    image: '/uploads/system/mounts/Sanguine_Frog.gif',
  },
  {
    name: 'Satin Moth',
    speed: 10,
    image: '/uploads/system/mounts/Satin_Moth.gif',
  },
  {
    name: 'Savanna Ostrich',
    speed: 10,
    image: '/uploads/system/mounts/Savanna_Ostrich.gif',
  },
  {
    name: 'Scorpion King',
    speed: 10,
    image: '/uploads/system/mounts/Scorpion_King.gif',
  },
  {
    name: 'Scruffy Hyaena',
    speed: 10,
    image: '/uploads/system/mounts/Scruffy_Hyaena.gif',
  },
  {
    name: 'Sea Devil',
    speed: 10,
    image: '/uploads/system/mounts/Sea_Devil.gif',
  },
  {
    name: 'Shadow Claw',
    speed: 10,
    image: '/uploads/system/mounts/Shadow_Claw.gif',
  },
  {
    name: 'Shadow Draptor',
    speed: 10,
    image: '/uploads/system/mounts/Shadow_Draptor.gif',
  },
  {
    name: 'Shadow Hart',
    speed: 10,
    image: '/uploads/system/mounts/Shadow_Hart.gif',
  },
  {
    name: 'Shadow Sphinx',
    speed: 10,
    image: '/uploads/system/mounts/Shadow_Sphinx.gif',
  },
  {
    name: 'Shellodon',
    speed: 10,
    image: '/uploads/system/mounts/Shellodon.gif',
  },
  {
    name: 'Shock Head (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Shock_Head_(Mount).gif',
  },
  {
    name: 'Siegebreaker',
    speed: 10,
    image: '/uploads/system/mounts/Siegebreaker.gif',
  },
  {
    name: 'Silverneck',
    speed: 10,
    image: '/uploads/system/mounts/Silverneck.gif',
  },
  {
    name: 'Singeing Steed',
    speed: 10,
    image: '/uploads/system/mounts/Singeing_Steed.gif',
  },
  {
    name: 'Skybreaker Pegasus',
    speed: 10,
    image: '/uploads/system/mounts/Skybreaker_Pegasus.gif',
  },
  {
    name: 'Slagsnare',
    speed: 10,
    image: '/uploads/system/mounts/Slagsnare.gif',
  },
  {
    name: 'Snow Pelt',
    speed: 10,
    image: '/uploads/system/mounts/Snow_Pelt.gif',
  },
  {
    name: 'Snow Strider',
    speed: 10,
    image: '/uploads/system/mounts/Snow_Strider.gif',
  },
  {
    name: 'Snowy Owl',
    speed: 10,
    image: '/uploads/system/mounts/Snowy_Owl.gif',
  },
  {
    name: 'Soul Phoenix',
    speed: 10,
    image: '/uploads/system/mounts/Soul_Phoenix.gif',
  },
  {
    name: 'Sparkion (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Sparkion_(Mount).gif',
  },
  {
    name: 'Spirit of Purity',
    speed: 10,
    image: '/uploads/system/mounts/Spirit_of_Purity.gif',
  },
  {
    name: 'Stampor (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Stampor_(Mount).gif',
  },
  {
    name: 'Steel Bee',
    speed: 10,
    image: '/uploads/system/mounts/Steel_Bee.gif',
  },
  {
    name: 'Steelbeak',
    speed: 10,
    image: '/uploads/system/mounts/Steelbeak.gif',
  },
  {
    name: 'Stone Rhino (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Stone_Rhino_(Mount).gif',
  },
  {
    name: 'Surly Steer',
    speed: 10,
    image: '/uploads/system/mounts/Surly_Steer.gif',
  },
  {
    name: 'Swamp Crocovile',
    speed: 10,
    image: '/uploads/system/mounts/Swamp_Crocovile.gif',
  },
  {
    name: 'Swamp Snapper',
    speed: 10,
    image: '/uploads/system/mounts/Swamp_Snapper.gif',
  },
  {
    name: 'Tamed Panda',
    speed: 10,
    image: '/uploads/system/mounts/Tamed_Panda.gif',
  },
  {
    name: 'Tangerine Flecked Koi',
    speed: 10,
    image: '/uploads/system/mounts/Tangerine_Flecked_Koi.gif',
  },
  {
    name: 'Tawny Owl',
    speed: 10,
    image: '/uploads/system/mounts/Tawny_Owl.gif',
  },
  {
    name: 'Tempest',
    speed: 10,
    image: '/uploads/system/mounts/Tempest.gif',
  },
  {
    name: 'The Hellgrip',
    speed: 10,
    image: '/uploads/system/mounts/The_Hellgrip.gif',
  },
  {
    name: 'Tidal Seawater Predator',
    speed: 10,
    image: '/uploads/system/mounts/Tidal_Seawater_Predator.gif',
  },
  {
    name: 'Tiger Slug',
    speed: 10,
    image: '/uploads/system/mounts/Tiger_Slug.gif',
  },
  {
    name: 'Tin Lizzard',
    speed: 10,
    image: '/uploads/system/mounts/Tin_Lizzard.gif',
  },
  {
    name: 'Titanica',
    speed: 10,
    image: '/uploads/system/mounts/Titanica.gif',
  },
  {
    name: 'Tombstinger',
    speed: 10,
    image: '/uploads/system/mounts/Tombstinger.gif',
  },
  {
    name: 'Topaz Shrine',
    speed: 10,
    image: '/uploads/system/mounts/Topaz_Shrine.gif',
  },
  {
    name: 'Tourney Horse',
    speed: 10,
    image: '/uploads/system/mounts/Tourney_Horse.gif',
  },
  {
    name: 'Toxic Toad',
    speed: 10,
    image: '/uploads/system/mounts/Toxic_Toad.gif',
  },
  {
    name: 'Tundra Rambler',
    speed: 10,
    image: '/uploads/system/mounts/Tundra_Rambler.gif',
  },
  {
    name: 'Undead Cavebear (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Undead_Cavebear_(Mount).gif',
  },
  {
    name: 'Uniwheel',
    speed: 10,
    image: '/uploads/system/mounts/Uniwheel.gif',
  },
  {
    name: 'Ursagrodon',
    speed: 10,
    image: '/uploads/system/mounts/Ursagrodon.gif',
  },
  {
    name: 'Venompaw',
    speed: 10,
    image: '/uploads/system/mounts/Venompaw.gif',
  },
  {
    name: 'Void Watcher',
    speed: 10,
    image: '/uploads/system/mounts/Void_Watcher.gif',
  },
  {
    name: 'Voracious Hyaena',
    speed: 10,
    image: '/uploads/system/mounts/Voracious_Hyaena.gif',
  },
  {
    name: 'Vortexion',
    speed: 10,
    image: '/uploads/system/mounts/Vortexion.gif',
  },
  {
    name: 'Walker (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Walker_(Mount).gif',
  },
  {
    name: 'War Bear',
    speed: 10,
    image: '/uploads/system/mounts/War_Bear.gif',
  },
  {
    name: 'War Horse',
    speed: 10,
    image: '/uploads/system/mounts/War_Horse.gif',
  },
  {
    name: 'Water Buffalo (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/Water_Buffalo_(Mount).gif',
  },
  {
    name: 'White Lion (Mount)',
    speed: 10,
    image: '/uploads/system/mounts/White_Lion_(Mount).gif',
  },
  {
    name: 'Widow Queen',
    speed: 10,
    image: '/uploads/system/mounts/Widow_Queen.gif',
  },
  {
    name: 'Winter King',
    speed: 10,
    image: '/uploads/system/mounts/Winter_King.gif',
  },
  {
    name: 'Winterstride',
    speed: 10,
    image: '/uploads/system/mounts/Winterstride.gif',
  },
  {
    name: 'Wolpertinger',
    speed: 10,
    image: '/uploads/system/mounts/Wolpertinger.gif',
  },
  {
    name: 'Woodland Prince',
    speed: 10,
    image: '/uploads/system/mounts/Woodland_Prince.gif',
  },
  {
    name: 'Wrathfire Pegasus',
    speed: 10,
    image: '/uploads/system/mounts/Wrathfire_Pegasus.gif',
  },
  {
    name: 'Zaoan Badger',
    speed: 10,
    image: '/uploads/system/mounts/Zaoan_Badger.gif',
  },
];

async function main() {
  if ((await prisma.company.count()) > 0) {
    return;
  }

  return await prisma.$transaction(async (tx) => {
    await tx.module.createMany({
      data: [
        {
          id: 'cmrtkw96v0000iijmuufp65jy',
          code: 'MD-001',
          name: 'PRODUCT_TIBIA_COINS',
          description: 'Compra e Venda de Tibia Coins.',
        },
        {
          id: 'cmrtkw96v0001iijml0a51zde',
          code: 'MD-002',
          name: 'PRODUCT_ACCOUNT_LOYALTY',
          description: 'Venda de Account com Loyalty.',
        },
        {
          id: 'cmrtkw96v0002iijm5q4kytxt',
          code: 'MD-003',
          name: 'PRODUCT_CHARACTERS',
          description: 'Venda de personagens.',
        },
        {
          id: 'cmrtkw96v0003iijmu37eo40h',
          code: 'MD-004',
          name: 'REPORTS',
          description: 'Relatórios.',
        },
        {
          id: 'cmrtkw96v0004iijm2gihjhae',
          code: 'MD-005',
          name: 'SELLER_PANEL',
          description: 'Painel de vendedores.',
        },
      ],
    });

    await tx.world.createMany({
      data: worlds,
    });

    await tx.charm.createMany({
      data: charms,
    });

    for await (const outfit of outfits) {
      await tx.outfit.create({
        data: {
          name: outfit.name,
          type: outfit.type,
          Genders: {
            createMany: {
              data: [
                {
                  gender: 'FEMALE',
                  outfit: outfit.gender.female.outfit,
                  addonOne: outfit.gender.female.addon_1,
                  addonTwo: outfit.gender.female.addon_2,
                  full: outfit.gender.female.full,
                },
                {
                  gender: 'MALE',
                  outfit: outfit.gender.male.outfit,
                  addonOne: outfit.gender.male.addon_1,
                  addonTwo: outfit.gender.male.addon_2,
                  full: outfit.gender.male.full,
                },
              ],
            },
          },
        },
      });
    }

    await tx.mount.createMany({
      data: mounts,
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
