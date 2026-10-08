const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/Jeshurun/.gemini/antigravity-ide/brain/8e1a7569-0f55-435c-9edd-5d9dd0f59050/.tempmediaStorage';
const list = fs.readdirSync(dir).map(f => {
  const stat = fs.statSync(path.join(dir, f));
  return { name: f, size: stat.size, time: stat.mtime.toISOString() };
});
list.sort((a,b) => a.time.localeCompare(b.time));
// print items around 14:50 - 15:00
console.log(list.filter(item => item.time >= '2026-10-08T14:45:00.000Z' && item.time <= '2026-10-08T15:00:00.000Z'));
