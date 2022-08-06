#!/usr/bin/env node

'use strict';
var hn = require('./lib/api');
var cmd = require('commander');
var pkg = require("./package.json");

var cmdVal; // command value

cmd
  .usage('<command> [-l LIMIT]')
  .version(pkg.version)
  .option('-l, --limit [number]', 'limit the number of posts to be displayed', /^[0-9]+$/);
cmd
  .command('top')
  .description('Top stories');
cmd
  .command('new')
  .description('New stories');
cmd
  .command('show')
  .description('Show HN stories');
cmd
  .command('ask')
  .description('Ask HN stories');
cmd
  .command('jobs')
  .description('Job stories');
cmd
  .arguments('<cmd>')
  .action(function (cmd) { cmdVal = cmd; });

cmd.on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ hns top');
  console.log('    $ hns top -l 3');
  console.log('    $ hns show -l 5');
  console.log('');
});

cmd.parse(process.argv);

var l = cmd.limit;
switch (cmdVal) {
  case 'top':
      hn.topstories(l); // node-hn library will evaluate the option's value
      break;
  case 'new':
      hn.newstories(l);
      break;
  case 'show':
      hn.showstories(l);
      break;
  case 'ask':
      hn.askstories(l);
      break;
  case 'jobs':
      hn.jobstories(l);
      break;
  default:
      cmd.outputHelp();
      process.exit(0);
}
