// Department detection based on email ID patterns
const departmentDetector = (email) => {
    const emailPrefix = email.split('@')[0].toUpperCase();
    
    // Check if it's a professor email (usually contains words like faculty, prof, etc.)
    const professorKeywords = ['FACULTY', 'PROF', 'DR', 'TEACHER', 'INSTRUCTOR', 'HOD', 'DEAN'];
    const isProfessor = professorKeywords.some(keyword => emailPrefix.includes(keyword));
    
    // Department detection with priority order (more specific first)
    // DEPSTAR departments (with D prefix)
    const depstarDepartments = {
        'DCS': {
            name: 'DEPSTAR CSE',
            fullName: 'Department of Computer Science and Engineering - DEPSTAR',
            category: 'Engineering',
            abbreviation: 'CSE'
        },
        'DIT': {
            name: 'DEPSTAR IT', 
            fullName: 'Department of Information Technology - DEPSTAR',
            category: 'Engineering',
            abbreviation: 'IT'
        },
        'DCE': {
            name: 'DEPSTAR CE',
            fullName: 'Department of Computer Engineering - DEPSTAR', 
            category: 'Engineering',
            abbreviation: 'CE'
        }
    };

    // CSPIT departments (without D prefix)
    const cspitDepartments = {
        'CS': {
            name: 'CSPIT CSE',
            fullName: 'Chandubhai S. Patel Institute of Technology - CSE',
            category: 'Engineering',
            abbreviation: 'CSE'
        },
        'IT': {
            name: 'CSPIT IT',
            fullName: 'Chandubhai S. Patel Institute of Technology - IT',
            category: 'Engineering',
            abbreviation: 'IT'
        },
        'CE': {
            name: 'CSPIT CE',
            fullName: 'Chandubhai S. Patel Institute of Technology - Computer Engineering',
            category: 'Engineering',
            abbreviation: 'CE'
        }
    };

    // Check DEPSTAR departments first (higher priority)
    for (const [code, department] of Object.entries(depstarDepartments)) {
        if (emailPrefix.includes(code)) {
            return {
                code: code,
                name: department.name,
                fullName: department.fullName,
                category: department.category,
                abbreviation: department.abbreviation,
                detected: true,
                isProfessor: isProfessor
            };
        }
    }
    
    // Check CSPIT departments last (to avoid conflicts with DEPSTAR)
    for (const [code, department] of Object.entries(cspitDepartments)) {
        if (emailPrefix.includes(code)) {
            return {
                code: code,
                name: department.name,
                fullName: department.fullName,
                category: department.category,
                abbreviation: department.abbreviation,
                detected: true,
                isProfessor: isProfessor
            };
        }
    }
    
    // If no specific department found, try to detect from domain
    const domain = email.split('@')[1];
    if (domain === 'charusat.edu.in' || domain === 'charusat.ac.in' || domain === 'charusat.org') {
        return {
            code: 'UNKNOWN',
            name: 'Charusat University',
            fullName: 'Charusat University - Department Unknown',
            category: 'University',
            abbreviation: 'CHAR',
            detected: false,
            isProfessor: isProfessor
        };
    }
    
    // Default fallback
    return {
        code: 'GENERAL',
        name: 'General',
        fullName: 'General Department',
        category: 'General',
        abbreviation: 'GEN',
        detected: false,
        isProfessor: isProfessor
    };
};

// Generate bio text based on department
const generateDepartmentBio = (department, name) => {
    if (department.detected) {
        if (department.isProfessor) {
            return `${name} - ${department.fullName} faculty`;
        } else {
            return `${name} - ${department.fullName} student`;
        }
    } else {
        return `${name} - ${department.name} member`;
    }
};

// Get valid batch years (current year + last 3 years = 4 total batches)
const getValidBatchYears = () => {
    const currentYear = new Date().getFullYear();
    const currentYearShort = currentYear % 100; // Get last 2 digits (e.g., 2024 -> 24)
    
    const validBatches = [];
    
    // Current year + last 3 years = 4 total batches
    for (let i = 0; i < 4; i++) {
        const year = currentYearShort - i;
        const fullYear = 2000 + year;
        
        validBatches.push({
            shortYear: year.toString().padStart(2, '0'), // Ensure 2 digits (e.g., "21")
            fullYear: fullYear,
            displayText: `${fullYear} (${year.toString().padStart(2, '0')})`
        });
    }
    
    return validBatches;
};

// Check if a student year is valid (within current + last 3 years)
const isValidStudentYear = (year) => {
    const validBatches = getValidBatchYears();
    return validBatches.some(batch => batch.shortYear === year.toString().padStart(2, '0'));
};

// Extract student year from email if possible (only valid batch years)
const extractStudentYear = (email) => {
    const emailPrefix = email.split('@')[0];
    // Look for year patterns like 21, 22, 23, 24 etc.
    const yearMatch = emailPrefix.match(/(\d{2})/);
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        
        // Check if this year is in the valid batch years (current + last 3 years)
        if (isValidStudentYear(year)) {
            return `20${year}`;
        }
    }
    return null;
};

// Extract clean student ID from email for username (like 23dcs129)
const extractStudentId = (email) => {
    const emailPrefix = email.split('@')[0].toLowerCase();
    
    // Remove any trailing numbers that might have been added by the system
    // Keep the pattern like: 23dcs094, 21dit123, etc.
    // This preserves the year + department + student number format
    const cleanId = emailPrefix.replace(/\d{3,}$/, match => {
        // If there's a long number at the end (3+ digits), keep only the first 3
        return match.slice(0, 3);
    });
    
    return cleanId;
};

export { departmentDetector, generateDepartmentBio, extractStudentYear, extractStudentId, getValidBatchYears, isValidStudentYear };
