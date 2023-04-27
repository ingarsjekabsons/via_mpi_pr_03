import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState("");

  const [camera, setCamera] = useState({
    center:  {
        latitude: 16.946,
        longitude: 54.10589
    },
    zoom: 10
  })

  const updateCoords = (loc) => {
    setCamera({
      center: {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      },
      zoom: 15
    })
  }

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      updateCoords(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const fetchWeather = () => {
    console.log("fetching...")
    let url = "https://api.openweathermap.org/data/3.0/onecall?lat="+location.coords.latitude+
                "&lon="+location.coords.longitude+
                "&units=metric&lang=la"+
                "&exclude=hourly,daily,minutely&appid=8216d7a08a6ee56eedd5c1e4800afa23"
    console.log(url)
    fetch(url)
      .then(resp => resp.json())
      .then(json => setWeather("Laiks šobrīd ir: " + json.current.weather[0].description
                        + ", temperatūra ir: " + json.current.temp
                        + ", vēja ātrums ir: " + json.current.wind_speed)
      )
  }

  return (
    <>
      <View style={styles.container}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} camera={camera}/>
      </View>
      <View style={styles.laiks}>
        <Text>{weather}</Text>
        <Button style={styles.buttonStyle} title="Kāds laiks?" onPress={fetchWeather} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '80%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  laiks: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonStyle: {
    alignItems: 'left',
    backgroundColor: 'yellow',
    borderWidth: 0.5,
    borderColor: '#Black',
    height: 40,
    borderRadius: 5,
    margin: 5,
    padding: 30,
  },
 });