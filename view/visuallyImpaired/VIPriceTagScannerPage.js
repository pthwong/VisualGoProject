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
import {Buffer} from 'buffer';
import {AZURE_CV_API_URL, AZURE_CV_API_KEY, AZURE_SUBSCRIPTION_ID} from '@env';
// import {PredictionAPIClient} from '@azure/cognitiveservices-customvision-prediction';
// import {AuthenticationCredentials} from '@azure/ms-rest-js/es/lib/msRest';

import axios from 'axios';
import fs from 'react-native-fs';

function VIPriceTagScannerPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [prediction, setPrediction] = useState(null);

  const [pricetagInfo, setPricetagInfo] = useState(null);

  //MS Azure
  const predictionKey = '7308a0fa8d364428af85ad5431749bdb';
  const cvEndpoint = `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`;

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
      console.log('Photo path: \n', imageSource);
    }
  }

  function retakePhoto() {
    setShowCamera(true);
    setPrediction(null);
  }

  async function predictPriceTag(imageUri) {
    let filename = imageUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let priceTagFormData = new FormData();
    priceTagFormData.append('photo', {uri: imageUri, name: filename, type});

    await axios
      .post(
        `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`,
        //post: `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`
        priceTagFormData,
        {
          headers: {
            'Prediction-Key': predictionKey,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(async res => {
        console.log(
          'Result:',
          res.data.predictions[0].tagName,
          '\nProbability:',
          res.data.predictions[0].probability,
        );
        if (res.data.predictions[0].tagName === 'other') {
          alert('Cannot detect price tag.');
        } else if (
          res.data.predictions[0].tagName === 'parknshopmarked' &&
          res.data.predictions[0].probability * 100 >= 60
        ) {
          alert(
            'parknshopmarked\nProbability: ' +
              res.data.predictions[0].probability * 100,
          );
          setPrediction(res.data.predictions[0].tagName);

          //2. Get Price Tag info by Form recognizer
          await axios
            .post(
              `https://fypparknshopmarkedv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopmarkedformmodelv2_1:analyze?api-version=2022-08-31`,
              //https://fypparknshopmarkedv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopmarkedformmodelv2:analyze?api-version=2022-01-30-preview
              priceTagFormData,
              {
                headers: {
                  'Ocp-Apim-Subscription-Key': `ffd66fa152074fbebe5673c91d6eddae`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
            .then(res => console.log('Price tag info: ', res))
            .catch(err => {
              alert('Error');
              return err;
            });
        } else if (
          res.data.predictions[0].tagName === 'parknshopoffer' &&
          res.data.predictions[0].probability * 100 >= 80
        ) {
          alert(
            'parknshopoffer\nProbability: ' +
              res.data.predictions[0].probability * 100,
          );
          setPrediction(res.data.predictions[0].tagName);

          //2. Get Price Tag info by Form recognizer
          await axios
            .post(
              `https://fypparknshopofferv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopofferformmodelv2_1_new:analyze?api-version=2022-08-31`,
              //https://fypparknshopofferv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopofferformmodelv2_2:analyze?api-version=2022-01-30-preview
              priceTagFormData,
              {
                headers: {
                  'Ocp-Apim-Subscription-Key': `00d31480815b4113854aeda80222daba`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
            .then(res => console.log('Price tag info: ', res.data))
            .catch(err => {
              alert('Error');
              return err;
            });
          //got info
        } else if (
          res.data.predictions[0].tagName === 'wellcomemarked' &&
          res.data.predictions[0].probability * 100 >= 80
        ) {
          alert(
            'wellcomemarked\nProbability: ' +
              res.data.predictions[0].probability * 100,
          );
          setPrediction(res.data.predictions[0].tagName);

          //2. Get Price Tag info by Form recognizer
          await axios
            .post(
              `https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomemarkedformmodelv2_1:analyze?api-version=2022-08-31`,
              //https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomemarkedformmodel:analyze?api-version=2022-01-30-preview
              priceTagFormData,
              {
                headers: {
                  'Ocp-Apim-Subscription-Key': `f0ab5363478845fdb8c657dc7b9bef57`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
            .then(res => console.log('Price tag info: ', res.data))
            .catch(err => {
              alert('Error');
              return err;
            });
          //got info
        } else if (res.data.predictions[0].tagName === 'wellcomeoffer') {
          alert(
            'wellcomeoffer\nProbability: ' +
              res.data.predictions[0].probability * 100,
          );
          setPrediction(res.data.predictions[0].tagName);
          //2. Get Price Tag info by Form recognizer
          await axios
            .post(
              `https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomeofferformmodel2_1:analyze?api-version=2022-08-31`,
              //https://fypwellcomeoffer.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomeofferformmodel:analyze?api-version=2022-01-30-preview
              priceTagFormData,
              {
                headers: {
                  'Ocp-Apim-Subscription-Key': `1c6126a584bc4e6393d2c46d350be72b`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
            .then(res => console.log('Price tag info: ', res.data))
            .catch(err => {
              alert('Error');
              return err;
            });
          //got info
        } else {
          alert('Cannot detect price tag.');
        }
      })
      .catch(err => {
        console.log(err);
        alert('Error');
        return err;
      });
  }

  async function displayPredictResult() {
    const response = predictPriceTag(`${imageSource}`);
    console.log('Response: ', response);
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
            {prediction ? (
              <>
                <Text>價錢牌已掃描</Text>
                <Text>結果：{prediction}</Text>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => {
                    retakePhoto();
                  }}>
                  <Text style={styles.btnTxt}>重新拍攝價錢牌</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text>價錢牌已拍攝</Text>
                <Text>請按以下確認按鈕</Text>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => {
                    retakePhoto();
                  }}>
                  <Text style={styles.btnTxt}>重新拍攝價錢牌</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => displayPredictResult()}>
                  <Text style={styles.btnTxt}>確認</Text>
                </TouchableOpacity>
              </>
            )}

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
    width: '80%',
    height: 'auto',
    aspectRatio: 9 / 16,
  },
});

export default VIPriceTagScannerPage;
