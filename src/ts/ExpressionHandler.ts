export enum Type {
    Prefix = 'Prefix',
    Infix = 'Infix',
    Postfix = 'Postfix',
    None = 'None'
}
const fullRegex = /^[a-zA-Z+-/*\(\)]+$/
const lettersRegex = /([a-zA-Z])/g
const signsRegex = /([+-/*\(\)])/g
export class ExpressionHandler {
    stack: Array<string> | false = false;
    type: Type = Type.None;
    constructor(input: string) {
        if (this.validate(input)) {
            this.stack = this.getStack(input);
            console.log(this.isPrefix(input));
            console.log(this.isInfix(input));
            console.log(this.isPostfix(input));
        }

    }

    private validate(input: string): boolean {
        return (input.match(fullRegex) !== null)
            && input.match(signsRegex) !== null
            && input.match(lettersRegex) !== null
            && (input.match(lettersRegex).length - 1 === input.match(signsRegex).length)
    }

    private isPrefix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        if (chars[0].match(signsRegex)
            && input.slice(-2).match(lettersRegex)?.length === 2) {
            chars.forEach((char) => {
                if (char.match(lettersRegex) !== null) {
                    letterCount++;
                } else {
                    signCount++;
                }
                if (signCount + 1 <= letterCount) {
                    return false
                }
            });
            this.type = Type.Prefix;
            return true;
        }
        return false;
    }
    private isInfix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        if (chars[0].match(lettersRegex)
            && chars[1].match(signsRegex)
            && input.slice(-1).match(lettersRegex) !== null) {
            chars.forEach((char) => {
                if (char.match(lettersRegex) !== null) {
                    letterCount++;
                } else {
                    signCount++;
                }
                if (signCount + 1 !== letterCount || signCount !== letterCount) {
                    return false
                }
            });
            this.type = Type.Infix;
            return true;
        }
        return false;
    }
    private isPostfix(input: string): boolean {
        const chars = input.slice(2 - input.length).split('');
        let letterCount = 2;
        let signCount = 0;
        if (input.slice(0, 2).match(lettersRegex)?.length === 2
            && input.slice(-1).match(signsRegex) !== null) {
            chars.forEach((char) => {
                if (char.match(lettersRegex) !== null) {
                    letterCount++;
                } else {
                    signCount++;
                }
                if (signCount + 1 > letterCount) {
                    return false
                }
            });
            this.type = Type.Postfix;
            return true;
        }
        return false;
    }

    private getStack(input: string): Array<string> {
        return input.split('');
    }
}