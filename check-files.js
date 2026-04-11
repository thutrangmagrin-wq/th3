const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Components
  'src/components/CustomButton.js',
  'src/components/CustomInput.js',
  'src/components/Logo.js',
  
  // Screens
  'src/screens/OnboardingScreen.js',
  'src/screens/SignInScreen.js',
  'src/screens/SignUpScreen.js',
  'src/screens/HomeScreen.js',
  
  // Services & Utils
  'src/services/AuthService.js',
  'src/utils/validation.js',
  
  // Navigation
  'src/navigation/AppNavigator.js',
  
  // Root
  'App.js',
  'package.json',
];

console.log('🔍 Checking required files...\n');

let allFilesExist = true;
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
    missingFiles.push(file);
  }
});

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('✅ All required files exist!');
  console.log('\nNext steps:');
  console.log('1. Run: npm start');
  console.log('2. Scan QR code with Expo Go');
  console.log('3. Test the app');
} else {
  console.log('❌ Some files are missing:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nPlease create the missing files.');
}

console.log('='.repeat(50));
