import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
} from 'react-native-vision-camera';

import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

function VIPriceTagScannerPage() {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(null);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  const [showCamera, setShowCamera] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [prediction, setPrediction] = useState(null);

  const [priceTagRecognEndpt, setpriceTagRecognEndpt] = useState(null);
  const [ocpApimSubKey, setOcpApimSubKey] = useState(null);
  const [priceTagInfoURL, setPriceTagInfoURL] = useState(null);

  const [pricetagInfo, setPricetagInfo] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{marginLeft: 4}}
          accessible={true}
          accessibilityLabel="返回視覺支援頁面">
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //MS Azure Custom Vision
  const predictionKey = '7308a0fa8d364428af85ad5431749bdb';
  const cvEndpoint = `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`;
  //post: `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`

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

  // async function predictPriceTag(imageUri) {
  //   let filename = imageUri.split('/').pop();
  //   let match = /\.(\w+)$/.exec(filename);
  //   let type = match ? `image/${match[1]}` : `image`;
  //   let priceTagFormData = new FormData();
  //   priceTagFormData.append('photo', {uri: imageUri, name: filename, type});

  //   //1. Image classification with different kinds of price tags with MS Azure Custom Vision and return the kind label.
  //   await axios
  //     .post(cvEndpoint, priceTagFormData, {
  //       headers: {
  //         'Prediction-Key': predictionKey,
  //         //'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then(async res => {
  //       console.log(
  //         'Result:',
  //         res.data.predictions[0].tagName,
  //         '\nProbability:',
  //         res.data.predictions[0].probability,
  //       );
  //       if (res.data.predictions[0].tagName === 'other') {
  //         return;
  //       } else {
  //         if (
  //           res.data.predictions[0].tagName === 'parknshopmarked' &&
  //           res.data.predictions[0].probability * 100 >= 40
  //         ) {
  //           alert(
  //             'parknshopmarked\nProbability: ' +
  //               res.data.predictions[0].probability * 100,
  //           );
  //           setPrediction(res.data.predictions[0].tagName);
  //           setpriceTagRecognEndpt(
  //             `https://fypparknshopmarkedv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopmarkedformmodelv2_1:analyze?api-version=2022-08-31`,
  //           );
  //           setOcpApimSubKey(`ffd66fa152074fbebe5673c91d6eddae`);
  //         }
  //         if (
  //           res.data.predictions[0].tagName === 'parknshopoffer' &&
  //           res.data.predictions[0].probability * 100 >= 40
  //         ) {
  //           alert(
  //             'parknshopoffer\nProbability: ' +
  //               res.data.predictions[0].probability * 100,
  //           );
  //           setPrediction(res.data.predictions[0].tagName);
  //           setpriceTagRecognEndpt(
  //             `https://fypparknshopofferv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopofferformmodelv2_1_new:analyze?api-version=2022-08-31`,
  //           );
  //           setOcpApimSubKey(`00d31480815b4113854aeda80222daba`);
  //         }
  //         if (
  //           res.data.predictions[0].tagName === 'wellcomemarked' &&
  //           res.data.predictions[0].probability * 100 >= 40
  //         ) {
  //           alert(
  //             'wellcomemarked\nProbability: ' +
  //               res.data.predictions[0].probability * 100,
  //           );
  //           setPrediction(res.data.predictions[0].tagName);
  //           setpriceTagRecognEndpt(
  //             `https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomemarkedformmodelv2_1:analyze?api-version=2022-08-31`,
  //           );
  //           setOcpApimSubKey(`f0ab5363478845fdb8c657dc7b9bef57`);
  //         }
  //         if (
  //           res.data.predictions[0].tagName === 'wellcomeoffer' &&
  //           res.data.predictions[0].probability * 100 >= 40
  //         ) {
  //           alert(
  //             'wellcomeoffer\nProbability: ' +
  //               res.data.predictions[0].probability * 100,
  //           );
  //           setPrediction(res.data.predictions[0].tagName);
  //           setpriceTagRecognEndpt(
  //             `https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomeofferformmodel2_1:analyze?api-version=2022-08-31`,
  //           );
  //           setOcpApimSubKey(`1c6126a584bc4e6393d2c46d350be72b`);
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       alert('Error');
  //       return err;
  //     });

  //   //2. Get Price Tag Info URL by Form recognizer
  //   await axios
  //     .post(priceTagRecognEndpt, priceTagFormData, {
  //       headers: {
  //         'Ocp-Apim-Subscription-Key': ocpApimSubKey,
  //         //'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then(async res => {
  //       console.log(
  //         'Price tag recognition URL:\n ',
  //         res.headers['operation-location'],
  //       );
  //       setPriceTagInfoURL(res.headers['operation-location']);
  //       console.log('priceTagInfoURL:\n', priceTagInfoURL);
  //     })
  //     .catch(err => {
  //       alert('Error');
  //       console.log(`2. error: \n`, err);
  //     });

  //   //3. Get the price tag info by the URL
  //   await axios
  //     .post(priceTagInfoURL, priceTagFormData, {
  //       headers: {
  //         'Ocp-Apim-Subscription-Key': ocpApimSubKey,
  //         // 'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     .then(async res => {
  //       alert('successful');
  //       console.log('Result: \n', res.analyzeResult);
  //     })
  //     .catch(err => {
  //       alert('Error');
  //       console.log(`3. error: \n`, err);
  //     });
  // }

  async function predictPriceTag(imageUri) {
    let filename = imageUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let priceTagFormData = new FormData();
    priceTagFormData.append('photo', {uri: imageUri, name: filename, type});

    let formRecogEndpt = '';
    let formRecogKey = '';
    let formRegResEndpt = '';

    //1. Image classification with different kinds of price tags with MS Azure Custom Vision and return the kind label.
    await axios
      .post(cvEndpoint, priceTagFormData, {
        headers: {
          'Prediction-Key': predictionKey,
          //'Content-Type': 'multipart/form-data',
        },
      })
      .then(async res => {
        console.log(
          'Result:',
          res.data.predictions[0].tagName,
          '\nProbability:',
          res.data.predictions[0].probability,
        );
        if (res.data.predictions[0].tagName === 'other') {
          return;
        } else {
          //1.1 parknshopmarked
          if (
            res.data.predictions[0].tagName === 'parknshopmarked' &&
            res.data.predictions[0].probability * 100 >= 40
          ) {
            formRecogEndpt =
              'https://fypparknshopmarkedv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopmarkedformmodelv2_1:analyze?api-version=2022-08-31';
            formRecogKey = 'ffd66fa152074fbebe5673c91d6eddae';
            alert(
              'parknshopmarked\nProbability: ' +
                res.data.predictions[0].probability * 100,
            );
            setPrediction(res.data.predictions[0].tagName);
            //1.1.1 Get Price Tag Info URL by Form recognizer
            await axios
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                  //'Content-Type': 'multipart/form-data',
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);
              })
              .catch(err => {
                alert('Error');
                console.log(`2. error: \n`, err);
              });

            //1.1.2 Get the price tag info by the URL
            await axios
              .get(formRegResEndpt, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(result => {
                alert('successful');
                console.log('3. Result: \n', result);
              })
              .catch(err => {
                alert('Error');
                console.log(`3. error: \n`, err);
              });
            //1.1.3 got info completed if no error
          }
          //1.2 parknshopoffer
          if (
            res.data.predictions[0].tagName === 'parknshopoffer' &&
            res.data.predictions[0].probability * 100 >= 40
          ) {
            formRecogEndpt =
              'https://fypparknshopofferv2.cognitiveservices.azure.com/formrecognizer/documentModels/parknshopofferformmodelv2_1_new:analyze?api-version=2022-08-31';
            formRecogKey = '00d31480815b4113854aeda80222daba';
            alert(
              'parknshopoffer\nProbability: ' +
                res.data.predictions[0].probability * 100,
            );
            setPrediction(res.data.predictions[0].tagName);
            //1.2.1 Get Price Tag Info URL by Form recognizer
            await axios
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                  //'Content-Type': 'multipart/form-data',
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);
              })
              .catch(err => {
                alert('Error');
                console.log(`2. error: \n`, err);
              });

            //1.2.2 Get the price tag info by the URL
            await axios
              .get(formRegResEndpt, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(result => {
                alert('successful');
                console.log('3. Result: \n', result);
              })
              .catch(err => {
                alert('Error');
                console.log(`3. error: \n`, err);
              });
            //1.2.3 got info completed if no error
          }
          //1.3 wellcomemarked
          if (
            res.data.predictions[0].tagName === 'wellcomemarked' &&
            res.data.predictions[0].probability * 100 >= 40
          ) {
            formRecogEndpt =
              'https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomemarkedformmodelv2_1:analyze?api-version=2022-08-31';
            formRecogKey = 'f0ab5363478845fdb8c657dc7b9bef57';
            alert(
              'wellcomemarked\nProbability: ' +
                res.data.predictions[0].probability * 100,
            );
            setPrediction(res.data.predictions[0].tagName);
            //1.3.1 Get Price Tag Info URL by Form recognizer
            await axios
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                  //'Content-Type': 'multipart/form-data',
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);
              })
              .catch(err => {
                alert('Error');
                console.log(`2. error: \n`, err);
              });

            //1.3.2 Get the price tag info by the URL
            await axios
              .get(formRegResEndpt, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(result => {
                alert('successful');
                console.log('3. Result: \n', result);
              })
              .catch(err => {
                alert('Error');
                console.log(`3. error: \n`, err);
              });
            //1.3.3 got info completed if no error
          }
          //1.4 wellcomeoffer
          if (
            res.data.predictions[0].tagName === 'wellcomeoffer' &&
            res.data.predictions[0].probability * 100 >= 40
          ) {
            formRecogEndpt =
              'https://fypwellcomemarked2.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomeofferformmodel2_1:analyze?api-version=2022-08-31';
            formRecogKey = '1c6126a584bc4e6393d2c46d350be72b';
            alert(
              'wellcomeoffer\nProbability: ' +
                res.data.predictions[0].probability * 100,
            );
            setPrediction(res.data.predictions[0].tagName);
            //1.4.1 Get Price Tag Info URL by Form recognizer
            await axios
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                  //'Content-Type': 'multipart/form-data',
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);
              })
              .catch(err => {
                alert('Error');
                console.log(`2. error: \n`, err);
              });

            //1.4.2 Get the price tag info by the URL
            await axios
              .get(formRegResEndpt, {
                headers: {
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(result => {
                alert('successful');
                console.log('3. Result: \n', result);
              })
              .catch(err => {
                alert('Error');
                console.log(`3. error: \n`, err);
              });
            //1.4.3 got info completed if no error
          }
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
