const fs = require('fs');
const path = require('path');

console.log('Fixing session token issue in backend...\n');

const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

// Find and replace the session creation code to delete old sessions first
const oldPattern1 = /await database_default\.userSession\.create\(\{[\s\S]*?data: \{[\s\S]*?userId: user\.id,[\s\S]*?token,[\s\S]*?expiresAt:[\s\S]*?\}\s*\}\);/g;

const newCode1 = `// Delete old sessions for this user first
    await database_default.userSession.deleteMany({
      where: { userId: user.id }
    });
    
    await database_default.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: /* @__PURE__ */ new Date(Date.now() + 24 * 60 * 60 * 1e3)
      }
    });`;

// Replace all occurrences
let count = 0;
serverCode = serverCode.replace(oldPattern1, () => {
  count++;
  return newCode1;
});

if (count > 0) {
  fs.writeFileSync(serverPath, serverCode, 'utf8');
  console.log(`✅ Fixed ${count} session creation(s) in server.js`);
  console.log('✅ Old sessions will now be deleted before creating new ones');
  console.log('\n⚠️  You need to restart the backend server:');
  console.log('   1. Stop the backend (Ctrl+C)');
  console.log('   2. Run: node server.js');
} else {
  console.log('❌ Could not find session creation code to fix');
  console.log('The code structure might be different than expected');
}
