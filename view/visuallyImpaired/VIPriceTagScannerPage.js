import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
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

  const [productNameCN, setProductNameCN] = useState(null);
  const [productNameEN, setProductNameEN] = useState(null);
  const [price1, setPrice1] = useState(null);
  const [price2, setPrice2] = useState(null);
  const [brandCN, setBrandCN] = useState(null);
  const [brandEN, setBrandEN] = useState(null);
  const [productUnit, setProductUnit] = useState(null);
  const [priceType1, setPriceType1] = useState(null);
  const [priceType2, setPriceType2] = useState(null);

  const [loading, setLoading] = useState(false);
  const {width, height} = Dimensions.get('window');

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
      setImageSource(`file://${photo.path}`);
      setShowCamera(false);
      console.log('Photo path: \n', imageSource);
    }
  }

  function retakePhoto() {
    setLoading(false);
    setShowCamera(true);
    setPrediction(null);
    setImageSource('');
  }

  async function predictPriceTag(imageUri) {
    setLoading(true);
    let filename = imageUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let priceTagFormData = new FormData();
    priceTagFormData.append('photo', {
      uri: imageUri,
      type,
      name: filename,
    });

    const axiosInstance = axios.create();

    let formRecogEndpt = '';
    let formRecogKey = '';
    let formRegResEndpt = '';

    //1. Image classification with different kinds of price tags with MS Azure Custom Vision and return the kind label.
    await axiosInstance
      .post(cvEndpoint, priceTagFormData, {
        headers: {
          'content-type': 'multipart/form-data',
          'Prediction-Key': predictionKey,
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
          Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
            {
              text: '確定',
              onPress: () => {
                retakePhoto();
              },
            },
          ]);
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
            setPrediction(res.data.predictions[0].tagName);
            //1.1.1 Get Price Tag Info URL by Form recognizer
            await axiosInstance
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);

                //1.1.2 Get the price tag info by the URL
                let result;
                do {
                  // delay 2 seconds between requests
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  result = await axiosInstance
                    .get(formRegResEndpt, {
                      headers: {
                        'Ocp-Apim-Subscription-Key': formRecogKey,
                      },
                    })
                    .catch(err => {
                      Alert.alert(
                        '價錢牌未能掃描',
                        `價錢牌未能掃描，請重試。`,
                        [
                          {
                            text: '確定',
                            onPress: () => {
                              retakePhoto();
                            },
                          },
                        ],
                      );
                      console.log(`3. error: \n`, err);
                    });
                } while (result.data.status !== 'succeeded');

                console.log('3. Result: \n', result.data.status);
                console.log(
                  '3.1 ProductNameCN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                  '\n',
                );
                setProductNameCN(
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                );
                console.log(
                  '3.2 ProductNameEN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                  '\n',
                );
                setProductNameEN(
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                );
                console.log(
                  '3.3 Price1:',
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                setPrice1(
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.4 Price2:',
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                setPrice2(
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.5 BrandCN:',
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                  '\n',
                );
                setBrandCN(
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                );
                console.log(
                  '3.6 BrandEN:',
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                  '\n',
                );
                setBrandEN(
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                );
                console.log(
                  '3.7 ProductUnit:',
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                  '\n',
                );
                setProductUnit(
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                );
                console.log(
                  '3.8 PriceType1:',
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                  '\n',
                );
                setPriceType1(
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                );
                console.log(
                  '3.9 PriceType2:',
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                  '\n',
                );
                setPriceType2(
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                );
                console.log(productNameCN);
                setLoading(false);
                Alert.alert(
                  '價錢牌已掃描',
                  `產品名稱：${
                    result.data.analyzeResult.documents[0].fields.ProductNameCN
                      .content || ''
                  }\n${
                    (result.data.analyzeResult.documents[0].fields.Price2
                      .content === ''
                      ? `價格：${result.data.analyzeResult.documents[0].fields.Price2.content}` ||
                        ''
                      : `價格：$${result.data.analyzeResult.documents[0].fields.Price1.content}` ||
                        '',
                    `\n需要查看更多價錢牌資訊嗎？`)
                  }`,
                  [
                    {
                      text: '取消',
                      onPress: () => {
                        retakePhoto();
                      },
                    },
                    {
                      text: '確定',
                      onPress: () => {
                        navigation.navigate('VIProductInfoPriceTag', {
                          ProductNameCN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameCN.content || '',
                          ProductNameEN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameEN.content || '',
                          Price1:
                            result.data.analyzeResult.documents[0].fields.Price1
                              .content || '',
                          Price2:
                            result.data.analyzeResult.documents[0].fields.Price2
                              .content || '',
                          BrandCN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandCN.content || '',
                          BrandEN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandEN.content || '',
                          ProductUnit:
                            result.data.analyzeResult.documents[0].fields
                              .ProductUnit.content || '',
                          PriceType1:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType1.content || '',
                          PriceType2:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType2.content || '',
                        });
                      },
                    },
                  ],
                );
              })
              .catch(err => {
                Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
                  {
                    text: '確定',
                    onPress: () => {
                      retakePhoto();
                    },
                  },
                ]);
                console.log(`2. error: \n`, err);
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
            setPrediction(res.data.predictions[0].tagName);
            //1.2.1 Get Price Tag Info URL by Form recognizer
            await axiosInstance
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);

                //1.2.2 Get the price tag info by the URL
                let result;
                do {
                  //loop until the result is displayed
                  // delay 2 seconds between requests
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  result = await axiosInstance
                    .get(formRegResEndpt, {
                      headers: {
                        'Ocp-Apim-Subscription-Key': formRecogKey,
                      },
                    })
                    .catch(err => {
                      Alert.alert(
                        '價錢牌未能掃描',
                        `價錢牌未能掃描，請重試。`,
                        [
                          {
                            text: '確定',
                            onPress: () => {
                              retakePhoto();
                            },
                          },
                        ],
                      );
                      console.log(`3. error: \n`, err);
                    });
                } while (result.data.status !== 'succeeded');
                console.log('3. Result: \n', result.data.status);
                console.log(
                  '3.1 ProductNameCN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                  '\n',
                );
                setProductNameCN(
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                );
                console.log(
                  '3.2 ProductNameEN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                  '\n',
                );
                setProductNameEN(
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                );
                console.log(
                  '3.3 Price1:',
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                setPrice1(
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.4 Price2:',
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                setPrice2(
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.5 BrandCN:',
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                  '\n',
                );
                setBrandCN(
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                );
                console.log(
                  '3.6 BrandEN:',
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                  '\n',
                );
                setBrandEN(
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                );
                console.log(
                  '3.7 ProductUnit:',
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                  '\n',
                );
                setProductUnit(
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                );
                console.log(
                  '3.8 PriceType1:',
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                  '\n',
                );
                setPriceType1(
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                );
                console.log(
                  '3.9 PriceType2:',
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                  '\n',
                );
                setPriceType2(
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                );
                console.log(productNameCN);
                setLoading(false);
                Alert.alert(
                  '價錢牌已掃描',
                  `產品名稱：${
                    result.data.analyzeResult.documents[0].fields.ProductNameCN
                      .content || ''
                  }\n${
                    (result.data.analyzeResult.documents[0].fields.Price2
                      .content === ''
                      ? `價格：${result.data.analyzeResult.documents[0].fields.Price2.content}` ||
                        ''
                      : `價格：$${result.data.analyzeResult.documents[0].fields.Price1.content}` ||
                        '',
                    `\n需要查看更多價錢牌資訊嗎？`)
                  }`,
                  [
                    {
                      text: '取消',
                      onPress: () => {
                        retakePhoto();
                      },
                      style: 'destructive',
                    },
                    {
                      text: '確定',
                      onPress: () => {
                        navigation.navigate('VIProductInfoPriceTag', {
                          ProductNameCN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameCN.content || '',
                          ProductNameEN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameEN.content || '',
                          Price1:
                            result.data.analyzeResult.documents[0].fields.Price1
                              .content || '',
                          Price2:
                            result.data.analyzeResult.documents[0].fields.Price2
                              .content || '',
                          BrandCN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandCN.content || '',
                          BrandEN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandEN.content || '',
                          ProductUnit:
                            result.data.analyzeResult.documents[0].fields
                              .ProductUnit.content || '',
                          PriceType1:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType1.content || '',
                          PriceType2:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType2.content || '',
                        });
                      },
                    },
                  ],
                );
              })
              .catch(err => {
                Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
                  {
                    text: '確定',
                    onPress: () => {
                      retakePhoto();
                    },
                  },
                ]);
                console.log(`2. error: \n`, err);
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
            setPrediction(res.data.predictions[0].tagName);
            //1.3.1 Get Price Tag Info URL by Form recognizer
            await axiosInstance
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);

                //1.3.2 Get the price tag info by the URL
                let result;
                do {
                  //loop until the result is displayed
                  // delay 2 seconds between requests
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  result = await axiosInstance
                    .get(formRegResEndpt, {
                      headers: {
                        'Ocp-Apim-Subscription-Key': formRecogKey,
                      },
                    })
                    .catch(err => {
                      Alert.alert(
                        '價錢牌未能掃描',
                        `價錢牌未能掃描，請重試。`,
                        [
                          {
                            text: '確定',
                            onPress: () => {
                              retakePhoto();
                            },
                          },
                        ],
                      );
                      console.log(`3. error: \n`, err);
                    });
                } while (result.data.status !== 'succeeded');
                console.log('3. Result: \n', result.data.status);
                console.log(
                  '3.1 ProductNameCN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                  '\n',
                );
                setProductNameCN(
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                );
                console.log(
                  '3.2 ProductNameEN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                  '\n',
                );
                setProductNameEN(
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                );
                console.log(
                  '3.3 Price1:',
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                setPrice1(
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.4 Price2:',
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                setPrice2(
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.5 BrandCN:',
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                  '\n',
                );
                setBrandCN(
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                );
                console.log(
                  '3.6 BrandEN:',
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                  '\n',
                );
                setBrandEN(
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                );
                console.log(
                  '3.7 ProductUnit:',
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                  '\n',
                );
                setProductUnit(
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                );
                console.log(
                  '3.8 PriceType1:',
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                  '\n',
                );
                setPriceType1(
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                );
                console.log(
                  '3.9 PriceType2:',
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                  '\n',
                );
                setPriceType2(
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                );
                console.log(productNameCN);
                setLoading(false);
                Alert.alert(
                  '價錢牌已掃描',
                  `產品名稱：${
                    result.data.analyzeResult.documents[0].fields.ProductNameCN
                      .content || ''
                  }\n${
                    (result.data.analyzeResult.documents[0].fields.Price2
                      .content === ''
                      ? `價格：${result.data.analyzeResult.documents[0].fields.Price2.content}` ||
                        ''
                      : `價格：$${result.data.analyzeResult.documents[0].fields.Price1.content}` ||
                        '',
                    `\n需要查看更多價錢牌資訊嗎？`)
                  }`,
                  [
                    {
                      text: '取消',
                      onPress: () => {
                        retakePhoto();
                      },
                      style: 'destructive',
                    },
                    {
                      text: '確定',
                      onPress: () => {
                        navigation.navigate('VIProductInfoPriceTag', {
                          ProductNameCN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameCN.content || '',
                          ProductNameEN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameEN.content || '',
                          Price1:
                            result.data.analyzeResult.documents[0].fields.Price1
                              .content || '',
                          Price2:
                            result.data.analyzeResult.documents[0].fields.Price2
                              .content || '',
                          BrandCN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandCN.content || '',
                          BrandEN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandEN.content || '',
                          ProductUnit:
                            result.data.analyzeResult.documents[0].fields
                              .ProductUnit.content || '',
                          PriceType1:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType1.content || '',
                          PriceType2:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType2.content || '',
                        });
                      },
                    },
                  ],
                );
              })
              .catch(err => {
                Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
                  {
                    text: '確定',
                    onPress: () => {
                      retakePhoto();
                    },
                  },
                ]);
                console.log(`2. error: \n`, err);
              });
            //1.3.3 got info completed if no error
          }
          //1.4 wellcomeoffer
          if (
            res.data.predictions[0].tagName === 'wellcomeoffer' &&
            res.data.predictions[0].probability * 100 >= 40
          ) {
            formRecogEndpt =
              'https://fypwellcomeoffer.cognitiveservices.azure.com/formrecognizer/documentModels/wellcomeofferformmodel2_1:analyze?api-version=2022-08-31';
            formRecogKey = '1c6126a584bc4e6393d2c46d350be72b';
            setPrediction(res.data.predictions[0].tagName);
            //1.4.1 Get Price Tag Info URL by Form recognizer
            await axiosInstance
              .post(formRecogEndpt, priceTagFormData, {
                headers: {
                  'content-type': 'multipart/form-data',
                  'Ocp-Apim-Subscription-Key': formRecogKey,
                },
              })
              .then(async res => {
                console.log(
                  'Price tag recognition URL:\n ',
                  res.headers['operation-location'],
                );
                formRegResEndpt = res.headers['operation-location'];
                console.log('priceTagInfoURL:\n', formRegResEndpt);

                //1.4.2 Get the price tag info by the URL
                let result;
                do {
                  //loop until the result is displayed
                  // delay 2 seconds between requests
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  result = await axiosInstance
                    .get(formRegResEndpt, {
                      headers: {
                        'Ocp-Apim-Subscription-Key': formRecogKey,
                      },
                    })
                    .catch(err => {
                      Alert.alert(
                        '價錢牌未能掃描',
                        `價錢牌未能掃描，請重試。`,
                        [
                          {
                            text: '確定',
                            onPress: () => {
                              retakePhoto();
                            },
                          },
                        ],
                      );
                      console.log(`3. error: \n`, err);
                    });
                } while (result.data.status !== 'succeeded');
                console.log('3. Result: \n', result.data.status);
                console.log(
                  '3.1 ProductNameCN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                  '\n',
                );
                setProductNameCN(
                  result.data.analyzeResult.documents[0].fields.ProductNameCN
                    .content || '',
                );
                console.log(
                  '3.2 ProductNameEN:',
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                  '\n',
                );
                setProductNameEN(
                  result.data.analyzeResult.documents[0].fields.ProductNameEN
                    .content || '',
                );
                console.log(
                  '3.3 Price1:',
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                setPrice1(
                  result.data.analyzeResult.documents[0].fields.Price1
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.4 Price2:',
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                setPrice2(
                  result.data.analyzeResult.documents[0].fields.Price2
                    .content || '',
                  '\n',
                );
                console.log(
                  '3.5 BrandCN:',
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                  '\n',
                );
                setBrandCN(
                  result.data.analyzeResult.documents[0].fields.BrandCN
                    .content || '',
                );
                console.log(
                  '3.6 BrandEN:',
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                  '\n',
                );
                setBrandEN(
                  result.data.analyzeResult.documents[0].fields.BrandEN
                    .content || '',
                );
                console.log(
                  '3.7 ProductUnit:',
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                  '\n',
                );
                setProductUnit(
                  result.data.analyzeResult.documents[0].fields.ProductUnit
                    .content || '',
                );
                console.log(
                  '3.8 PriceType1:',
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                  '\n',
                );
                setPriceType1(
                  result.data.analyzeResult.documents[0].fields.PriceType1
                    .content || '',
                );
                console.log(
                  '3.9 PriceType2:',
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                  '\n',
                );
                setPriceType2(
                  result.data.analyzeResult.documents[0].fields.PriceType2
                    .content || '',
                );
                console.log(productNameCN);
                setLoading(false);
                Alert.alert(
                  '價錢牌已掃描',
                  `產品名稱：${
                    result.data.analyzeResult.documents[0].fields.ProductNameCN
                      .content || ''
                  }\n${
                    (result.data.analyzeResult.documents[0].fields.Price2
                      .content === ''
                      ? `價格：${result.data.analyzeResult.documents[0].fields.Price2.content}` ||
                        ''
                      : `價格：$${result.data.analyzeResult.documents[0].fields.Price1.content}` ||
                        '',
                    `\n需要查看更多價錢牌資訊嗎？`)
                  }`,
                  [
                    {
                      text: '取消',
                      onPress: () => {
                        retakePhoto();
                      },
                      style: 'destructive',
                    },
                    {
                      text: '確定',
                      onPress: () => {
                        navigation.navigate('VIProductInfoPriceTag', {
                          ProductNameCN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameCN.content || '',
                          ProductNameEN:
                            result.data.analyzeResult.documents[0].fields
                              .ProductNameEN.content || '',
                          Price1:
                            result.data.analyzeResult.documents[0].fields.Price1
                              .content || '',
                          Price2:
                            result.data.analyzeResult.documents[0].fields.Price2
                              .content || '',
                          BrandCN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandCN.content || '',
                          BrandEN:
                            result.data.analyzeResult.documents[0].fields
                              .BrandEN.content || '',
                          ProductUnit:
                            result.data.analyzeResult.documents[0].fields
                              .ProductUnit.content || '',
                          PriceType1:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType1.content || '',
                          PriceType2:
                            result.data.analyzeResult.documents[0].fields
                              .PriceType2.content || '',
                        });
                      },
                    },
                  ],
                );
              })
              .catch(err => {
                Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
                  {
                    text: '確定',
                    onPress: () => {
                      retakePhoto();
                    },
                  },
                ]);
                console.log(`2. error: \n`, err);
              });
            //1.4.3 got info completed if no error
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        console.log('Axios error:', err.message);
        console.log('Axios error stack:', err.stack);
        setLoading(false);
        Alert.alert('價錢牌未能掃描', `價錢牌未能掃描，請重試。`, [
          {
            text: '確定',
            onPress: () => {
              retakePhoto();
            },
          },
        ]);
        return err;
      });
  }

  async function displayPredictResult() {
    const response = predictPriceTag(`${imageSource}`);
    console.log('Response: ', response);
  }

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
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
                onPress={() => capturePhoto()}
                accessibilityLabel={'拍攝價錢牌'}>
                <Text style={styles.btnTxt}>拍照</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {prediction ? (
              <>
                <Text style={{fontSize: 30, margin: 10}}>價錢牌已掃描</Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => {
                    retakePhoto();
                  }}
                  accessible={true}
                  accessibilityLabel={
                    '價錢牌已拍攝，如要重新拍攝，請輕按兩下此按鈕'
                  }>
                  <Text style={styles.btnTxt}>重新拍攝價錢牌</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => displayPredictResult()}
                  accessibilityLabel={'確認價錢牌'}>
                  <Text style={styles.btnTxt}>確認</Text>
                </TouchableOpacity>
              </>
            )}

            {imageSource !== '' ? (
              <Image
                style={styles.image}
                source={{
                  uri: `${imageSource}`,
                }}
                // Set the desired width and height
                resizeMode="contain" // Adjust the resizing mode according to your needs
              />
            ) : null}
          </>
        )}
        {loading && (
          <View
            style={[styles.loadingContainer, {width, height}]}
            accessibilityLabel="載入中">
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
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
    backgroundColor: '#97F9F9',
    color: 'black',
    width: '75%',
    marginLeft: '8%',
    padding: '4%',
    marginTop: '10%',
    borderRadius: 50,
  },
  btnTxt: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    shadowOpacity: 0.2,
  },
  image: {
    marginTop: 10,
    width: 600,
    height: 600,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 30,
  },
});

export default VIPriceTagScannerPage;
