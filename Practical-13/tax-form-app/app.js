const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Validation function
function validateIncome(income) {
    const num = parseFloat(income);
    return !isNaN(num) && num >= 0 && num <= 10000000; // Max 10 million
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Tax Form - Income Calculator',
        errors: null,
        formData: null
    });
});

app.post('/calculate', (req, res) => {
    const { primaryIncome, secondaryIncome } = req.body;
    const errors = [];
    
    // Validate primary income
    if (!primaryIncome || primaryIncome.trim() === '') {
        errors.push('Primary income is required');
    } else if (!validateIncome(primaryIncome)) {
        errors.push('Primary income must be a valid number between 0 and 10,000,000');
    }
    
    // Validate secondary income
    if (!secondaryIncome || secondaryIncome.trim() === '') {
        errors.push('Secondary income is required');
    } else if (!validateIncome(secondaryIncome)) {
        errors.push('Secondary income must be a valid number between 0 and 10,000,000');
    }
    
    if (errors.length > 0) {
        return res.render('index', {
            title: 'Tax Form - Income Calculator',
            errors: errors,
            formData: { primaryIncome, secondaryIncome }
        });
    }
    
    // Calculate total income
    const totalIncome = parseFloat(primaryIncome) + parseFloat(secondaryIncome);
    
    res.render('result', {
        title: 'Tax Form - Results',
        primaryIncome: parseFloat(primaryIncome),
        secondaryIncome: parseFloat(secondaryIncome),
        totalIncome: totalIncome
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Tax form server is running on http://localhost:${PORT}`);
});
