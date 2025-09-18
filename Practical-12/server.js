const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Serve the main calculator page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Calculator operation endpoint
app.post('/calculate', (req, res) => {
    const { num1, num2, operation } = req.body;
    
    // Input validation
    if (!num1 || !num2 || !operation) {
        return res.json({
            success: false,
            error: 'Please fill in all fields!'
        });
    }
    
    // Convert to numbers and validate
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    if (isNaN(number1) || isNaN(number2)) {
        return res.json({
            success: false,
            error: 'Please enter valid numbers only!'
        });
    }
    
    let result;
    let operationSymbol;
    
    try {
        switch (operation) {
            case 'add':
                result = number1 + number2;
                operationSymbol = '+';
                break;
            case 'subtract':
                result = number1 - number2;
                operationSymbol = '-';
                break;
            case 'multiply':
                result = number1 * number2;
                operationSymbol = '×';
                break;
            case 'divide':
                if (number2 === 0) {
                    return res.json({
                        success: false,
                        error: 'Cannot divide by zero!'
                    });
                }
                result = number1 / number2;
                operationSymbol = '÷';
                break;
            default:
                return res.json({
                    success: false,
                    error: 'Invalid operation selected!'
                });
        }
        
        // Round result to 2 decimal places for cleaner display
        result = Math.round(result * 100) / 100;
        
        res.json({
            success: true,
            result: result,
            expression: `${number1} ${operationSymbol} ${number2} = ${result}`
        });
        
    } catch (error) {
        res.json({
            success: false,
            error: 'Something went wrong with the calculation!'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🧮 Kids Calculator is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});

