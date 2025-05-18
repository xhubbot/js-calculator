const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const operators = ['+', '-', '*', '/'];
let currentInput = '';
let lastButton = '';

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return '∞';
  }
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return 'Error: Unknown operator';
  }
}

const inputButtons = document.querySelectorAll('.btn.digit, .btn.dot, .btn.operator');
inputButtons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // Check if the last button was enter if the digit is clicked
    if (lastButton === 'enter' && !operators.includes(value)) {
      currentInput = '';
    };

    // Get the current number segment (after the last operator)
    if (value === '.') {
      const lastNumber = currentInput.split(/[\+\-\*/]/).pop();
      if (lastNumber.includes('.')) return; // Prevent multiple dots in a number
    };

    // Prevent adding multiple operators or dots in a row
    if (['+', '-', '*', '/', '.'].includes(value)) {
      const lastChar = currentInput.slice(-1);
      if (['+', '-', '*', '/', '.'].includes(lastChar) || currentInput === '') return;
    };

    if (['+', '-', '*', '/'].includes(value)) {
      if (currentInput.slice(1).match(/[+\-*/]/)) {
        let intermediateResult = calculateExpression(currentInput);
        currentInput = intermediateResult.toString();
        currentInput += value;
        display.innerText = currentInput;
        return;
      };
    };

    currentInput += value;
    display.innerText = currentInput;
    lastButton = 'input';
  });
});

const equalsButton = document.querySelector('.btn.enter');
equalsButton.addEventListener('click', () => {
  if (currentInput === '') return;

  const result = calculateExpression(currentInput);

  display.innerText = result;
  currentInput = result.toString(); // Allow chaining operations
  lastButton = 'enter';
});

const clearButton = document.querySelector('.btn.clear');
clearButton.addEventListener('click', () => {
  currentInput = '';
  display.innerText = '0';
});

const deleteButton = document.querySelector('.btn.delete');
deleteButton.addEventListener('click', () => {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    display.innerText = currentInput || '0';
  }
});

function calculateExpression(input) {
  const operatorMatch = input.match(/[+\-*/]/); // Find the first operator

  if (!operatorMatch) {
    return input.toString();
  }

  if (input[0] === '-') {
    const operatorMatch = input.slice(1).match(/[+\-*/]/); // Find operator after the minus sign
    if (!operatorMatch) return input.toString();

    const operator = operatorMatch[0];
    const parts = input.slice(1).split(operator); // Skip first minus

    const a = -parseFloat(parts[0]); // Negate the first number
    const b = parseFloat(parts[1]);

    if (isNaN(a) || isNaN(b)) {
      return 'Invalid numbers';
    }

    return operate(operator, a, b);
  }

  const operator = operatorMatch[0];
  const [a, b] = input.split(operator).map(Number);

  if (isNaN(a) || isNaN(b)) {
    return 'Invalid numbers';
  }

  // return result
  const result = operate(operator, a, b);
  if (typeof result === 'string') {
    return result; // it's an error message like "Error: Division by zero"
  }
  return parseFloat(result.toFixed(5)); // round only if it's a number
}