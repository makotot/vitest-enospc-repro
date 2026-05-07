const fs = require('fs');
const orgWatch = fs.watch;

let total = 0;
let current = 0;
let maxConcurrent = 0;

fs.watch = function patched(...args) {
  total++;
  current++;
  if (current > maxConcurrent) maxConcurrent = current;

  const watcher = orgWatch.apply(this, args);
  watcher.on('close', () => { current--; });
  return watcher;
};

process.on('exit', () => {
  process.stderr.write(
    `\n===== fs.watch summary (total=${total}, maxConcurrent=${maxConcurrent}) =====\n`
  );
});
