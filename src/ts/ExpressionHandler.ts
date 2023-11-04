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
            if (this.isPrefix(this.message)) {
                this.type = Type.Prefix;
            } else if (this.isInfix(this.message)) {
                this.type = Type.Infix;
            } else if (this.isPostfix(this.message)) {
                this.type = Type.Postfix;
            }
            if (type !== null) {
                switch (type) {
                    case Type.Prefix:
                        if (this.type === Type.Infix) {

                        }
                        break;
                    case Type.Infix:
                        this.isInfix(input)
                        break;
                    case Type.Postfix:
                        if (this.type === Type.Prefix) {
                            this.message = this.preToPost(this.message);
                            this.type = Type.Postfix;
                        }
                        break;
                    default:
                        throw new Error("unknown type");

                }
            }
            this.stack = this.getStack(this.message);
        }

    }

    protected validate(input: string): boolean {
        const checkSigns = input.match(fullRegex) !== null;
        const letterReg = input.match(lettersRegex);
        const signsReg = input.match(operationsRegex);
        const goodRatio = (signsReg !== null
            && letterReg !== null
            && letterReg.length - 1 === signsReg.length);
        console.log(checkSigns, goodRatio);

        return checkSigns && goodRatio
    }
    protected isPrefix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        if (chars[0].match(operationsRegex)
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
            return true;
        }
        return false;
    }
    protected isInfix(input: string): boolean {
        const chars = input.split('');
        let letterCount = 0;
        let signCount = 0;
        let openBracket = 0;
        let closeBracket = 0;

        if (input.match(infixRegex) === null) {
            return false;
        }

        chars.forEach((char) => {
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
            if (signCount + 1 !== letterCount || signCount !== letterCount) {
                return false;
            }
        });
        if (openBracket === closeBracket) {
            return true;
        }
        return false;
    }
    protected isPostfix(input: string): boolean {
        const chars = input.slice(2 - input.length).split('');
        let letterCount = 2;
        let signCount = 0;
        if (input.slice(0, 2).match(lettersRegex)?.length === 2
            && input.slice(-1).match(operationsRegex) !== null) {
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
            return true;
        }
        return false;
    }

    protected preToPost(pre_exp: string): string {

        let s: Array<string> = [];

        // length of expression
        let length = pre_exp.length;

        // reading from right to left
        for (let i = length - 1; i >= 0; i--) {

            // check if symbol is operator
            if (pre_exp[i].match(operationsRegex)) {
                // pop two operands from stack
                let op1 = s[s.length - 1];
                s.pop();
                let op2 = s[s.length - 1];
                s.pop();

                // concat the operands and operator
                let temp = op1 + op2 + pre_exp[i];

                // Push String temp back to stack
                s.push(temp);
            }

            // if symbol is an operand
            else {
                // push the operand to the stack
                s.push(pre_exp[i] + "");
            }
        }

        // stack contains only the Postfix expression
        return s[s.length - 1];
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