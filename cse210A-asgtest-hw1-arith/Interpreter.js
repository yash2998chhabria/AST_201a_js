#!/usr/bin/env node
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  
  });


INTEGER = 'INTEGER'
PLUS = 'PLUS'
MINUS = 'MINUS'
MUL = 'MUL'
DIV = 'DIV'
LPAREN = '('
RPAREN = ')'
EOF = 'EOF'

class Token{
    constructor(type, value){
        this.type = type
        this.value = value 
    }
}

class lexer extends Object {
    constructor(text){
        super(text)
        this.text = text
        this.pos = 0
        this.current_char = this.text[this.pos]
    }

    error() {
        throw 'Error parsing Input'
    }

    advance() {
        this.pos += 1
        if(this.pos > this.text.length -1) {
            this.current_char = null
        }
        else {
            this.current_char = this.text[this.pos]
        }
    }

    skip_whitespace() {
        while(this.current_char != null && /\s/.test(this.current_char)){
            this.advance()
        }
    }

    integer() {
        let result = ''
        while(this.current_char != null && !isNaN(this.current_char)){
            result += this.current_char
            this.advance()
        }
        return parseInt(result)
    }

    get_next_token() {

        while(this.current_char != null){
            if(/\s/.test(this.current_char)) {
                this.skip_whitespace()
            }

            if(!isNaN(this.current_char)) {
                return new Token(INTEGER, this.integer())
            }

            if(this.current_char === '+'){
                this.advance()
                return new Token(PLUS, '+')
            }

            if(this.current_char === '-'){
                this.advance()
                return new Token(MINUS, '-')
            }
            
            if(this.current_char === '*'){
                this.advance()
                // if(this.current_char == '*'){
                //     this.advance()
                //     return new Token(EXPONENT, '**')
                // }
                return new Token(MUL, '*')
            }

            if(this.current_char === '/'){
                this.advance()
                return new Token(DIV, '/')
            }
            
            if(this.current_char === '('){
                this.advance()
                return new Token(LPAREN,'(')
            }

            if(this.current_char === ')'){
                this.advance()
                return new Token(RPAREN, ')')
            }

            this.error()
        }

        return new Token(EOF, null)
    }

}



class AST extends Object {
}

class BinOp extends AST {
    constructor(left,op,right){
        super(left,op,right)
        this.left = left
        this.token = this.op = op
        this.right = right
    }
}

class SinOp extends AST {
    constructor(leaf,op){
        super(leaf,op)
        this.leaf = leaf
        this.token = this.op = op
    }
}

class Num extends AST {
    constructor(token){
        super(token)
        this.token = token
        this.value = token.value
    }
}

class Parser extends Object {
    constructor(lexer){
        super(lexer)
        this.lexer = lexer 
        this.current_token = this.lexer.get_next_token()
    }

    error() {
        throw 'Invalid Syntax'
    }

    eat(token_type) {
        if (this.current_token.type === token_type){
            this.current_token = this.lexer.get_next_token()
        }
        else{
            this.error()
        }
    }

    factor() {
        let token = this.current_token
        if (token.type === INTEGER){
            this.eat(INTEGER)
            return new Num(token)
        }
        else if (token.type == MINUS){
            this.eat(MINUS)
            let node = new SinOp(this.factor(),token)
            return node
        }
        else if (token.type === LPAREN){
            this.eat(LPAREN)
            let node = this.expr()
            this.eat(RPAREN)
            return node
        }
        
    }

    term() {
        let node = this.factor()

        while([MUL,DIV].includes(this.current_token.type)){
            let token = this.current_token
            if(token.type === MUL){
                this.eat(MUL)
            }
            else if (token.type === DIV){
                this.eat(DIV)
            }
            node = new BinOp(node,token,this.factor())
        }

        return node
    }

    expr() {
        let node = this.term()

        while([PLUS,MINUS].includes(this.current_token.type)){
            let token = this.current_token
            if(token.type === PLUS){
                this.eat(PLUS)
            }
            else if (token.type === MINUS){
                this.eat(MINUS)
            }
            node = new BinOp(node,token,this.term())
        }

        return node
    }

    parse() {
        return this.expr()
    }

}

class Interpreter extends Object{
    constructor(parser){
        super(parser)
        this.parser = parser
    }

    visit(node){
        if(node instanceof BinOp) {
            return this.visit_BinOp(node)
        }
        else if (node instanceof Num) {
            return this.visit_Num(node)
        }
        else if (node instanceof SinOp){
            return this.visit_SinOp(node)
        }

    }

    visit_BinOp(node) {
        if(node.op.type == PLUS){
            return this.visit(node.left) + this.visit(node.right)
        }
        if(node.op.type == MINUS){
            return this.visit(node.left) - this.visit(node.right)
        }
        if(node.op.type == MUL){
            return this.visit(node.left) * this.visit(node.right)
        }
        if(node.op.type == DIV){
            return this.visit(node.left) / this.visit(node.right)
        }
    }

    visit_SinOp(node) {
        if(node.op.type == MINUS){
            return -this.visit(node.leaf)
        }
    }

    visit_Num(node){
        return node.value
    }

    interpret(){
        let tree = this.parser.parse()
        return this.visit(tree)
    }
}

// Lexer = new lexer('((-7 + 2)*2) ')
// parser = new Parser(Lexer)
// // console.log(parser.parse().left)
// interpreter = new Interpreter(parser)
// console.log(interpreter.interpret());

try {
    rl.question("calc> ", function(text) {
        Lexer = new lexer(text)
        parser = new Parser(Lexer)
        interpreter = new Interpreter(parser)
        console.log(interpreter.interpret());
        rl.close();
        });         
}
catch (error) {
    throw 'Error' + error
}