const fs = require('fs');
const path = require('path');

const folders = [
  'controllers',
  'models',
  'middlewares',
  'routes/api',
  'config',
  'public/images',
  'public/css',
  'public/js',
  'views'
];

const files = [
  { path: '.env.example', content: 
`MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=test

MSSQL_SERVER=localhost
MSSQL_USER=sa
MSSQL_PASSWORD=
MSSQL_DATABASE=test
` },
  { path: 'README.md', content: '# Express AdminLTE Template\n\nProject initialized.' }
];

folders.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created folder: ${dir}`);
  }
});

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file.path);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content);
    console.log(`Created file: ${file.path}`);
  }
});

console.log('Template structure initialized.');
