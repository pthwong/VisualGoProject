import React, {useState, useEffect, useRef} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
} from 'react-native-vision-camera';

function VIPriceTagScannerPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState('');

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  console.log(`Camera permission status: ${cameraPermission}`);

  async function capturePhoto() {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);
      setShowCamera(false);
      console.log(photo.path);
    }
  }

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
      // <View style={{flex: 1}}>
      //   {photo && <Image source={{uri: photo}} style={{flex: 1}} />}
      //   <Camera
      //     ref={camera}
      //     style={StyleSheet.absoluteFill}
      //     device={cameraDevice}
      //     isActive
      //   />
      //   <TouchableOpacity style={styles.regBtn} onPress={takePicture}>
      //     <Text style={styles.btnTxt}>拍照</Text>
      //   </TouchableOpacity>
      // </View>
      <View style={styles.container}>
        {showCamera ? (
          <>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={cameraDevice}
              isActive={showCamera}
              photo={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.camButton}
                onPress={() => capturePhoto()}>
                <Text style={styles.btnTxt}>拍照</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Button title="Launch Camera" onPress={() => setShowCamera(true)} />
            {imageSource !== '' ? (
              <Image
                style={styles.image}
                source={{
                  uri: `file://'${imageSource}`,
                }}
              />
            ) : null}
          </>
        )}
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <Text>No camera device available</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
  },
  buttonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  camButton: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
  image: {
    width: '100%',
    height: 'auto',
    aspectRatio: 9 / 16,
  },
});

export default VIPriceTagScannerPage;
