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
  List,
  ListItem,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

function VIProductInfoBarcode() {
  const route = useRoute();
  const pdid = route.params.pdid;
  let [productInfo, setProductInfo] = useState([]);

  console.log(pdid);

  async function fetchData() {
    // const barcode = await scannedBarcode.rawValue;
    // Fetch product data
    try {
      const response = await fetch(
        `https://www.barcodeplus.com.hk/eid/resource/jsonservice?data={"appCode":"EIDM","method":"getProductDetailsById","pdid":"${pdid}","langid":"zh_TW"}`,
      );
      const responseData = await response.json();
      const responseData2 = responseData.result[0];

      console.log(
        'Response url:',
        response,
        '\nGetting data OK: \n',
        responseData2.data[0].pdname,
        '\nGetting data OK: \n',
        responseData2.data[0].pddesc,
      );

      // Extract data from the response
      const pdname = responseData2.data[0].pdname;
      const productcat = responseData2.data[0].productcat_tw;
      const productDesc = responseData2.data[0].pddesc;
      const productBrandName = responseData2.data[0].pdbrndname;
      const productCountry = responseData2.data[0].pdcntyoforgn;
      const productWeight = responseData2.data[0].pdnetcont;
      const productWeightUnit = responseData2.data[0].pdnetcontuom;
      // Update state with the new product data
      setProductInfo({
        pdname,
        productcat,
        productBrandName,
        productDesc,
        productCountry,
        productWeight,
        productWeightUnit,
      });
    } catch (error) {
      console.log('Error: \n', error);
    }
  }

  useEffect(() => {
    fetchData();
    console.log('Product Info:\n', productInfo);
  }, [productInfo]);

  //   const displayInfo = ({item}) => (
  //     <View>
  //       <Text>{item.pdname}</Text>
  //       <Text>{item.productDesc}</Text>
  //       <Text>{item.productCountry}</Text>
  //     </View>
  //   );

  const emptyListView = () => {
    return (
      <View>
        <Text>Sorry, no records found.</Text>
      </View>
    );
  };

  return (
    // <View>
    //   <Text>{pdid}</Text>
    //   <Text>{productInfo.pdname}</Text>
    //   <Text>{productInfo.productDesc}</Text>
    //   <Text>{productInfo.productCountry}</Text>

    //   {/* <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
    //     <FlatList
    //       data={productInfo}
    //       renderItem={({item}) => (
    //         <ListItem
    //           roundAvatar
    //           title={`${item.pdname}`}
    //           subtitle={item.productDesc}
    //           containerStyle={{borderBottomWidth: 0}}
    //         />
    //       )}
    //     />
    //   </List> */}
    // </View>
    <View style={styles.container}>
      <FlatList
        data={[productInfo]}
        ListEmptyComponent={this.emptyListView}
        renderItem={({item}) => {
          return (
            <View style={styles.flatlist}>
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>產品名稱</Text>
                  <Text style={styles.infoRightContainer}>{item.pdname}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>品牌名稱</Text>
                  <Text style={styles.infoRightContainer}>
                    {item.productBrandName}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>產品描述</Text>
                  <Text style={styles.infoRightContainer}>
                    {item.productDesc}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>重量</Text>
                  <Text style={styles.infoRightContainer}>
                    {item.productWeight}
                    {item.productWeightUnit}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
              <TouchableOpacity
                onPress={() => {
                  console.log('pressed');
                }}>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLeftContainer}>進口國家</Text>
                  <Text style={styles.infoRightContainer}>
                    {item.productCountry}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.hLine} />
            </View>
          );
        }}
      />
    </View>
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
});
