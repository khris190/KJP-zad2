import Converters from './Converters'

export enum Type {
    Prefix = 'Prefix',
    Infix = 'Infix',
    Postfix = 'Postfix',
    None = 'None'
}
const fullRegex = /^[a-zA-Z+-/*\(\)]+$/
const nonInfixRegex = /^[a-zA-Z+-/*]+$/
const lettersRegex = /([a-zA-Z])/g
const operationsRegex = /([+-/*])/g

const infixRegex = /^\(*[a-zA-Z][-+/*].*[a-zA-Z]\)*$/

const expressionRegex = /^[0-9a-zA-Z+-/*\(\)]+$/
export interface ExpressionHandlerInterface {
    input: ExpressionInterface;
    prefix: ExpressionInterface;
    infix: ExpressionInterface;
    postfix: ExpressionInterface;
}

export interface ExpressionInterface {
    stack: Array<string> | false;
    type: Type;
    message: string;
}

export class Expression implements ExpressionInterface {
    stack: false | string[] = false;
    type: Type = Type.None;
    message: string = '';

    constructor(input: string, type: Type | null = null) {
        if (this.validate(input)) {
            this.message = input;
            this.type = this.getType(input)
            if (type !== null) {
                switch (type) {
                    case Type.Prefix:
                        if (this.type === Type.Postfix) {
                            this.message = Converters.postToPre(this.message);
                            this.type = Type.Prefix;
                        } else if (this.type === Type.Infix) {
                            this.message = Converters.inToPre(this.message);
                            this.type = Type.Prefix;
                        }
                        break;
                    case Type.Infix:
                        if (this.type === Type.Prefix) {
                            this.message = Converters.preToIn(this.message);
                            this.type = Type.Infix;
                        } else if (this.type === Type.Postfix) {
                            this.message = Converters.postToIn(this.message);
                            this.type = Type.Infix;
                        }
                        break;
                    case Type.Postfix:
                        if (this.type === Type.Prefix) {
                            this.message = Converters.preToPost(this.message);
                            this.type = Type.Postfix;
                        } else if (this.type === Type.Infix) {
                            this.message = Converters.inToPost(this.message);
                            this.type = Type.Infix;
                        }
                        break;
                    default:
                        throw new Error("unknown type");

                }
            }
            this.stack = this.getStack(this.message);
        }
    }

    private toStack(input: string) {

    }



    protected validate(input: string): boolean {
        if (input === '') {
            return false
        }
        const checkSigns = input.match(fullRegex) !== null;
        const letterReg = input.match(lettersRegex);
        const signsReg = input.match(operationsRegex);
        const goodRatio = (signsReg !== null
            && letterReg !== null
            && letterReg.length - 1 === signsReg.length);
        if (!checkSigns) {
            return false
        }
        if (!goodRatio) {
            return false
        }
        return true
    }
    protected getType(input: string): Type {
        let resType: Type = Type.None;
        if (this.isPrefix(this.message)) {
            resType = Type.Prefix;
        } else if (this.isInfix(this.message)) {
            resType = Type.Infix;
        } else if (this.isPostfix(this.message)) {
            resType = Type.Postfix;
        }
        return resType;
    }

    public isPostfix(input: string): boolean {
        const chars = input.slice(2 - input.length).split('');
        let letterCount = 2;
        let signCount = 0;
        if (input.slice(0, 2).match(lettersRegex)?.length === 2
            && input.slice(-1).match(operationsRegex) !== null) {
            let index = 0;
            for (let char of chars) {
                if (char.match(lettersRegex) !== null) {
                    letterCount++;
                } else {
                    signCount++;
                }
                if (signCount + 1 > letterCount) {
                    console.log(signCount, letterCount);

                }
                index++;
            };
            return true;
        }
        return false;
    }
    public isInfix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        let openBracket = 0;
        let closeBracket = 0;

        if (input.match(infixRegex) === null) {
            return false;
        }
        let index = 0;
        for (let char of chars) {
            if (char.match(lettersRegex) !== null) {
                letterCount++;
            } else if (char === '(') {
                if (signCount !== letterCount) {
                    return false;
                }
                openBracket++;
            } else if (char === ')') {
                if (signCount + 1 !== letterCount) {
                    return false;
                }
                closeBracket++;
            } else {
                signCount++;
            }
            if (signCount + 1 !== letterCount && signCount !== letterCount) {
                return false;
            }
            index++;
        }

        if (openBracket === closeBracket) {
            return true;
        }
        return false;
    }
    public isPrefix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        if (chars[0].match(operationsRegex)
            && input.slice(-2).match(lettersRegex)?.length === 2) {
            let index = 0;
            for (let char of chars) {
                if (char.match(lettersRegex) !== null) {
                    letterCount++;
                } else {
                    signCount++;
                }
                if (signCount + 1 < letterCount) {
                    console.log(signCount, letterCount);
                    return false
                }
                index++;
            };
            return true;
        }
        return false;
    }
    protected getStack(input: string): Array<string> {
        return input.split('');
    }
}
export class ExpressionHandler implements ExpressionHandlerInterface {
    input: ExpressionInterface;
    prefix: ExpressionInterface;
    infix: ExpressionInterface;
    postfix: ExpressionInterface;
    constructor(input: string) {
        this.input = new Expression(input);
        this.prefix = new Expression(input, Type.Prefix);
        this.infix = new Expression(input, Type.Infix);
        this.postfix = new Expression(input, Type.Postfix);
    }
}