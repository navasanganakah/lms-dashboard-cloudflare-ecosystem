const fs = require('fs'); const file = 'app/page.tsx'; const content = fs.readFileSync(file, 'utf8'); fs.writeFileSync(file, content.replace(/ns_session_token/g, 'auth_token'));
