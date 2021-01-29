import { env } from '../env';

type Patterns = { [key: string]: RegExp };
type ParsedMessage = { [key: string]: string };

export class Sink {
    static get REGEXP_SPECIALS(): string[] {
        return [
            // order matters for these
            '-',
            '[',
            ']',
            // order doesn't matter for any of these
            '/',
            '{',
            '}',
            '(',
            ')',
            '*',
            '+',
            '?',
            '.',
            '\\',
            '^',
            '$',
            '|',
        ];
    }

    static get ESCAPE_REGEXP_PATTERN(): RegExp {
        return new RegExp(`[${Sink.REGEXP_SPECIALS.join('\\')}]`, 'g');
    }

    static escapeRegExp(str: string): string {
        return str.replace(Sink.ESCAPE_REGEXP_PATTERN, '\\$&');
    }

    static parseMessage(message: string, patterns: Patterns): ParsedMessage {
        const patternKeys = Object.keys(patterns);
        patternKeys.map((key) => {});
        return {};
    }
}
