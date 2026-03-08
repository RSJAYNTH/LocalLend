const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\ACER\\Documents\\1miniProject\\frontend\\src';

const mapColor = (match, color, shade, slashAlpha) => {
   let s = parseInt(shade);
   let newShade = s;
   if (s === 50) newShade = 100;
   else if (s === 100) newShade = 200;
   else if (s === 200) newShade = 300;
   else if (s === 300) newShade = 400;
   else if (s === 400) newShade = 500;
   else if (s === 500) newShade = 700;
   else if (s === 600) newShade = 900;
   else if (s === 700) newShade = 950;
   else if (s >= 800) newShade = 950;

   return `zinc-${newShade}${slashAlpha || ''}`;
};

const walkSync = function (dir, filelist) {
   var files = fs.readdirSync(dir);
   filelist = filelist || [];
   files.forEach(function (file) {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
         filelist = walkSync(dir + '/' + file, filelist);
      }
      else {
         if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            filelist.push(path.join(dir, file));
         }
      }
   });
   return filelist;
};

const files = walkSync(srcDir);
let changedCount = 0;
files.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let original = content;

   content = content.replace(/\b(blue|indigo|purple)-(\d+)(\/[0-9]+)?\b/g, mapColor);

   if (original !== content) {
      fs.writeFileSync(file, content);
      console.log('Updated: ' + file);
      changedCount++;
   }
});
console.log(`Updated ${changedCount} files.`);
