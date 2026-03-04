export interface Partial {
  ratio: number;
  amplitude: number;
  decay: number;
}

export interface BowlPreset {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  partials: Partial[];
  beatFrequency: number;
  attackTime: number;
  subHarmonic?: Partial;
  color: string;
}

export const PRESETS: BowlPreset[] = [
  // 1. Crystal Pure — 거의 순수한 사인파, 유리처럼 맑음
  {
    id: 'crystal_pure',
    name: 'Crystal Pure',
    nameKo: '크리스탈 퓨어',
    description: '유리처럼 맑은 순수한 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 70 },
      { ratio: 2.001, amplitude: 0.08, decay: 40 },
    ],
    beatFrequency: 0.3,
    attackTime: 0.01,
    color: '#E8E8FF',
  },

  // 2. Crystal Alchemy — 맑지만 약간의 미네랄 질감
  {
    id: 'crystal_alchemy',
    name: 'Crystal Alchemy',
    nameKo: '크리스탈 알케미',
    description: '맑으면서 약간 풍부한 울림',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 65 },
      { ratio: 2.003, amplitude: 0.15, decay: 40 },
      { ratio: 3.01, amplitude: 0.1, decay: 25 },
      { ratio: 4.02, amplitude: 0.05, decay: 15 },
    ],
    beatFrequency: 0.5,
    attackTime: 0.01,
    color: '#D8C8FF',
  },

  // 3. Thadobati Bell — "딩~" 맑은 벨 소리 + 금속 울림
  {
    id: 'thadobati',
    name: 'Thadobati Bell',
    nameKo: '타도바티 벨',
    description: '전통 싱잉볼의 대표적 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 40 },
      { ratio: 2.71, amplitude: 0.65, decay: 25 },
      { ratio: 5.4, amplitude: 0.35, decay: 15 },
    ],
    beatFrequency: 1.5,
    attackTime: 0.005,
    color: '#C9A050',
  },

  // 4. Manipuri Bright — 밝고 섬세, 얇은 벽의 빛나는 소리
  {
    id: 'manipuri',
    name: 'Manipuri Bright',
    nameKo: '마니푸리 브라이트',
    description: '밝고 섬세한 빛나는 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 35 },
      { ratio: 2.68, amplitude: 0.5, decay: 20 },
      { ratio: 4.2, amplitude: 0.4, decay: 15 },
      { ratio: 6.3, amplitude: 0.25, decay: 10 },
      { ratio: 8.1, amplitude: 0.1, decay: 6 },
    ],
    beatFrequency: 2.0,
    attackTime: 0.005,
    color: '#E8C870',
  },

  // 5. Jambati Deep — "궁~~~" 깊고 웅장한 징 소리
  {
    id: 'jambati',
    name: 'Jambati Deep',
    nameKo: '잠바티 딥',
    description: '묵직하고 웅장한 깊은 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 60 },
      { ratio: 2.53, amplitude: 0.7, decay: 35 },
      { ratio: 4.1, amplitude: 0.55, decay: 25 },
      { ratio: 5.8, amplitude: 0.4, decay: 18 },
      { ratio: 7.6, amplitude: 0.3, decay: 12 },
      { ratio: 9.5, amplitude: 0.2, decay: 8 },
      { ratio: 11.2, amplitude: 0.12, decay: 5 },
      { ratio: 13.4, amplitude: 0.07, decay: 3 },
    ],
    beatFrequency: 1.2,
    attackTime: 0.008,
    color: '#8B6914',
  },

  // 6. Ultabati OM — "옴~~~~" 초저음 진동
  {
    id: 'ultabati',
    name: 'Ultabati OM',
    nameKo: '울타바티 옴',
    description: '가장 깊고 명상적인 OM 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 70 },
      { ratio: 2.2, amplitude: 0.6, decay: 40 },
      { ratio: 3.8, amplitude: 0.45, decay: 28 },
      { ratio: 5.5, amplitude: 0.35, decay: 20 },
      { ratio: 7.1, amplitude: 0.2, decay: 14 },
      { ratio: 9.0, amplitude: 0.12, decay: 8 },
    ],
    beatFrequency: 0.8,
    attackTime: 0.012,
    subHarmonic: { ratio: 0.5, amplitude: 0.15, decay: 50 },
    color: '#6B4E9B',
  },

  // 7. Nepal Antique — 따뜻하고 빈티지한 울림
  {
    id: 'nepal_antique',
    name: 'Nepal Antique',
    nameKo: '네팔 앤티크',
    description: '수공예 특유의 따뜻한 빈티지 울림',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 55 },
      { ratio: 2.76, amplitude: 0.55, decay: 32 },
      { ratio: 4.45, amplitude: 0.4, decay: 22 },
      { ratio: 6.8, amplitude: 0.25, decay: 14 },
      { ratio: 9.2, amplitude: 0.15, decay: 9 },
    ],
    beatFrequency: 1.8,
    attackTime: 0.006,
    color: '#A0784C',
  },

  // 8. Indian Brass — "딩!" 밝고 금속적, 빠르게 사라짐
  {
    id: 'indian_brass',
    name: 'Indian Brass',
    nameKo: '인디안 브라스',
    description: '가볍고 밝은 금속 소리',
    partials: [
      { ratio: 1.0, amplitude: 1.0, decay: 12 },
      { ratio: 2.65, amplitude: 0.55, decay: 7 },
      { ratio: 5.1, amplitude: 0.3, decay: 4 },
      { ratio: 7.8, amplitude: 0.15, decay: 2 },
    ],
    beatFrequency: 2.5,
    attackTime: 0.003,
    color: '#D4A843',
  },
];

export const FREQUENCY_MIN = 100;
export const FREQUENCY_MAX = 1200;
export const DEFAULT_FREQUENCY = 432;
export const DEFAULT_STEP = 1;
