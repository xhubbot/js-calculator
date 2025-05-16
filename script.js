const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const operators = ['+', '-', '*', '/'];
let currentInput = '';

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
    return 'Error: Division by zero';
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

let inputButtons = document.querySelectorAll('.btn.digit, .btn.dot, .btn.operator');
inputButtons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // Prevent adding multiple operators or dots in a row
    if (['+', '-', '*', '/', '.'].includes(value)) {
      const lastChar = currentInput.slice(-1);
      if (['+', '-', '*', '/', '.'].includes(lastChar) || currentInput === '') return;
    }

    currentInput += value;
    display.innerText = currentInput;
  });
});

const equalsButton = document.querySelector('.btn.enter');
equalsButton.addEventListener('click', () => {
  if (currentInput === '') return;

  const result = calculateExpression(currentInput);

  display.innerText = result;
  currentInput = result.toString(); // Allow chaining operations
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
    return 'Error: No operator found';
  }

  const operator = operatorMatch[0];
  const [a, b] = input.split(operator).map(Number);

  if (isNaN(a) || isNaN(b)) {
    return 'Error: Invalid numbers';
  }

  return operate(operator, a, b);
}