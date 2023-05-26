import React from 'react';
import {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

function VIProductInfoBarcode() {
  const navigation = useNavigation();
  const route = useRoute();
  const {pdid: pdid} = route.params;
  const {barcode: productBarcode} = route.params;
  const [loading, setLoading] = useState(false);

  const [productBrand, setProductBrand] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDesc, setProductDesc] = useState(null);
  const [productCountry, setProductCountry] = useState(null);
  const [productUnit, setProductUnit] = useState(null);
  const [tagName, setTagName] = useState(null);
  const [bestBefore, setBestBefore] = useState(null);
  const [eatBefore, setEatBefore] = useState(null);
  const [useBefore, setUseBefore] = useState(null);

  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState('');
  const [energy, setEnergy] = useState('');
  const [energy_kcal, setEnergy_kcal] = useState('');
  const [fat, setFat] = useState('');
  const [saturated_fat, setSaturated_fat] = useState('');
  const [trans_fat, setTrans_fat] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [sugars, setSugars] = useState('');
  const [fiber, setFiber] = useState('');
  const [proteins, setProteins] = useState('');
  const [sodium, setSodium] = useState('');
  const [vitamin_a, setVitamin_a] = useState('');
  const [vitamin_c, setVitamin_c] = useState('');
  const [calcium, setCalcium] = useState('');
  const [iron, setIron] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('VIVisualSuppPage');
          }}
          style={{marginLeft: 4}}
          accessible={true}
          accessibilityLabel="返回視覺支援頁面">
          <Ionicons name="chevron-back-outline" size={40} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    navigation.navigate('VIVisualSuppPage');
    return true;
  };

  const fetchProductDataFromDB = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/getProductInfoByBarcode/${barcode}`,
      );
      const responseData = await response.json();
      console.log('DB product data: ', responseData);
      return responseData.response || {};
    } catch (error) {
      console.log('DB product data Error: \n', error);
      return {};
    }
  }, []);

  const fetchDataFromBarcodePlus = useCallback(async pdid => {
    try {
      const response = await fetch(
        `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getProductDetailsById","pdid":"${pdid}","langid":"zh_TW"}`,
      );
      const responseData = await response.json();
      const responseData2 = responseData.result[0];
      return responseData2.data[0] || {};
    } catch (error) {
      console.log('Error: \n', error);
      return {};
    }
  }, []);

  const fetchNutritionDataFromDB = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://api.whomethser.synology.me:3560/visualgo/v1/getNutritionInfoByBarcode/${barcode}`,
      );
      const responseData = await response.json();
      console.log('DB nutrition data: ', responseData);

      return responseData.response || {};
    } catch (error) {
      console.log('DB nutrition data Error: \n', error);

      return {};
    }
  }, []);

  const fetchDataFromFacts = useCallback(async barcode => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        //https://world.openfoodfacts.org/api/v0/product/4890008100231.json
      );
      const responseData = await response.json();
      return responseData || {};
    } catch (error) {
      console.log('Error: \n', error);
      return {};
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductInfo();
    getNutritionInfo();
    setLoading(false);
  }, [getProductInfo, getNutritionInfo]);

  const getProductInfo = useCallback(async () => {
    const dbProduct = await fetchProductDataFromDB(productBarcode);
    const barcodePlusProduct = await fetchDataFromBarcodePlus(pdid);

    console.log('dbProduct(product): \n', dbProduct);
    console.log('barcodePlusProduct: \n', barcodePlusProduct);

    if (!dbProduct.productBarcode || !productBarcode) {
      //1. If data not found from database, fetch data from Barcode Plus
      setProductBrand(barcodePlusProduct.pdbrndname);
      setProductName(barcodePlusProduct.pdname);
      setProductDesc(barcodePlusProduct.pddesc);
      setProductCountry(barcodePlusProduct.pdcntyoforgn);

      let productUnit = '';

      if (barcodePlusProduct.pdgroswgt && barcodePlusProduct.pdwgtuom) {
        productUnit =
          barcodePlusProduct.pdgroswgt.toString() +
          ' ' +
          barcodePlusProduct.pdwgtuom.toString();
      } else if (
        barcodePlusProduct.pdnetcont &&
        barcodePlusProduct.pdnetcontuom
      ) {
        productUnit =
          barcodePlusProduct.pdnetcont.toString() +
          ' ' +
          barcodePlusProduct.pdnetcontuom.toString();
      }

      setProductUnit(productUnit);
      setTagName('');
    } else {
      //2. Otherwise, fetch data from Database
      setProductBrand(dbProduct.productBrand);
      setProductName(dbProduct.productName);
      setProductDesc(dbProduct.productDesc);
      setProductCountry(dbProduct.productCountry);
      setProductUnit(dbProduct.productUnit);
      setTagName(dbProduct.tagName);
      setBestBefore(dbProduct.bestBefore);
      setEatBefore(dbProduct.eatBefore);
      setUseBefore(dbProduct.useBefore);
    }
  }, [fetchProductDataFromDB, fetchDataFromBarcodePlus, pdid, productBarcode]);

  const getNutritionInfo = useCallback(async () => {
    const dbProduct = await fetchNutritionDataFromDB(productBarcode);
    const openFoodFactsProduct = await fetchDataFromFacts(productBarcode);

    console.log('dbProduct (nutrition): \n', dbProduct);
    console.log('openFoodFactsProduct: \n', openFoodFactsProduct);

    if (!dbProduct.productBarcode || !productBarcode) {
      //1. If data not found from database, fetch data from Open Food Facts
      if (
        openFoodFactsProduct.status === 0 ||
        openFoodFactsProduct.product.nutriments === {} ||
        openFoodFactsProduct.product.nutriscore_data === {}
      ) {
        setLoading(false);
      } else {
        setEnergy(
          openFoodFactsProduct.product?.nutriments?.energy?.toString() ?? '',
        );
        setEnergy_kcal(
          (openFoodFactsProduct.product?.nutriments?.[
            'energy-kcal'
          ]?.toString() ?? '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.energy_unit?.toString() ??
              ''),
        );
        setFat(
          (openFoodFactsProduct.product?.nutriments?.fat?.toString() ?? '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.fat_unit?.toString() ??
              ''),
        );
        setSaturated_fat(
          (openFoodFactsProduct.product?.nutriments?.[
            'saturated-fat'
          ]?.toString() ?? '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.[
              'saturated-fat_unit'
            ]?.toString() ?? ''),
        );
        setCarbohydrates(
          (openFoodFactsProduct.product?.nutriments?.carbohydrates?.toString() ??
            '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.carbohydrates_unit?.toString() ??
              ''),
        );
        setSugars(
          (openFoodFactsProduct.product?.nutriments?.sugars?.toString() ?? '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.sugars_unit?.toString() ??
              ''),
        );
        setFiber(
          openFoodFactsProduct.product?.nutriscore_data?.fiber?.toString() ??
            '',
        );
        setProteins(
          (openFoodFactsProduct.product?.nutriments?.proteins?.toString() ??
            '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.proteins_unit?.toString() ??
              ''),
        );
        setSodium(
          (openFoodFactsProduct.product?.nutriments?.sodium_value?.toString() ??
            '') +
            ' ' +
            (openFoodFactsProduct.product?.nutriments?.sodium_unit?.toString() ??
              ''),
        );
      }
    } else {
      //2. Otherwise, fetch data from Database
      setIngredients(dbProduct.ingredients);
      setServings(dbProduct.servings);
      setEnergy(dbProduct.energy);
      setEnergy_kcal(dbProduct.energy_kcal);
      setFat(dbProduct.fat);
      setSaturated_fat(dbProduct.saturated_fat);
      setTrans_fat(dbProduct.trans_fat);
      setCholesterol(dbProduct.cholesterol);
      setCarbohydrates(dbProduct.carbohydrates);
      setSugars(dbProduct.sugars);
      setFiber(dbProduct.fiber);
      setProteins(dbProduct.proteins);
      setSodium(dbProduct.sodium);
      setVitamin_a(dbProduct.vitamin_a);
      setVitamin_c(dbProduct.vitamin_c);
      setCalcium(dbProduct.calcium);
      setIron(dbProduct.iron);
    }
  }, [fetchNutritionDataFromDB, fetchDataFromFacts, productBarcode]);

  const emptyListView = () => {
    return (
      <View>
        <Text>Sorry, no records found.</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text>載入中...</Text>
        </View>
      )}
      <View style={styles.flatlist}>
        <>
          {productName ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="產品名稱：">
                    產品名稱
                  </Text>
                  <Text style={styles.infoRightContainer}>{productName}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {productBrand ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="品牌名稱：">
                    品牌名稱
                  </Text>
                  <Text style={styles.infoRightContainer}>{productBrand}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {bestBefore ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="此日期前最佳：">
                    此日期前最佳
                  </Text>
                  <Text style={styles.infoRightContainer}>
                    {new Date(bestBefore).toLocaleDateString('zh-HK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {eatBefore ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="此日期前食用：">
                    此日期前食用
                  </Text>
                  <Text style={styles.infoRightContainer}>
                    {new Date(eatBefore).toLocaleDateString('zh-HK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {useBefore ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="此日期前使用：">
                    此日期前使用
                  </Text>
                  <Text style={styles.infoRightContainer}>
                    {new Date(useBefore).toLocaleDateString('zh-HK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {productDesc ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="產品描述：">
                    產品描述
                  </Text>
                  <Text style={styles.infoRightContainer}>{productDesc}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {productUnit ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="重量或容量：">
                    重量/容量
                  </Text>
                  <Text style={styles.infoRightContainer}>{productUnit}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {productCountry ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="進口來源地：">
                    進口來源地
                  </Text>
                  <Text style={styles.infoRightContainer}>
                    {productCountry}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {tagName ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="標籤">
                    標籤
                  </Text>
                  <Text style={styles.infoRightContainer}>{tagName}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {ingredients ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="營養資訊方面，材料：">
                    材料
                  </Text>
                  <Text style={styles.infoRightContainer}>{ingredients}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {servings ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="份量：">
                    份量
                  </Text>
                  <Text style={styles.infoRightContainer}>{servings}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {energy ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="能量：">
                    能量
                  </Text>
                  <Text style={styles.infoRightContainer}>{energy}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {energy_kcal ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="能量（千卡）：">
                    能量(千卡)
                  </Text>
                  <Text style={styles.infoRightContainer}>{energy_kcal}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {fat ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="脂肪">
                    脂肪
                  </Text>
                  <Text style={styles.infoRightContainer}>{fat}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {saturated_fat ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="飽和脂肪：">
                    飽和脂肪
                  </Text>
                  <Text style={styles.infoRightContainer}>{saturated_fat}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
          {trans_fat ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="反式脂肪：">
                    反式脂肪
                  </Text>
                  <Text style={styles.infoRightContainer}>{trans_fat}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {cholesterol ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="膽固醇：">
                    膽固醇
                  </Text>
                  <Text style={styles.infoRightContainer}>{cholesterol}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
          {carbohydrates ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="碳水化合物：">
                    碳水化合物
                  </Text>
                  <Text style={styles.infoRightContainer}>{carbohydrates}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {sugars ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="糖份：">
                    糖份
                  </Text>
                  <Text style={styles.infoRightContainer}>{sugars}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {fiber ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="纖維：">
                    纖維
                  </Text>
                  <Text style={styles.infoRightContainer}>{fiber}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {proteins ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="蛋白質：">
                    蛋白質
                  </Text>
                  <Text style={styles.infoRightContainer}>{proteins}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {sodium ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>鈉</Text>
                  <Text style={styles.infoRightContainer}>{sodium}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {vitamin_a ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="維他命A：">
                    維他命A
                  </Text>
                  <Text style={styles.infoRightContainer}>{vitamin_a}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {vitamin_c ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="維他命C：">
                    維他命C
                  </Text>
                  <Text style={styles.infoRightContainer}>{vitamin_c}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {calcium ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="鈣：">
                    鈣
                  </Text>
                  <Text style={styles.infoRightContainer}>{calcium}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
        <>
          {iron ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.infoLeftContainer}
                    accessible={true}
                    accessibilityLabel="鐵：">
                    鐵
                  </Text>
                  <Text style={styles.infoRightContainer}>{iron}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </>
          ) : null}
        </>
      </View>
    </ScrollView>
  );
}

export default VIProductInfoBarcode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 25,
    color: 'black',
  },
  subheading: {
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  infoLeftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    fontSize: 25,
    color: '#1760b0',
    paddingLeft: '3%',
  },
  infoRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    fontSize: 25,
    color: 'black',
    textAlign: 'right',
    paddingRight: '3%',
  },
  hLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: '5%',
    marginTop: '5%',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
