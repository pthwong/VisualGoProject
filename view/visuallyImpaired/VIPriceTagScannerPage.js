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

  //MS Azure
  const projectId = '12b272e7-4cf6-4a62-9279-9308aaca3e46';
  const iterationName = 'Iteration4';
  const predictionKey = '7308a0fa8d364428af85ad5431749bdb';
  const endpoint = `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com`;
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

  // async function predictImage(imageUri) {
  //   const imageUrl = `data:image/jpeg;base64,${imageUri}`;
  //   const imageBuffer = Buffer.from(imageUrl.split(',')[1], 'base64');

  //   // Create a blob from the image buffer
  //   const blob = new Blob([imageBuffer], {type: 'image/jpeg'});

  //   // Create a form data object and append the blob to it
  //   const formData = new FormData();
  //   formData.append('image', blob, 'image.jpg');

  //   // Set the prediction key and content type headers
  //   const headers = {
  //     'Prediction-Key': predictionKey,
  //     'Content-Type': 'application/octet-stream',
  //   };

  //   // Make the API request using Axios
  //   const response = await axios.post(
  //     `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`,
  //     //post: `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`
  //     formData,
  //     {
  //       headers,
  //     },
  //   );

  //   // Return the response data
  //   return response.data;
  // }

  // const imageToBase64 = async uri => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();

  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  // async function predictImage(imageUri) {
  //   try {
  //     const imageBuffer = await fs.readFile(imageUri, 'base64');

  //     // Convert buffer to base64 string
  //     const base64Image = Buffer.from(imageBuffer, 'binary').toString('base64');

  //     // const requestBody = {
  //     //   url: imageUrlBase64,
  //     // };

  //     // const options = {
  //     //   method: 'POST',
  //     //   url: `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`,
  //     //   headers: {
  //     //     'Prediction-Key': '7308a0fa8d364428af85ad5431749bdb',
  //     //     'Content-Type': 'application/octet-stream',
  //     //   },
  //     //   data: Buffer.from(requestBody.url, 'base64'),
  //     // };
  //     // Upload image to Custom Vision API
  //     const response = await axios.post(cvEndpoint, base64Image, {
  //       headers: {
  //         'Content-Type': 'application/octet-stream',
  //         'Prediction-Key': '7308a0fa8d364428af85ad5431749bdb',
  //       },
  //     });

  //     // const options = {
  //     //   headers: {
  //     //     'Prediction-Key': predictionKey,
  //     //     'Content-Type': 'application/octet-stream',
  //     //   },
  //     // };

  //     // const response = await axios.post(cvEndpoint, imageBuffer, options);
  //     return response;
  //   } catch (error) {
  //     console.log('upload image error: \n', error);
  //     alert('error');
  //     return null;
  //   }
  // }

  async function predictPriceTag(imageUri) {
    let filename = imageUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('photo', {uri: imageUri, name: filename, type});

    // Make the API request using Axios
    // const headers = {
    //   'Prediction-Key': predictionKey,
    //   'Content-Type': 'multipart/form-data',
    // };

    await axios
      .post(
        `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`,
        //post: `https://fypcustomvisionprice-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/12b272e7-4cf6-4a62-9279-9308aaca3e46/classify/iterations/Iteration4/image`
        formData,
        {
          headers: {
            'Prediction-Key': predictionKey,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err);
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
            <Text>價錢牌已拍攝</Text>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => setShowCamera(true)}>
              <Text style={styles.btnTxt}>重新拍攝</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.camButton}
              onPress={() => displayPredictResult()}>
              <Text style={styles.btnTxt}>確認</Text>
            </TouchableOpacity>
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
