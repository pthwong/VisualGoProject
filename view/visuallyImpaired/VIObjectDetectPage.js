import React from 'react';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {labelImage} from 'vision-camera-image-labeler';
import {Label} from './../../components/Label';
import {useSharedValue} from 'react-native-reanimated';

function VIObjectDetectPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;
  //   const [label, setLabel] = useState([]);
  const currentLabel = useSharedValue('');

  //   const frameProcessor = useFrameProcessor(frame => {
  //     'worklet';
  //     const labels = labelImage(frame);
  //     console.log('Labels:', labels);
  //     setLabel(labels);
  //     // console.log('Labels:', label);
  //   }, []);

  //   const frameProcessor = frame => {
  //     'worklet';
  //     const processedLabels = labelImage(frame);
  //     console.log(processedLabels);
  //     runOnJS(updateLabels)(processedLabels);
  //   };

  //   const updateLabels = processedLabels => {
  //     setLabel(processedLabels);
  //   };

  //   useFrameProcessor(frameProcessor, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const labels = labelImage(frame);
      console.log('Labels:', labels);
      currentLabel.value = labels[0]?.label;
    },
    [currentLabel],
  );

  //   const highestConfidenceLabel = label.reduce((prev, current) =>
  //     prev.confidence > current.confidence ? prev : current,
  //   );

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  console.log(`Camera permission status: ${cameraPermission}`);

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
      <View style={{flex: 1}}>
        <Camera
          style={styles.camera}
          style={StyleSheet.absoluteFill}
          device={cameraDevice}
          photo
          isActive
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
        />
        <Label sharedValue={currentLabel} />
      </View>
    );
  }
}

export default VIObjectDetectPage;

const styles = StyleSheet.create({
  titleChi: {
    marginTop: '10%',
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  titleEng: {
    marginLeft: '5%',
    marginRight: '5%',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  textField: {
    fontSize: 18,
    color: 'black',
    marginBottom: '5%',
  },
  inputField: {
    border: 1,
    fontSize: 25,
    marginTop: '20%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  loginBtn: {
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  regBtn: {
    backgroundColor: '#ffd63f',
    color: 'black',
    width: '75%',
    marginLeft: '11%',
    padding: '3%',
    marginTop: '10%',
    borderRadius: 50,
    // shadowOpacity: 0.1,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    shadowOpacity: 0.2,
  },
  rnholeView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
