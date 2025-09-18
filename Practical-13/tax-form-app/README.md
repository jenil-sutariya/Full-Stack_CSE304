# Tax Form Income Calculator

A secure web application built with Express.js and EJS templates that allows users to calculate their total income from two sources. All calculations are performed server-side to ensure security and accuracy.

## Features

- **Server-side validation**: All input validation and calculations are performed on the server
- **User-friendly interface**: Clean, responsive design with clear error messages
- **Input validation**: Validates that income values are numbers between 0 and 10,000,000
- **Secure processing**: No client-side calculations to prevent tampering
- **Responsive design**: Works on desktop and mobile devices
- **Print functionality**: Users can print their results

## Installation

1. Navigate to the project directory:
   ```bash
   cd tax-form-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enter your primary and secondary income amounts
4. Click "Calculate Total Income" to see the results

## API Endpoints

- `GET /` - Displays the income input form
- `POST /calculate` - Processes the form data and calculates total income

## Validation Rules

- Both income fields are required
- Income values must be valid numbers
- Income values must be between 0 and 10,000,000
- All calculations are performed server-side

## Technologies Used

- **Express.js**: Web framework for Node.js
- **EJS**: Embedded JavaScript templating engine
- **HTML5**: Semantic markup with form validation
- **CSS3**: Modern styling with gradients and animations
- **Node.js**: JavaScript runtime environment

## Security Features

- Server-side input validation
- No client-side calculations
- Input sanitization
- XSS protection through EJS templating

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

ISC License
