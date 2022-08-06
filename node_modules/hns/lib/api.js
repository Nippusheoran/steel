var colors = require('colors');
var firebase = require('firebase');
var hnapi = new firebase('https://hacker-news.firebaseio.com/v0/');
var itemRef;
var exit_count;

module.exports = {
  topstories: function(limit) {
    if(typeof limit === 'undefined') {
      limit = 10;
    }

    var stories = [];
    var item;
    var topstories = hnapi.child('topstories');

    console.log('Fetching Top stories...\n');
    topstories.on('value', function(snap) {
      stories = snap.val();

      exit_count = 0;
      for (var i = 0; i <= limit-1; i++) {
        itemRef = hnapi.child('item').child(stories[i]);
        itemRef.on('value', function(snap) {
          item = snap.val();

          console.log(item.title + '\n' + item.score + ' points by ' + colors.yellow(item.by) + ' (' + colors.white.underline(item.url) + ')\n');
          exit_count++;
          if (exit_count == limit) {
            process.exit(0);
          }
        });
      }
   });
 },

  askstories: function(limit) {
    if(typeof limit === 'undefined') {
      limit = 10;
    }

    var askstories = [];
    var item;

    console.log('Fetching Ask HN stories...\n');
    hnapi.child('askstories').on('value', function(snap) {
      askstories = snap.val();

      exit_count = 0;
      for (var i = 0; i <= limit-1; i++) {
        itemRef = hnapi.child('item').child(askstories[i]);
        itemRef.on('value', function(snap) {
          item = snap.val();
          
          if (item.kids === undefined) { item.kids = []; }
          console.log(item.title + '\n' + item.score + ' points by ' + colors.yellow(item.by) + ' (' + item.kids.length + ' comments)\n' + 'URL: (' + colors.white.underline('https://news.ycombinator.com/item?id=' + item.id) + ')\n');
          exit_count++;
          if (exit_count == limit) {
            process.exit(0);
          }
        });
      }
    });  
  },
  
  showstories: function(limit) {
    if(typeof limit === 'undefined') {
        limit = 10;
    }

    var showstories = [];
    var item;

    console.log('Fetching Show HN stories...\n');
    hnapi.child('showstories').on('value', function(snap) {
      showstories = snap.val();

      exit_count = 0;
      for (var i = 0; i <= limit-1; i++) {
        itemRef = hnapi.child('item').child(showstories[i]);
        itemRef.on('value', function(snap) {
          item = snap.val();
          console.log(item.title + '\n' + item.score + ' points by ' + colors.yellow(item.by) + ' (' + colors.white.underline(item.url) + ')\n');
          exit_count++;
          if (exit_count == limit) {
            process.exit(0);
          }
        });
      }
    });
  },

  jobstories: function(limit) {
    if(typeof limit === 'undefined') {
        limit = 10;
    }

    var jobstories = [];
    var item;

    console.log('Fetching Job stories...\n');
    hnapi.child('jobstories').on('value', function(snap) {
      jobstories = snap.val();

      exit_count = 0;
      for (var i = 0; i <= limit-1; i++) {
        itemRef = hnapi.child('item').child(jobstories[i]);
        itemRef.on('value', function(snap) {
          item = snap.val();
          if (item.url === undefined) { item.url = ' - '; }

          console.log(colors.cyan(item.title) + '\n' + 'URL: ' + colors.white.underline(item.url) + '\n');
          exit_count++;
          if (exit_count == limit) {
            process.exit(0);
          }
        });
      }
    });
  },

  newstories: function(limit) {
    if(typeof limit === 'undefined') {
      limit = 10;
    }

    var newstories = [];
    var item;

    console.log('Fetching New stories...\n');
    hnapi.child('newstories').on('value', function(snap) {
      newstories = snap.val();

      exit_count = 0;
      for (var i = 0; i <= limit-1; i++) {
        itemRef = hnapi.child('item').child(newstories[i]);
        itemRef.on('value', function(snap) {
          item = snap.val();
          if (item.url === undefined) { item.url = ' - '; }

          console.log(item.title + '\n' + item.score + ' points by ' + colors.yellow(item.by) + ' (' + colors.white.underline(item.url) + ')\n');

          exit_count++;
          if (exit_count == limit) {
            process.exit(0);
          }
        });
      }
    });
  }
};