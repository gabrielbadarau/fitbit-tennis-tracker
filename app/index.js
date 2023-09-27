import * as messaging from 'messaging';
import * as fs from 'fs';
import document from 'document';
import clock from 'clock';
import exercise from 'exercise';
import { display } from 'display';
import { HeartRateSensor } from 'heart-rate';
import { me } from 'appbit';
import { vibration } from 'haptics';

// App
const app = document.getElementById('app');

// HeartRate Settings
const heartRate = new HeartRateSensor({ frequency: 1 });

// Clock Settings
clock.granularity = 'minutes';

const myClock = document.getElementById('myClock');

clock.ontick = function (evt) {
  myClock.text =
    ('0' + evt.date.getHours()).slice(-2) +
    ':' +
    ('0' + evt.date.getMinutes()).slice(-2);
};

// Home Screen
const homeScreen = document.getElementById('home-screen');
const btnHomeTr = document.getElementById('btn-home-tr');
const btnHomeTl = document.getElementById('btn-home-tl');
const btnHomeStart = document.getElementById('btn-home-start');
const txtHomeStart = document.getElementById('txt-home-start');
const imgHomeStart = document.getElementById('img-home-start');
const btnHomeHistory = document.getElementById('btn-home-history');
const txtHomeHistory = document.getElementById('txt-home-history');
const imgHomeHistory = document.getElementById('img-home-history');

// Opponent Screen
const opponentScreen = document.getElementById('opponent-screen');
const btnOpponentName = document.getElementById('btn-opponent-name');
const btnOpponentBack = document.getElementById('btn-opponent-tl');
const txtOpponentName = document.getElementById('txt-opponent-name');

// Settings Screen
const settingsScreen = document.getElementById('settings-screen');
const btnSettingsFormat = document.getElementById('btn-settings-format');
const btnSettingsBack = document.getElementById('btn-settings-tl');
const txtSettingsFormat = document.getElementById('txt-settings-format');

// First Server Screen
const firstServerScreen = document.getElementById('first-server-screen');
const btnServerMe = document.getElementById('btn-server-me');
const btnServerOpponent = document.getElementById('btn-server-opponent');
const txtServerMe = document.getElementById('txt-server-me');
const txtServerOpponent = document.getElementById('txt-server-opponent');
const txtServerOpponentFooter = document.getElementById(
  'txt-server-opponent-footer'
);

// Playing Screen
const playingScreen = document.getElementById('playing-screen');
const containerPanorama = document.getElementById('panorama-container');
const firstPanorama = document.getElementById('panorama1');
const secondPanorama = document.getElementById('panorama2');
const btnPlayingBack = document.getElementById('btn-playing-tl');
const txtPlayOpponent = document.getElementById('txt-play-opponent');
const txtPlayOpponent2 = document.getElementById('txt-play-opponent-2');
const btnPlayingFinish = document.getElementById('btn-playing-bl');
const btnSwitchSides = document.getElementById('btn-switch-sides');
const txtSwitchSides = document.getElementById('txt-switch-sides');
const imgActiveTime = document.getElementById('img-play-timer');
const imgHeartRate = document.getElementById('img-heart-rate');
const circlePlayingOpponent = document.getElementById(
  'circle-playing-opponent'
);
const circlePlayingMe = document.getElementById('circle-playing-me');
const txtHeartRate = document.getElementById('txt-play-heart-rate');

// Playing Score Screen
const btnPlayingOpponentScore = document.getElementById('btn-score-opponent');
const btnPlayingMeScore = document.getElementById('btn-score-me');
const txtPlayScoreOpponent = document.getElementById('txt-score-opponent');
const txtPlayScoreMe = document.getElementById('txt-score-me');
const txtMeTotalBreakPoints = document.getElementById(
  'txt-play-total-breakpoints-me'
);
const txtMeWonBreakPoints = document.getElementById(
  'txt-play-converted-breakpoints-me'
);
const txtOpponentTotalBreakPoints = document.getElementById(
  'txt-play-total-breakpoints-opponent'
);
const txtOpponentWonBreakPoints = document.getElementById(
  'txt-play-converted-breakpoints-opponent'
);
const txtPlayGames = {
  1: {
    opponent: document.getElementById('txt-play-games-opponent-1'),
    me: document.getElementById('txt-play-games-me-1'),
  },
  2: {
    opponent: document.getElementById('txt-play-games-opponent-2'),
    me: document.getElementById('txt-play-games-me-2'),
  },
  3: {
    opponent: document.getElementById('txt-play-games-opponent-3'),
    me: document.getElementById('txt-play-games-me-3'),
  },
  4: {
    opponent: document.getElementById('txt-play-games-opponent-4'),
    me: document.getElementById('txt-play-games-me-4'),
  },
  5: {
    opponent: document.getElementById('txt-play-games-opponent-5'),
    me: document.getElementById('txt-play-games-me-5'),
  },
};

// Stats Screen
const txtStatsCalories = document.getElementById('txt-play-calories');
const txtStatsActiveTime = document.getElementById('txt-play-timer');
const txtStatsDistance = document.getElementById('txt-play-distance');

// Popup Exit Screen
const popupExitScreen = document.getElementById('popup-exit');
const btnLeftPopup = document.getElementById('btn-popup-left');
const btnRightPopup = document.getElementById('btn-popup-right');
const txtLeftPopup = document.getElementById('txt-popup-left');
const txtRightPopup = document.getElementById('txt-popup-right');

// Match History Screen
const matchHistoryScreen = document.getElementById('history-screen');
const btnHistoryBack = document.getElementById('btn-history-tl');
const txtHistoryMatches = {
  1: {
    matchTitle: document.getElementById('txt-first-history-match'),
  },
  2: {
    matchTitle: document.getElementById('txt-second-history-match'),
  },
  3: {
    matchTitle: document.getElementById('txt-third-history-match'),
  },
};
const txtScoreHistoryMatches = {
  1: {
    score: document.getElementById('txt-score-first-history-match'),
  },
  2: {
    score: document.getElementById('txt-score-second-history-match'),
  },
  3: {
    score: document.getElementById('txt-score-third-history-match'),
  },
};

// Make app not close after 2 minutes
me.appTimeoutEnabled = false;
// Initialize File System Data
initializeFileSystem();

// global variables
let statsInterval;
let opponentName = 'Opponent';
let opponents = [];
let classicMatchFormat = true;
let server = '';
let tiebreakServer = '';
let numberOfSets = 0;
let score = {
  me: {
    sets: 0,
    games: 0,
    current: 0,
    breakpointsTotal: 0,
    breakpointsWon: 0,
  },
  opponent: {
    sets: 0,
    games: 0,
    current: 0,
    breakpointsTotal: 0,
    breakpointsWon: 0,
  },
  draw: false,
  tiebreak: false,
};
let historyMatches;

// Event handlers from Home Screen
btnHomeTl.onactivate = function () {
  homeScreen.style.display = 'none';
  opponentScreen.style.display = 'inline';
};

btnHomeTr.onactivate = function () {
  homeScreen.style.display = 'none';
  settingsScreen.style.display = 'inline';
};

btnHomeStart.onactivate = function () {
  homeScreen.style.display = 'none';
  firstServerScreen.style.display = 'inline';

  txtServerOpponent.text = opponentName.toUpperCase().slice(0, 2);
  txtServerOpponentFooter.text = opponentName;
  txtPlayOpponent.text = opponentName.toUpperCase().slice(0, 2);
  txtPlayOpponent2.text = opponentName.toUpperCase().slice(0, 2);

  containerPanorama.value = 1;

  startHeartRate();
  startExercise();
};

btnHomeHistory.onactivate = function () {
  homeScreen.style.display = 'none';
  matchHistoryScreen.style.display = 'inline';

  updateHistoryMatchesScreen();
};

// Event handlers from Opponent Screen
btnOpponentName.onactivate = function () {
  const opponentsNames = opponents.map((opponent) => opponent.name);
  const i = opponentsNames.indexOf(opponentName);

  if (i + 1 === opponents.length) {
    opponentName = opponents[0].name;
    txtOpponentName.text = opponents[0].name;
  } else {
    opponentName = opponents[i + 1].name;
    txtOpponentName.text = opponents[i + 1].name;
  }
};

btnOpponentBack.onactivate = function () {
  homeScreen.style.display = 'inline';
  opponentScreen.style.display = 'none';
};

// Event handlers from Settings Screen
btnSettingsBack.onactivate = function () {
  settingsScreen.style.display = 'none';
  homeScreen.style.display = 'inline';
};

btnSettingsFormat.onactivate = function () {
  if (classicMatchFormat) {
    txtSettingsFormat.text = 'Tiebreak';
    classicMatchFormat = false;
  } else {
    txtSettingsFormat.text = 'Classic';
    classicMatchFormat = true;
  }
};

// Event handlers from First Server Screen
btnServerMe.onactivate = function () {
  firstServerScreen.style.display = 'none';
  playingScreen.style.display = 'inline';
  circlePlayingMe.style.display = 'inline';

  server = 'me';
};

btnServerOpponent.onactivate = function () {
  firstServerScreen.style.display = 'none';
  playingScreen.style.display = 'inline';
  circlePlayingOpponent.style.display = 'inline';

  server = opponentName;
};

// Event handlers from Playing Screen
btnPlayingBack.onactivate = function () {
  playingScreen.style.display = 'none';
  popupExitScreen.style.display = 'inline';
};

btnPlayingFinish.addEventListener('click', (evt) => {
  playingScreen.style.display = 'none';
  homeScreen.style.display = 'inline';

  storeMatchData();

  stopHeartRate();
  stopExercise();
  resetApp();
});

btnPlayingMeScore.addEventListener('click', (evt) => {
  updateCurrentScore('me');
});

btnPlayingOpponentScore.addEventListener('click', (evt) => {
  updateCurrentScore('opponent');
});

btnSwitchSides.addEventListener('click', (evt) => {
  vibration.stop();
});

// Event handlers from Popup Exit Screen
btnLeftPopup.onactivate = function () {
  popupExitScreen.style.display = 'none';
  playingScreen.style.display = 'inline';
};

btnRightPopup.onactivate = function () {
  popupExitScreen.style.display = 'none';
  homeScreen.style.display = 'inline';

  stopHeartRate();
  stopExercise();
  resetApp();
};

// Event handlers from History Screen
btnHistoryBack.onactivate = function () {
  homeScreen.style.display = 'inline';
  matchHistoryScreen.style.display = 'none';
};

// Listen to Settings from companion
messaging.peerSocket.addEventListener('message', (evt) => {
  if (evt && evt.data && evt.data.key === 'background-color') {
    app.style.fill = evt.data.value;

    btnHomeTr.style.fill = evt.data.value;
    btnHomeTl.style.fill = evt.data.value;

    btnOpponentBack.style.fill = evt.data.value;

    btnSettingsBack.style.fill = evt.data.value;

    firstPanorama.style.fill = evt.data.value;
    secondPanorama.style.fill = evt.data.value;

    btnPlayingBack.style.fill = evt.data.value;
    btnPlayingFinish.style.fill = evt.data.value;

    txtSwitchSides.style.fill = evt.data.value;

    btnHistoryBack.style.fill = evt.data.value;
    txtHistoryMatches[1].matchTitle.style.fill = evt.data.value;
    txtHistoryMatches[2].matchTitle.style.fill = evt.data.value;
    txtHistoryMatches[3].matchTitle.style.fill = evt.data.value;
  }

  if (evt && evt.data && evt.data.key === 'opponents-list') {
    if (!evt.data.value.length) {
      txtOpponentName.text = 'Not found';
    } else {
      opponents = evt.data.value;
      opponentName = opponents[0].name;
      txtOpponentName.text = opponents[0].name;
    }
  }
});

// Physical Back Button function
document.onkeypress = function (e) {
  e.preventDefault();

  if (
    playingScreen.style.display === 'none' &&
    popupExitScreen.style.display === 'none'
  ) {
    me.exit();
  }
};

// Functions definitions
function startHeartRate() {
  heartRate.addEventListener('reading', () => {
    txtHeartRate.text = heartRate.heartRate;
  });

  display.addEventListener('change', () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? heartRate.start() : heartRate.stop();
  });

  if (me.permissions.granted('access_heart_rate')) {
    heartRate.start();
  }
}

function stopHeartRate() {
  heartRate.stop();
}

function startExercise() {
  if (me.permissions.granted('access_exercise')) {
    exercise.start('tennis');
  }

  statsInterval = setInterval(() => {
    // handle active time change
    txtStatsActiveTime.text = `${Math.floor(
      exercise.stats.activeTime / (60 * 1000)
    )}'`;

    // handle calories change
    txtStatsCalories.text = exercise.stats.calories;

    // handle distance change
    txtStatsDistance.text = (exercise.stats.distance / 1000).toFixed(2);
  }, 60000);
}

function stopExercise() {
  clearInterval(statsInterval);
  exercise.stop();
}

function toggleServerChange() {
  server = server === 'me' ? opponentName : 'me';

  tiebreakServer = '';
  score.me.current = 0;
  score.opponent.current = 0;

  circlePlayingMe.style.display = server === 'me' ? 'inline' : 'none';
  circlePlayingOpponent.style.display = server === 'me' ? 'none' : 'inline';
}

function transformScore(value) {
  const score = 0;

  switch (value) {
    case 0:
      score = 0;
      break;
    case 1:
      score = 15;
      break;
    case 2:
      score = 30;
      break;
    case 3:
      score = 40;
      break;
    case 4:
      score = 'AD';
      break;
    default:
      score = 0;
  }

  return score;
}

function updateDisplayScore() {
  const possibleNewNumberOfSets = score.me.sets + score.opponent.sets;

  txtPlayScoreMe.text =
    score.tiebreak || !classicMatchFormat
      ? score.me.current
      : transformScore(score.me.current);

  txtPlayScoreOpponent.text =
    score.tiebreak || !classicMatchFormat
      ? score.opponent.current
      : transformScore(score.opponent.current);

  if (numberOfSets <= 4) {
    txtPlayGames[numberOfSets + 1].me.text = score.me.games;
    txtPlayGames[numberOfSets + 1].opponent.text = score.opponent.games;
  }

  if (possibleNewNumberOfSets !== numberOfSets) {
    score.opponent.games = 0;
    score.me.games = 0;
    numberOfSets = possibleNewNumberOfSets;
  }

  if (score.tiebreak || !classicMatchFormat) {
    handleShowTiebreakServer();
  }

  txtMeTotalBreakPoints.text = score.me.breakpointsTotal;
  txtMeWonBreakPoints.text = score.me.breakpointsWon;
  txtOpponentTotalBreakPoints.text = score.opponent.breakpointsTotal;
  txtOpponentWonBreakPoints.text = score.opponent.breakpointsWon;
}

function updateCurrentScore(player) {
  if (isBreakpoint() && classicMatchFormat) {
    if (server === 'me' && player === 'opponent') {
      score.opponent.breakpointsWon++;
    }
    if (server === opponentName && player === 'me') {
      score.me.breakpointsWon++;
    }
  }

  if (!classicMatchFormat) {
    score.tiebreak = true;
  }

  score[player].current++;

  if (score.tiebreak) {
    const minWinPoints = classicMatchFormat ? 7 : 10;

    if (
      score.me.current >= minWinPoints &&
      score.me.current - score.opponent.current >= 2
    ) {
      updateScoreGames('me');
      if (classicMatchFormat) {
        updateScoreSets('me');
      }
    } else if (
      score.opponent.current >= minWinPoints &&
      score.opponent.current - score.me.current >= 2
    ) {
      updateScoreGames('opponent');
      if (classicMatchFormat) {
        updateScoreSets('me');
      }
    }

    if ((score.me.current + score.opponent.current) % 6 === 0) {
      toggleSwitchSides();
      vibration.start('alert');
      setTimeout(function () {
        vibration.stop();
      }, 8500);
      setTimeout(function () {
        toggleSwitchSides();
      }, 9000);
    }
  } else {
    // check if it's 40:40
    if (score.me.current === score.opponent.current && score.me.current === 3) {
      score.draw = true;
    }

    if (score.draw) {
      if (player === 'me' && score.opponent.current === 4) {
        score[player].current--;
        score.opponent.current = 3;
      }

      if (player === 'opponent' && score.me.current === 4) {
        score[player].current--;
        score.me.current = 3;
      }

      if (score[player].current === 5) {
        updateScoreGames(player);
      }
    } else {
      if (score[player].current === 4) {
        updateScoreGames(player);
      }
    }
  }

  updateDisplayScore();
}

function updateScoreGames(player) {
  score[player].games++;
  score.draw = false;
  toggleServerChange();
  checkIfSwitchSides();

  if (score.me.games === score.opponent.games && score.me.games === 6) {
    score.tiebreak = true;
    tiebreakServer = server;
  }

  if (!score.tiebreak) {
    if (score.me.games >= 6 && score.me.games - score.opponent.games >= 2) {
      updateScoreSets('me');
    }
    if (
      score.opponent.games >= 6 &&
      score.opponent.games - score.me.games >= 2
    ) {
      updateScoreSets('opponent');
    }
  }
}

function updateScoreSets(player) {
  score.tiebreak = false;
  score[player].sets++;

  if (score.me.sets + score.opponent.sets === 1) {
    txtPlayGames[2].me.style.display = 'inline';
    txtPlayGames[2].opponent.style.display = 'inline';
  }

  if (score.me.sets + score.opponent.sets === 2) {
    txtPlayGames[3].me.style.display = 'inline';
    txtPlayGames[3].opponent.style.display = 'inline';
  }

  if (score.me.sets + score.opponent.sets === 3) {
    txtPlayGames[4].me.style.display = 'inline';
    txtPlayGames[4].opponent.style.display = 'inline';
  }

  if (score.me.sets + score.opponent.sets === 4) {
    txtPlayGames[5].me.style.display = 'inline';
    txtPlayGames[5].opponent.style.display = 'inline';
  }
}

function handleShowTiebreakServer() {
  if ((score.me.current + score.opponent.current) % 2 === 1) {
    tiebreakServer = tiebreakServer === 'me' ? ' opponent' : 'me';

    circlePlayingMe.style.display = tiebreakServer === 'me' ? 'inline' : 'none';
    circlePlayingOpponent.style.display =
      tiebreakServer === 'me' ? 'none' : 'inline';
  }
}

function toggleSwitchSides() {
  btnPlayingFinish.style.display =
    btnPlayingFinish.style.display === 'inherit' ? 'none' : 'inherit';
  imgActiveTime.style.display =
    imgActiveTime.style.display === 'inherit' ? 'none' : 'inherit';
  txtStatsActiveTime.style.display =
    txtStatsActiveTime.style.display === 'inherit' ? 'none' : 'inherit';
  imgHeartRate.style.display =
    imgHeartRate.style.display === 'inherit' ? 'none' : 'inherit';
  txtHeartRate.style.display =
    txtHeartRate.style.display === 'inherit' ? 'none' : 'inherit';

  btnSwitchSides.style.display =
    btnSwitchSides.style.display === 'none' ? 'inherit' : 'none';
}

function checkIfSwitchSides() {
  if ((score.me.games + score.opponent.games) % 2 === 1) {
    toggleSwitchSides();
    vibration.start('alert');
    setTimeout(function () {
      vibration.stop();
    }, 8500);
    setTimeout(function () {
      toggleSwitchSides();
    }, 9000);
  }
}

function isBreakpoint() {
  if (!score.tiebreak) {
    if (!score.draw) {
      if (
        server === 'me' &&
        score.opponent.current === 3 &&
        score.me.current < 3
      ) {
        score.opponent.breakpointsTotal++;
        return true;
      }
      if (
        server === opponentName &&
        score.me.current === 3 &&
        score.opponent.current < 3
      ) {
        score.me.breakpointsTotal++;
        return true;
      }
    } else {
      if (
        server === 'me' &&
        score.opponent.current === 4 &&
        score.me.current === 3
      ) {
        score.opponent.breakpointsTotal++;
        return true;
      }
      if (
        server === opponentName &&
        score.me.current === 4 &&
        score.opponent.current === 3
      ) {
        score.me.breakpointsTotal++;
        return true;
      }
    }
  }

  return false;
}

function initializeFileSystem() {
  try {
    const fileData = fs.default.readFileSync(
      'tennis-match-history.txt',
      'json'
    );

    historyMatches = [...fileData.matches];
  } catch (e) {
    console.log("File doesn't exist, we will create it now.");
    console.log(e);
    let data = { matches: [] };

    fs.default.writeFileSync('tennis-match-history.txt', data, 'json');
  }
}

function storeMatchData() {
  const date = exercise.startDate;
  const splitDate = date.toString().split(' ');
  const titleMatch = `vs ${opponentName} - ${splitDate[2]} ${splitDate[1]}`;
  const numberOfSets = score.me.sets + score.opponent.sets;
  const opponentGames = [];
  const meGames = [];
  for (let i = 0; i < numberOfSets + 1; i++) {
    if (
      Number(txtPlayGames[i + 1].opponent.text) +
        Number(txtPlayGames[i + 1].me.text) !==
      0
    ) {
      opponentGames.push(txtPlayGames[i + 1].opponent.text);
      meGames.push(txtPlayGames[i + 1].me.text);
    }
  }
  const matchData = {
    date,
    title: titleMatch,
    opponentGames,
    meGames,
  };

  historyMatches.unshift(matchData);
  updateFileData();
}

function updateFileData() {
  if (historyMatches.length >= 4) {
    historyMatches.pop();
  }

  let data = { matches: [...historyMatches] };

  fs.default.writeFileSync('tennis-match-history.txt', data, 'json');
}

function updateHistoryMatchesScreen() {
  const fileData = fs.default.readFileSync('tennis-match-history.txt', 'json');

  for (let i = 1; i <= fileData.matches.length; i++) {
    txtHistoryMatches[i].matchTitle.text = fileData.matches[i - 1].title;

    let scoreMatch = '';
    const length = fileData.matches[i - 1].meGames.length;

    for (let j = 0; j < length; j++) {
      const score = ` ${fileData.matches[i - 1].meGames[j]}-${
        fileData.matches[i - 1].opponentGames[j]
      } `;
      scoreMatch = scoreMatch + score;
    }

    txtScoreHistoryMatches[i].score.text = scoreMatch;
  }
}

function resetApp() {
  score.draw = false;
  score.tiebreak = false;
  score.opponent.current = 0;
  score.opponent.games = 0;
  score.opponent.sets = 0;
  score.opponent.breakpointsWon = 0;
  score.opponent.breakpointsTotal = 0;
  score.me.current = 0;
  score.me.games = 0;
  score.me.sets = 0;
  score.me.breakpointsWon = 0;
  score.me.breakpointsTotal = 0;
  numberOfSets = 0;

  for (let i = 2; i <= 5; i++) {
    txtPlayGames[i].me.text = 0;
    txtPlayGames[i].opponent.text = 0;
    txtPlayGames[i].me.style.display = 'none';
    txtPlayGames[i].opponent.style.display = 'none';
  }

  updateDisplayScore();

  server = '';
  tiebreakServer = '';

  circlePlayingOpponent.style.display = 'none';
  circlePlayingMe.style.display = 'none';
}

// Dynamic Styles
// Style for Start button from Home Screen
btnHomeStart.addEventListener('mousedown', function () {
  txtHomeStart.style.fill = app.style.fill;
  imgHomeStart.style.fill = app.style.fill;
});
btnHomeStart.addEventListener('mouseup', function () {
  txtHomeStart.style.fill = 'white';
  imgHomeStart.style.fill = 'white';
});

// Style for History button from Home Screen
btnHomeHistory.addEventListener('mousedown', function () {
  txtHomeHistory.style.fill = app.style.fill;
  imgHomeHistory.style.fill = app.style.fill;
});
btnHomeHistory.addEventListener('mouseup', function () {
  txtHomeHistory.style.fill = 'white';
  imgHomeHistory.style.fill = 'white';
});

// Style for Opponent Name button from Opponent Screen
btnOpponentName.addEventListener('mousedown', function () {
  txtOpponentName.style.fill = app.style.fill;
});
btnOpponentName.addEventListener('mouseup', function () {
  txtOpponentName.style.fill = 'white';
});

// Style for Settings Format button from Settings Screen
btnSettingsFormat.addEventListener('mousedown', function () {
  txtSettingsFormat.style.fill = app.style.fill;
});
btnSettingsFormat.addEventListener('mouseup', function () {
  txtSettingsFormat.style.fill = 'white';
});

// Style for Server Me button from First Server Screen
btnServerMe.addEventListener('mousedown', function () {
  txtServerMe.style.fill = app.style.fill;
});
btnServerMe.addEventListener('mouseup', function () {
  txtServerMe.style.fill = 'white';
});

// Style for Server Opponent button from First Server Screen
btnServerOpponent.addEventListener('mousedown', function () {
  txtServerOpponent.style.fill = app.style.fill;
});
btnServerOpponent.addEventListener('mouseup', function () {
  txtServerOpponent.style.fill = 'white';
});

// Style for Popup buttons from Popup Screen
btnLeftPopup.addEventListener('mousedown', function () {
  txtLeftPopup.style.fill = app.style.fill;
});
btnLeftPopup.addEventListener('mouseup', function () {
  txtLeftPopup.style.fill = 'white';
});
btnRightPopup.addEventListener('mousedown', function () {
  txtRightPopup.style.fill = app.style.fill;
});
btnRightPopup.addEventListener('mouseup', function () {
  txtRightPopup.style.fill = 'white';
});

// Style for Score Buttons
btnPlayingOpponentScore.addEventListener('mousedown', function () {
  txtPlayScoreOpponent.style.fill = app.style.fill;
});
btnPlayingOpponentScore.addEventListener('mouseup', function () {
  txtPlayScoreOpponent.style.fill = 'white';
});
btnPlayingMeScore.addEventListener('mousedown', function () {
  txtPlayScoreMe.style.fill = app.style.fill;
});
btnPlayingMeScore.addEventListener('mouseup', function () {
  txtPlayScoreMe.style.fill = 'white';
});
