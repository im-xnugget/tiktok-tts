import axios from 'axios';
import fs from 'fs';
import type { TVoiceId, TVoice, VoiceLanguage } from './types/internal';
import { voice, languages, voiceIds, voiceNames, voices } from './voices';

const BASE_URL = 'https://api16-normal-v6.tiktokv.com/media/api/text/speech/invoke';

export class TTS {
    private voice: TVoiceId = 'en_us_002';
    private sessionId: string;
    private data: Buffer | null = null;
    private saveLocation: string = 'audio.mp3';

    constructor({ voice, sessionId, saveLocation }: { voice?: TVoiceId; saveLocation?: string; sessionId: string }) {
        this.voice = voice || this.voice;
        this.sessionId = sessionId;
        this.saveLocation = saveLocation || this.saveLocation;
    }

    private prepareText(text: string) {
        text = text.replaceAll('+', 'plus');
        text = text.replaceAll(/\s/g, '+');
        text = text.replaceAll('&', 'and');
        return text;
    }

    public async generateAudio(text: string) {
        try {
            const URL = `${BASE_URL}/?text_speaker=${this.voice}&req_text=${this.prepareText(text)}&speaker_map_type=0&aid=1233`;
            const response = await axios(URL, {
                method: 'POST',
                headers: {
                    'User-Agent': 'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
                    Cookie: `sessionid=${this.sessionId}`,
                    'Accept-Encoding': 'gzip,deflate,compress',
                },
            }).catch((error) => {
                throw new Error(`Failed to fetch audio: ${error}`);
            });
            const status_code = response?.data?.status_code;
            if (status_code !== 0) {
                throw new Error(`Failed to fetch audio: ${response.status}`);
            }
            const encoded_voice = response?.data?.data?.v_str;

            const buffer = Buffer.from(encoded_voice, 'base64');

            this.data = buffer;
            return buffer;
        } catch (error) {
            throw new Error(`Failed to fetch audio: ${error}`);
        }
    }

    public saveAudio(file?: Buffer) {
        if (file) {
            Bun.write(this.saveLocation, file);
            return;
        }

        if (!this.data) {
            throw new Error('No audio data to save');
        }

        fs.writeFileSync(this.saveLocation, this.data);
    }
}

export type { TVoice, VoiceLanguage, TVoiceId };
export { voice, languages, voiceIds, voiceNames, voices };
