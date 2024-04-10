import { expect, test } from 'bun:test';
import { TTS } from '../src';

const { SESSION_ID } = process.env;

if (!SESSION_ID) {
    throw new Error('SESSION_ID is not set');
}

test('Generate Audio', async () => {
    const tts = new TTS({
        sessionId: SESSION_ID,
    });
    const result = await tts.generateAudio('Follow the yellow brick road');

    expect(result).toBeInstanceOf(Buffer);
});

test('Save Audio', async () => {
    try {
        const tts = new TTS({
            sessionId: SESSION_ID,
        });
        await tts.generateAudio('Follow the yellow brick road all the way home');
        tts.saveAudio();

        await new Promise((resolve) => setTimeout(resolve, 500));

        expect(true).toBe(true);
    } catch (error) {
        expect(true).toBe(false);
    }
});
