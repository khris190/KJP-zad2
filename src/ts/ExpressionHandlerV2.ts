import type Converters from "@/ts/Converters"

class ExpressionOperand {
    public value: string
    constructor(value: string) {
        if (value.match(valueNeedsBracketsRegex)) {
            this.value = '(' + value + ')'
        } else {
            this.value = value;
        }
    }
}
class ExpressionOperator {
    constructor(public value: string, public expects: number) {
    }
}
export enum Type {
    Prefix = 'Prefix',
    Infix = 'Infix',
    Postfix = 'Postfix',
    None = 'None'
}

const isExpressionRegex = /^((?:(?:NEG)|(?:tg)|(?:tcg)|(?:sin)|(?:cos)|(?:\^)|[0-9a-zA-Z+\-/*()]){2,})$/
const expressionCaptureRegex = /((?:NEG)|(?:tg)|(?:tcg)|(?:sin)|(?:cos)|(?:\^))|(\((?:\d+|[a-zA-Z])\))|([0-9]+|[a-zA-Z])|([+\-/*()])/g
const valueNeedsBracketsRegex = /^(\(\d+)\)$/
const operator0Regex = /^([()])$/
const operator1Regex = /(NEG)|(tg)|(tcg)|(sin)|(cos)/
const operator2Regex = /(\^)|([+\-/*])/
const variableRegex = /^((?:\((?:\d+|[a-zA-Z])\))|(?:\d+|[a-zA-Z]))$/
export class TestExpresson {
    stack: Array<ExpressionOperand | ExpressionOperator> = [];
    type: Type = Type.None;
    constructor(input: string, convertTo: Type = Type.None) {
        this.populateStack(input);
        this.type = this.checkType();
        console.log(input.match(expressionCaptureRegex))
        console.log(this.type);
        console.log('validate', this.validate());
        if (convertTo !== Type.None) {
            switch (convertTo) {
                case Type.Prefix:
                    if (this.type === Type.Infix) {
                        this.InToPre();
                    } else if (this.type === Type.Postfix) {
                        this.PostToPre();
                    }
                    break;
                case Type.Infix:
                    if (this.type === Type.Prefix) {
                        this.PreToIn();
                    } else if (this.type === Type.Postfix) {
                        this.PostToIn();
                    }
                    break;
                case Type.Postfix:
                    if (this.type === Type.Prefix) {
                        this.preToPost();
                    } else if (this.type === Type.Infix) {
                        this.InToPost();
                    }
                    break;
                default:
                    throw new Error("wtf is that type");
            }
            console.log(this.stack);

        }
    }
    private getPrecedence(operation: string): number {
        if (operation.match(/(NEG)|(tg)|(tcg)|(sin)|(cos)/)) {
            return 3
        } else if (operation.match(/[*/]/)) {
            return 2
        } else if (operation.match(/[+\-)]/)) {
            return 1
        } else {
            return 0
        }
    }
    private isExpression(input: string): boolean {
        return input.match(isExpressionRegex) !== null;
    }
    private isOperator(input: string): boolean {
        return ((input.match(operator0Regex) ?? input.match(operator1Regex)) ?? input.match(operator2Regex)) !== null
    }
    private populateStack(input: string): boolean {
        this.stack = [];
        const preStack: string[] | null = input.match(expressionCaptureRegex);
        if (preStack === null || preStack.length < 2) {
            return false;
        }
        preStack.forEach((char) => {
            if (char.match(operator0Regex)) {
                this.stack.push(new ExpressionOperator(char, 0))
            } else if (char.match(operator1Regex)) {
                this.stack.push(new ExpressionOperator(char, 1))
            } else if (char.match(operator2Regex)) {
                this.stack.push(new ExpressionOperator(char, 2))
            } else if (char.match(variableRegex)) {
                this.stack.push(new ExpressionOperand(char))
            } else {
                throw new Error("JAK TO SIĘ STAŁO? HMMM? NIE POTRAFISZ REGEXA?");
            }
        });
        return true;
    }
    private checkType(): Type {
        if (this.stack.length < 2) {
            return Type.None
        }
        if (this.stack[0] instanceof ExpressionOperator) {
            if (this.stack[0].expects === 0) {
                //operator ()
                return Type.Infix
            } else if (this.stack[0].expects === 1) {
                //operator tg tcg NEG cos sin
                if (this.stack[1] instanceof ExpressionOperand) {
                    //operator sin, val
                    return Type.Infix;
                }
            }
            //operator sin, operator + || operator +
            return Type.Prefix
        } else if (this.stack[1] instanceof ExpressionOperator) {
            if (this.stack[1].expects === 1) {
                //variable, operator sin
                return Type.Postfix;
            } else if (this.stack[1].expects === 2) {
                //variable, operator +
                return Type.Infix;
            }
        }
        //variable, variable
        return Type.Postfix
    }
    private validate(): boolean {
        if (this.type == Type.Prefix) {
            return this.validatePrefix();
        } else if (this.type == Type.Infix) {
            return this.validateInfix();
        } else if (this.type == Type.Postfix) {
            return this.validatePostfix();
        }
        return false;
    }
    private validatePrefix(): boolean {
        let expects = 1;
        for (const element of this.stack) {
            if (element instanceof ExpressionOperand) {
                expects--;
            } else if (element instanceof ExpressionOperator) {
                if (element.expects === 0) {
                    return false;
                }
                expects += element.expects - 1;
            }
            if (expects < 0) {
                return false;
            }
        }
        return expects === 0;
    }
    private validatePostfix(): boolean {
        let expects = 1;
        for (const element of this.stack) {
            if (element instanceof ExpressionOperand) {
                expects--;
            } else if (element instanceof ExpressionOperator) {
                if (element.expects === 0) {
                    return false;
                }
                expects += element.expects - 1;
            }
            if (expects > 0) {
                return false;
            }
        }
        return expects === 0;
    }
    private validateInfix(): boolean {
        let expects = 1;
        let openBrace = 0;
        let closeBrace = 0;
        for (const element of this.stack) {
            if (element instanceof ExpressionOperand) {
                expects--;
            } else if (element instanceof ExpressionOperator) {
                //check braces
                if (element.expects === 0) {
                    if (element.value === '(') {
                        if (expects !== 1) {
                            return false;
                        }
                        openBrace++;
                    } else {
                        closeBrace++;
                        if (expects !== 0) {
                            return false;
                        }
                    }
                } else {
                    //add expects
                    expects += element.expects - 1;
                }
            }
            if (expects < 0) {
                return false;
            }
        }
        return expects === 0 && openBrace === closeBrace;
    }
    private preToPost(): boolean {

        let resStack: Array<ExpressionOperand | ExpressionOperator> = [];
        const revStack = this.stack.slice().reverse();
        for (const piece of revStack) {
            if (piece instanceof ExpressionOperand) {
                resStack.push(piece);
            } else if (piece instanceof ExpressionOperator) {
                if (piece.expects === 1) {
                    const op1 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    resStack.push(new ExpressionOperand(op1?.value + piece.value))
                } else if (piece.expects === 2) {
                    const op1 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    const op2 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    resStack.push(new ExpressionOperand(op1.value + op2.value + piece.value))
                }
            }
        }
        this.populateStack(resStack.pop()?.value as string);
        return this.validatePostfix();
    }
    private PostToPre(): boolean {
        let resStack: Array<ExpressionOperand | ExpressionOperator> = [];
        for (const piece of this.stack) {
            if (piece instanceof ExpressionOperand) {
                resStack.push(piece);
            } else if (piece instanceof ExpressionOperator) {
                if (piece.expects === 1) {
                    const op1 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    resStack.push(new ExpressionOperand(piece.value + op1.value))
                } else if (piece.expects === 2) {
                    const op1 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    const op2 = resStack.pop() as ExpressionOperand | ExpressionOperator
                    resStack.push(new ExpressionOperand(piece.value + op2.value + op1.value))
                }
            }
        }
        this.populateStack(resStack.pop()?.value as string)
        return this.validatePrefix();
    }
    private InToPost(): boolean {
        let res: string = '';
        let tmpStack: Array<ExpressionOperand | ExpressionOperator> = [];
        for (const piece of this.stack) {
            if (piece instanceof ExpressionOperand) {
                res += piece.value;
            } else if (piece instanceof ExpressionOperator) {
                if (piece.value === '(') {
                    tmpStack.push(piece);
                } else if (piece.value === ')') {
                    while (tmpStack[tmpStack.length - 1].value != '(') {
                        res += tmpStack.pop()?.value;
                    }
                    tmpStack.pop();
                } else {
                    while (tmpStack.length != 0 && this.getPrecedence(piece.value) < this.getPrecedence(tmpStack[tmpStack.length - 1].value)) {
                        res += tmpStack.pop()?.value;
                    }
                    tmpStack.push(piece)
                }
            }
        }
        while (tmpStack.length != 0) {
            res += tmpStack.pop()?.value;
        }
        this.populateStack(res);
        return this.validatePostfix();
    }
    private InToPre(): boolean {
        this.stack = this.stack.reverse();
        for (const piece of this.stack) {
            if (piece.value == "(") {
                piece.value = ")";
            } else if (piece.value == ")") {
                piece.value = "(";
            }
        }
        let res = this.InToPost();
        this.stack = this.stack.reverse();
        return this.validatePrefix();
    }
    private PreToIn(): boolean {
        //todo remove useless braces?
        let tmpStack: Array<ExpressionOperand | ExpressionOperator> = [];
        const revStack = this.stack.slice().reverse();
        for (const piece of revStack) {
            if (piece instanceof ExpressionOperator) {
                const op1 = tmpStack.pop() as ExpressionOperand | ExpressionOperator
                const op2 = tmpStack.pop() as ExpressionOperand | ExpressionOperator
                console.log(op1.value);
                console.log(op2.value);
                console.log(piece.value);

                tmpStack.push(new ExpressionOperand('(' + op1.value + piece.value + op2.value + ')'))
            }
            else {
                tmpStack.push(piece);
            }
        }

        this.populateStack(tmpStack.pop()?.value as string);
        return this.validateInfix();

    }
    private PostToIn(): boolean {
        //todo remove useless braces?
        let tmpStack: Array<ExpressionOperand | ExpressionOperator> = [];
        for (const piece of this.stack) {
            if (piece instanceof ExpressionOperand) {
                tmpStack.push(piece);
            }
            else {
                const op1 = tmpStack.pop() as ExpressionOperand | ExpressionOperator
                const op2 = tmpStack.pop() as ExpressionOperand | ExpressionOperator
                console.log(op1.value);
                console.log(op2.value);
                console.log(piece.value);

                tmpStack.push(new ExpressionOperand('(' + op2.value + piece.value + op1.value + ')'))
            }
        }

        this.populateStack(tmpStack.pop()?.value as string);
        return this.validateInfix();

    }
}