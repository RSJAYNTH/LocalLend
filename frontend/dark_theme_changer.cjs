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
   { find: /bg-white/g, replace: 'glass-panel text-white' },
   { find: /bg-gray-50/g, replace: '' }, // Body handles the main background
   { find: /text-gray-900/g, replace: 'text-zinc-100' },
   { find: /text-gray-800/g, replace: 'text-zinc-200' },
   { find: /text-gray-700/g, replace: 'text-zinc-300' },
   { find: /text-gray-600/g, replace: 'text-zinc-400' },
   { find: /text-gray-500/g, replace: 'text-zinc-500' },
   { find: /border-gray-100/g, replace: 'border-white/10' },
   { find: /border-gray-200/g, replace: 'border-white/20' },
   { find: /shadow-sm/g, replace: '' }, // Glass panel handles shadow
   { find: /shadow-md/g, replace: 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]' }
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
      console.log('Updated structural classes in: ' + file);
      changedCount++;
   }
});
console.log(`Updated layout in ${changedCount} files.`);
