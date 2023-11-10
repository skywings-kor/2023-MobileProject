import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,FlatList } from 'react-native';
 // or another icon library of your choice

const Main = () => {

  const horizontalData = [
    { id: '8', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '9', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '10', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '11', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },
    { id: '12', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'text 1', city: 'text' },

  
  ];

  // 수직 스크롤 데이터
  const verticalData = [
    { id: '1', u_img: 'https://via.plac eholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '2', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '3', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '4', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '5', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '6', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
    { id: '7', u_img: 'https://via.placeholder.com/150', timestamp: new Date(), region: 'Region 1', city: 'City A' },
  ];

  const renderHorizontalItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItemHorizontal}>
      <Image source={{ uri: item.u_img }} style={styles.gridImageHorizontal} />
      <Text style={styles.gridText}>{item.region}</Text>
      <Text style={styles.gridText}>{item.city}</Text>
    </TouchableOpacity>
  );

  // 수직 스크롤 아이템 렌더링 함수
  const renderVerticalItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.u_img }} style={styles.gridImage} />
      <Text style={styles.gridDateLabel}>
        {item.timestamp?.toISOString().split('T')[0]}
      </Text>
      <Text style={styles.gridRegionLabel}>
        {item.region} {item.city}
      </Text>
    </TouchableOpacity>
  );

  const HorizontalSection = () => (
    <>
    <View style={styles.actionButton}>
          <Text style={styles.actionText}>Text12</Text>
    </View>
    <Text style={styles.contentTitle}>Text4</Text>
    <FlatList
      data={horizontalData}
      horizontal={true}
      renderItem={renderHorizontalItem}
      keyExtractor={(item, index) => item.id + ':' + index}
      style={styles.horizontalList}
    />
    <Text style={styles.contentTitle}>Text5</Text>
    </>
  );
 
  return (
    <View style={styles.screenContainer}>
      {/* 헤더 섹션 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TripGo</Text>
        {/* 추가적인 아이콘이 필요한 경우 여기에 추가 */}
        <View style={styles.headerIcons}>
          {/* Icons can be added here if needed */}
        </View>
      </View>

      {/* 수평 메뉴 */}
      {/* <View style={styles.horizontalMenu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text3</Text>
        </TouchableOpacity>
      </View> */}
     
      
      
  
      <FlatList
        data={verticalData}
        renderItem={renderVerticalItem}
        keyExtractor={(item, index) => item.id + ':' + index}
        numColumns={2}
        ListHeaderComponent={HorizontalSection}
        style={styles.verticalList}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },

  horizontalList: {
    flexGrow: 0, 
  },
  verticalList: {
    flex: 1,
  },
   container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    color: 'rgb(182,20,45)',
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    width: 75,
    justifyContent: 'space-between',
  },
  actionButton: {
    margin: 10,
    height:70,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
  },
  actionText: {
    color: 'white',
    textAlign: 'center',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
   horizontalMenu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8', 
    paddingVertical: 5, 
  },
    menuItem: {
     padding:10,
  },
  menuItemText: {
    
  },
   bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10, 
  },
   scrollViewContainer: {
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 20, 
    alignItems: 'center', 
    
  },
  iconImage: {
    width: 150, 
    height: 150, 
    resizeMode: 'contain', 
   
  },
    gridItem: {
    flex: 1 / 2, 
    aspectRatio: 1, 
    margin: 4, 
  },
  gridImage: {
    width: '100%', 
    height: '60%', 
  },
  gridDateLabel: {
    fontSize: 12,
  },
  gridRegionLabel: {
    fontSize: 14, 
    fontWeight: 'bold', 
  },
  flatListContainer: {
    height: 150, 
  },
  
  gridItemHorizontal: {
    margin: 10, 
    width: 150,
  
  },
  gridImageHorizontal: {
    width: '100%', 
    height: 100,
  },
  gridText: {
    textAlign: 'center', 
   
  },

});

export default Main;