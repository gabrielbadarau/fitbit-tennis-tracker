import { settingsStorage } from 'settings';
import * as messaging from 'messaging';
import { me as companion } from 'companion';

let BG_COLOR = 'background-color';
let OPPONENTS_LIST = 'opponents-list';

// Send initial settings to app
messaging.peerSocket.onopen = function sendInitialSettings() {
  sendValue(BG_COLOR, settingsStorage.getItem(BG_COLOR));
  sendValue(OPPONENTS_LIST, settingsStorage.getItem(OPPONENTS_LIST));
};

// Settings have been changed
settingsStorage.addEventListener('change', (evt) => {
  sendValue(evt.key, evt.newValue);
});

// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(BG_COLOR, settingsStorage.getItem(BG_COLOR));
  sendValue(OPPONENTS_LIST, settingsStorage.getItem(OPPONENTS_LIST));
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
    });
  }
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}
