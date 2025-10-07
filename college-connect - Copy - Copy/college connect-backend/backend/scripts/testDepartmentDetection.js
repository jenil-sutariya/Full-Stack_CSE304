import { departmentDetector, generateDepartmentBio, extractStudentYear } from "../utils/helpers/departmentDetector.js";

// Test email patterns
const testEmails = [
    "21dcs001@charusat.edu.in",    // DCS student
    "22dit123@charusat.edu.in",    // DIT student  
    "23dce456@charusat.edu.in",    // DCE student
    "24dme789@charusat.edu.in",    // DME student
    "dee21001@charusat.edu.in",    // DEE student
    "dec22002@charusat.edu.in",    // DEC student
    "cspit21@charusat.edu.in",     // CSPIT student
    "pdpias123@charusat.edu.in",   // PDPIAS student
    "student123@charusat.edu.in",  // Unknown department
    "admin@charusat.ac.in",        // Different domain
];

console.log("🧪 Testing Department Detection System\n");
console.log("=" * 50);

testEmails.forEach((email, index) => {
    console.log(`\n${index + 1}. Testing: ${email}`);
    console.log("-".repeat(40));
    
    const department = departmentDetector(email);
    const studentYear = extractStudentYear(email);
    const bio = generateDepartmentBio(department, "Test Student");
    
    console.log(`📧 Email: ${email}`);
    console.log(`🏢 Department: ${department.name} (${department.code})`);
    console.log(`📚 Full Name: ${department.fullName}`);
    console.log(`📂 Category: ${department.category}`);
    console.log(`🔍 Auto-detected: ${department.detected ? '✅' : '❌'}`);
    console.log(`📅 Student Year: ${studentYear || 'Not detected'}`);
    console.log(`📝 Auto Bio: "${bio}"`);
});

console.log("\n" + "=" * 50);
console.log("✅ Department detection testing completed!");

// Test specific department codes
console.log("\n🔍 Testing specific department codes:");
const departmentCodes = ['DCS', 'DIT', 'DCE', 'DME', 'DEE', 'DEC'];
departmentCodes.forEach(code => {
    const testEmail = `21${code.toLowerCase()}001@charusat.edu.in`;
    const department = departmentDetector(testEmail);
    console.log(`${code} → ${department.name} (${department.detected ? '✅' : '❌'})`);
});
