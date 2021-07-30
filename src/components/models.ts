interface GameZone {
  name: string;
}

export interface Fight {
  id: number;
  name: string;
  difficulty: number;
  fightPercentage: number;
  bossPercentage: number;
  encounterID: number;
  kill: boolean;
  startTime: number;
  endTime: number;
  gameZone: GameZone;
  friendlyPlayers: number[];

  // custom fields
  duration?: string;
  displayName?: string;
}

export interface GroupedFights {
  name: string;
  fights: Fight[];
}

interface Owner {
  name: string;
}

export interface Report {
  code: string;
  title: string;
  endTime: number;
  owner: Owner;
  fights: Array<Fight>;
}

interface Difficulty {
  id: number;
  name: string;
}

interface Zone {
  difficulties: Array<Difficulty>;
}

export interface Encounter {
  id: number;
  name: string;
  zone: Zone;
}

interface Spec {
  spec: string;
  role: string;
}

interface CompositionInfo {
  name: string;
  id: number;
  guid: number;
  type: string;
  specs: Spec[];
}

interface DoneTotalInfo {
  name: string;
  id: number;
  guid: number;
  type: string;
  icon: string;
  total: number;
}

interface DamageTakenInfo {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  composite?: boolean;
  flags?: number;
  total: number;
}

export interface Ability {
  name: string;
  guid: number;
  type: number;
  abilityIcon: string;
  flags: number;
}

interface DeathEventsInfo {
  name: string;
  id: number;
  guid: number;
  type: string;
  icon: string;
  deathTime: number;
  ability: Ability;
}

interface GearInfo {
  id: number;
  slot: number;
  quality: number;
  icon: string;
  name?: string;
  championPoints: number;
  trait: number;
  enchantType: number;
  enchantQuality: number;
  setID: number;
  type?: number;
  setName?: string;
}

interface CombatantInfo {
  stats: [];
  talents: Ability[];
  artifact: [];
  gear: GearInfo[];
  specIDs: [];
}

export interface CharacterInfo {
  name: string;
  id: number;
  guid: number;
  type: string;
  server: string;
  displayName: string;
  anonymous: boolean;
  icon: string;
  specs: string[];
  minItemLevel: number;
  maxItemLevel: number;
  combatantInfo: CombatantInfo;
}

export interface Table {
  data: {
    totalTime: number;
    itemLevel: number;
    logVersion: number;
    gameVersion: number;
    composition: CompositionInfo[];
    combatantInfo?: CombatantInfo;
    damageDone: DoneTotalInfo[];
    healingDone: DoneTotalInfo[];
    damageTaken: DamageTakenInfo[];
    deathEvents: DeathEventsInfo[];
    playerDetails: {
      dps: CharacterInfo[];
      healers: CharacterInfo[];
      tanks: CharacterInfo[];
    };
  };
}

export interface Buff {
  name: string;
  id: number;
  icon?: string;
  advice?: string;
  optimal_uptime?: number;
  uptime?: number;
}

export interface Skill {
  name: string;
  id: number;
  buffs?: Buff[];
  debuffs?: Buff[];
  advice?: string;
  link: string;
  children?: Skill[];
  uptime?: number;
  optimal_uptime?: number;
}

export interface GearSet {
  name: string;
  id: number;
  link: string;

  icon?: string;
  uptime?: number;
  buffs?: Buff[];
  debuffs?: Buff[];
}

export interface AnalysisInfo {
  skills: Skill[];
  sets: GearSet[];
  char: {
    id: number;
    name: string;
    class: string;
    spec: string;
  };
}
