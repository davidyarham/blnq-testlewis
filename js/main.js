class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
        
        this.init();
    }
    
    init() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButton(e));
        });
    }
    
    handleButton(event) {
        const button = event.target;
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        switch(action) {
            case 'number':
                this.inputNumber(value);
                break;
            case 'operator':
                this.inputOperator(value);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
        }
        
        this.updateDisplay();
    }
    
    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentValue = num;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
    }
    
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }
    
    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operator) {
            const result = this.performCalculation(this.previousValue, inputValue, this.operator);
            this.currentValue = String(result);
            this.previousValue = result;
        }
        
        this.operator = nextOperator;
        this.waitingForOperand = true;
    }
    
    calculate() {
        if (this.operator === null || this.previousValue === null) return;
        
        const inputValue = parseFloat(this.currentValue);
        const result = this.performCalculation(this.previousValue, inputValue, this.operator);
        
        this.currentValue = String(result);
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = true;
    }
    
    performCalculation(first, second, op) {
        switch(op) {
            case '+': return first + second;
            case '-': return first - second;
            case '×': return first * second;
            case '÷': return second !== 0 ? first / second : NaN;
            default: return second;
        }
    }
    
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForOperand = false;
    }
    
    toggleSign() {
        const value = parseFloat(this.currentValue);
        this.currentValue = String(-value);
    }
    
    percent() {
        const value = parseFloat(this.currentValue);
        this.currentValue = String(value / 100);
    }
    
    updateDisplay() {
        let displayValue = this.currentValue;
        
        // Format large numbers
        if (displayValue.length > 9) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e9 || (Math.abs(num) < 0.00000001 && num !== 0)) {
                displayValue = num.toExponential(4);
            } else {
                displayValue = parseFloat(displayValue).toString();
            }
        }
        
        this.display.textContent = displayValue;
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
