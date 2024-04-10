import type { voiceIds, voiceNames, voices } from '../voices';

export type VoiceLanguage = keyof typeof voices;

export type TVoice = keyof typeof voiceNames;

export type TVoiceId = (typeof voiceIds)[number];
