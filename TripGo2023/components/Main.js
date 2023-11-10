import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,FlatList } from 'react-native';

const Main = () => {

  const gridData = [
      {
    id: 'g1',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 1',
    city: 'City A'
  },
  {
    id: 'g2',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 2',
    city: 'City B'
  },
  {
    id: 'g3',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 3',
    city: 'City C'
  },
  {
    id: 'g4',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 4',
    city: 'City D'
  },
  {
    id: 'g21',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 1',
    city: 'City A'
  },
  {
    id: 'g22',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 2',
    city: 'City B'
  },
  {
    id: 'g23',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 3',
    city: 'City C'
  },
  {
    id: 'g24',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'Region 4',
    city: 'City D'
  },
  ];
   const gridData2 = [
      {
    id: 'g31',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'text 1',
    city: 'text'
  },
  {
    id: 'g32',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'text 2',
    city: 'text'
  },
  {
    id: 'g33',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'text 3',
    city: 'text'
  },
  {
    id: 'g34',
    u_img: 'https://via.placeholder.com/150',
    timestamp: new Date(),
    region: 'text 4',
    city: 'text'
  },
  ];
 
  return (
    <>
      <ScrollView>

        {/* Horizontal Menu under the logo */}
      <View style={styles.horizontalMenu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Text3</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content Section */}
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>Text12</Text>
        </View>
        <Text style={styles.contentTitle}>Text4</Text>

         {/* Horizontal Scroll Container */}
       
         <FlatList
            data={gridData2}
            horizontal={true} 
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.gridItemHorizontal}>
                <Image source={{ uri: item.u_img }} style={styles.gridImageHorizontal} />
                <Text style={styles.gridText}>{item.region}</Text>
                <Text style={styles.gridText}>{item.city}</Text>
              </TouchableOpacity>
            )}
          />  
       
        <Text style={styles.contentTitle}>Text18</Text>
        
        <FlatList
          data={gridData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem}>
              <Image source={{ uri: item.u_img }} style={styles.gridImage} />
              <Text style={styles.gridDateLabel}>
                {item.timestamp?.toISOString().split('T')[0]}
              </Text>
              <Text style={styles.gridRegionLabel}>
                {item.region} {item.city}
              </Text>
            </TouchableOpacity>
          )}
          
        />
        </ScrollView>

    
        
    </>
  );
};

const styles = StyleSheet.create({

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
    flex: 1, 
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
