const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\ACER\\Documents\\1miniProject\\frontend\\src';

const walkSync = function (dir, filelist) {
   var files = fs.readdirSync(dir);
   filelist = filelist || [];
   files.forEach(function (file) {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
         filelist = walkSync(dir + '/' + file, filelist);
      }
      else {
         if (file.endsWith('.jsx') || file.endsWith('.js')) {
            filelist.push(path.join(dir, file));
         }
      }
   });
   return filelist;
};

const replacements = [
   { find: /text-zinc-500/g, replace: 'text-zinc-300' },
   { find: /text-zinc-400/g, replace: 'text-zinc-200' },
   { find: /text-zinc-300/g, replace: 'text-white' },
   // Some legacy gray classes might still exist from before the first re-design
   { find: /text-gray-500/g, replace: 'text-zinc-300' },
   { find: /text-gray-400/g, replace: 'text-zinc-200' },
   { find: /text-gray-300/g, replace: 'text-white' },
];

const files = walkSync(srcDir);
let changedCount = 0;
files.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let original = content;

   replacements.forEach(r => {
      content = content.replace(r.find, r.replace);
   });

   if (original !== content) {
      fs.writeFileSync(file, content);
      console.log('Fixed contrast in: ' + file);
      changedCount++;
   }
});
console.log(`Updated contrast in ${changedCount} files.`);
