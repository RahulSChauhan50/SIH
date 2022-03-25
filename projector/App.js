import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
var robot = require("robotjs");

const App = () => {
  robot.setMouseDelay(2);

  var twoPI = Math.PI * 2.0;
  var screenSize = robot.getScreenSize();
  var height = screenSize.height / 2 - 10;
  var width = screenSize.width;
  useEffect(() => {
    setInterval(() => {
      for (var x = 0; x < width; x++) {
        y = height * Math.sin((twoPI * x) / width) + height;
        robot.moveMouse(x, y);
      }
    }, 2000);
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;
