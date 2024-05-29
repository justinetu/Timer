import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const hours = Math.floor(time / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((time % 3600) / 60); // Remaining minutes
  const seconds = time % 60; // Remaining seconds
  return {
    hours: formatNumber(hours), 
    minutes: formatNumber(minutes), 
    seconds: formatNumber(seconds)
  }
}

const createArray = (length) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i.toString());
  }
  return arr;
}

const AVAILABLE_HOURS = createArray(5);
const AVAILABLE_MINUTES = createArray(60);
const AVAILABLE_SECONDS = createArray(60);

const App = () => {
  const [selectedHours, setSelectedHours] = useState('0');
  const [selectedMinutes, setSelectedMinutes] = useState('0');
  const [selectedSeconds, setSelectedSeconds] = useState('5');
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (remainingSeconds === 0) {
      stop();
    }
  }, [remainingSeconds]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const start = () => {
    const totalSeconds = parseInt(selectedHours, 10) * 3600 + parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10);
    setRemainingSeconds(totalSeconds);
    setIsRunning(true);
    const id = setInterval(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);
    setIntervalId(id);
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setRemainingSeconds(5);
    setIsRunning(false);
  }

  const renderTimerDisplay = () => {
    const { hours, minutes, seconds } = getRemaining(remainingSeconds);
    if (isRunning) {
      return (
        <Text style={styles.timerText}>
          {hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`}
        </Text>
      );
    } else {
      return renderPickers();
    }
  }

  const renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={selectedHours}
        onValueChange={(itemValue) => setSelectedHours(itemValue)}
        mode='dropdown'
      >
        {AVAILABLE_HOURS.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>hours</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
        mode='dropdown'
      >
        {AVAILABLE_MINUTES.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={selectedSeconds}
        onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
        mode='dropdown'
      >
        {AVAILABLE_SECONDS.map(value => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.secondsText}>seconds</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTimerDisplay()}
      {isRunning ? (
        <TouchableOpacity 
          onPress={stop}
          style={[styles.button, styles.buttonStop]}
        >
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={start}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkblue',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  timerText: {
    color: '#fff',
    fontSize: 60,
    marginBottom: 20,
  },
  button: {
    borderWidth: 5,
    borderColor: '#89AAFF',
    borderRadius: 100,
    padding: 10,
    marginTop: 20,
    width: 150,
    alignItems: 'center',
  },
  buttonStop: {
    borderColor: '#FF851B'
  },
  buttonText: {
    fontSize: 25,
    color: '#89AAFF'
  },
  buttonTextStop: {
    color: '#FF851B'
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: 56,
    ...Platform.select({
      android: {
        color: '#fff',
        backgroundColor: 'rgba(92, 92, 92, 0.206)'
      }
    })
  },
  pickerItem: {
    color: '#fff',
    fontSize: 15,
  },
  secondsText: {
    color: '#fff',
    fontSize: 15,
    marginRight: 10
  },
  pickerLabel: {
    color: '#fff',
    fontSize: 15,
    marginTop: 5,
  },
});
  