const fs = require('fs');
const readline = require('readline');
const p = 'C:/Users/Jeshurun/.gemini/antigravity-ide/brain/8e1a7569-0f55-435c-9edd-5d9dd0f59050/.system_generated/logs/transcript_full.jsonl';
const fileStream = fs.createReadStream(p);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('"step_index":2005') || line.includes('"step_index": 2005')) {
    const obj = JSON.parse(line);
    console.log('Keys in step 2005:', Object.keys(obj));
    if (obj.media_paths) console.log('media_paths:', obj.media_paths);
    if (obj.files) console.log('files:', obj.files);
    if (obj.attachments) console.log('attachments:', obj.attachments);
    // Find all paths or image strings in content
    const imgMatches = obj.content ? obj.content.match(/[^\s"'\(\)\[\]<>]+\.(?:png|jpg|jpeg|webp)/gi) : [];
    console.log('Image matches in content:', imgMatches);
    // Search for base64 or tempmedia or any file paths
    const fileMatches = obj.content ? obj.content.match(/[A-Za-z]:\\[^\s"'\<\>]+/g) : [];
    console.log('Path matches:', fileMatches);
    rl.close();
  }
});
