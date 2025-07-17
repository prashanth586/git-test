import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  TextInput,
  Keyboard,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const APPWHITE = '#FFFFFF';
const APPBLACK = '#000000';
const APPPRIMARYCOLOR = '#1976d2';
const APPBUTTON = '#4caf50';
const APPYELLOW = '#ffeb3b';
const FONT_SIZE_16 = 16;
const FONT_SIZE_17 = 17;
const FONT_SIZE_RES_14 = 14;

const TestSwipeList = () => {
  const [listData, setListData] = useState([
    {
      rowId: 1,
      rateId: 'rate1',
      description: 'Project A - Development work',
      hours: 8.0,
      startTime: '09:00',
      endTime: '17:00',
      nonWorkedTime: '01:00',
      timesheetFileList: [
        { fileName: 'document1.pdf', timesheetFileId: 1 },
        { fileName: 'image1.jpg', timesheetFileId: 2 }
      ]
    },
    {
      rowId: 2,
      rateId: 'rate2', 
      description: 'Testing and QA activities',
      hours: 6.0,
      startTime: '10:00',
      endTime: '16:00',
      nonWorkedTime: '00:00',
      timesheetFileList: [
        { fileName: 'report1.doc', timesheetFileId: 3 },
        { fileName: 'screenshot1.png', timesheetFileId: 4 },
        { fileName: 'video1.mp4', timesheetFileId: 5 }
      ]
    },
    {
      rowId: 3,
      rateId: 'rate3',
      description: 'Design Review Meeting',
      hours: 4.0,
      startTime: '14:00',
      endTime: '18:00',
      nonWorkedTime: '00:00',
      timesheetFileList: [
        { fileName: 'design1.sketch', timesheetFileId: 6 }
      ]
    },
    {
      rowId: 4,
      rateId: 'rate4',
      description: 'Client Meeting and Documentation',
      hours: 7.5,
      startTime: '08:30',
      endTime: '16:30',
      nonWorkedTime: '00:30',
      timesheetFileList: [
        { fileName: 'notes1.txt', timesheetFileId: 7 },
        { fileName: 'presentation1.ppt', timesheetFileId: 8 },
        { fileName: 'contract1.pdf', timesheetFileId: 9 },
        { fileName: 'invoice1.pdf', timesheetFileId: 10 }
      ]
    },
  ]);

  // Rate list for picker
  const [rateListArr] = useState([
    { label: 'Standard Rate', value: 'rate1' },
    { label: 'Overtime Rate', value: 'rate2' },
    { label: 'Holiday Rate', value: 'rate3' },
    { label: 'Premium Rate', value: 'rate4' },
  ]);

  // Time mode (similar to your original)
  const [time] = useState('Y'); // Y for time entry, N for hours only

  // Store measured heights for each row
  const [rowHeights, setRowHeights] = useState({});
  
  // Counter to force re-render and height recalculation
  const [changed, setChanged] = useState(0);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.rowId === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
    setChanged(prev => prev + 1); // Force re-render
  };

  const addAttachment = (rowId) => {
    const attachmentNames = [
      'document.pdf',
      'image.jpg',
      'report.doc',
      'presentation.ppt',
      'spreadsheet.xlsx',
      'video.mp4',
      'audio.mp3',
      'archive.zip',
      'design.sketch',
      'notes.txt',
      'contract.pdf',
      'invoice.pdf',
      'screenshot.png',
      'manual.pdf',
      'data.csv'
    ];
    
    const randomName = attachmentNames[Math.floor(Math.random() * attachmentNames.length)];
    const timestamp = Date.now();
    const newFileName = `${randomName.split('.')[0]}_${timestamp}.${randomName.split('.')[1]}`;
    const newFileId = Math.floor(Math.random() * 1000) + 100; // Random file ID
    
    const newData = listData.map(item => {
      if (item.rowId === rowId) {
        return {
          ...item,
          timesheetFileList: [...(item.timesheetFileList || []), { fileName: newFileName, timesheetFileId: newFileId }]
        };
      }
      return item;
    });
    
    setListData(newData);
    setChanged(prev => prev + 1); // Force re-render
  };

  const handleRateSelect = (rowId, rateSelectedId) => {
    const newData = listData.map(item => {
      if (item.rowId === rowId) {
        return {
          ...item,
          rateId: rateSelectedId
        };
      }
      return item;
    });
    setListData(newData);
    setChanged(prev => prev + 1);
  };

  const handleHoursChange = (rowId, hours) => {
    const newData = listData.map(item => {
      if (item.rowId === rowId) {
        return {
          ...item,
          hours: parseFloat(hours) || 0.0
        };
      }
      return item;
    });
    setListData(newData);
  };

  const handleDescriptionChange = (rowId, description) => {
    const newData = listData.map(item => {
      if (item.rowId === rowId) {
        return {
          ...item,
          description: description
        };
      }
      return item;
    });
    setListData(newData);
  };

  const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey);
  };

  const onLeftAction = (rowKey) => {
    console.log('onLeftAction', rowKey);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log('onLeftActionStatusChange', rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log('onRightActionStatusChange', rowKey);
  };

  const HiddenItemWithActions = ({ data, rowMap, onClose, onDelete }) => {
    const measuredHeight = rowHeights[data.item.rowId];
    
    return (
      <Animated.View style={[styles.rowBack, { height: measuredHeight }]}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onClose}>
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onDelete}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const VisibleItem = ({ data }) => {
    const handleLayout = (event) => {
      const { height } = event.nativeEvent.layout;
      setRowHeights(prev => ({
        ...prev,
        [data.item.rowId]: height
      }));
    };

    return (
      <Animated.View
        style={[
          time === 'N' ? styles.rowFront : styles.rowFrontTime
        ]}
        onLayout={handleLayout}>
        <TouchableHighlight
          style={[
            time === 'N' ? styles.rowFrontVisible : styles.rowFrontVisibleTime,
            styles.shadowBox,
          ]}
          underlayColor={'#aaa'}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.itemDescription}>Rates</Text>
              <RNPickerSelect
                placeholder={{
                  label: 'Select a rate...',
                  value: '',
                  color: '#9EA0A4',
                }}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                value={data.item.rateId}
                items={rateListArr}
                onValueChange={(itemValue) =>
                  handleRateSelect(data.item.rowId, itemValue)
                }></RNPickerSelect>
            </View>

            {time === 'Y' ? (
              <View>
                <View style={styles.timeEntry}>
                  <Text style={styles.itemDescription}>Start Time</Text>
                  <TouchableHighlight
                    style={[
                      styles.inputStyle,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <Text style={styles.timeStyle}>{data.item.startTime}</Text>
                  </TouchableHighlight>

                  <Text style={[styles.itemDescription, {marginLeft: 10}]}>
                    End Time
                  </Text>
                  <TouchableHighlight
                    style={[
                      styles.inputStyle,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <Text style={styles.timeStyle}>{data.item.endTime}</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.timeEntry}>
                  <Text style={styles.itemDescription}>Break Time</Text>
                  <TouchableHighlight
                    style={[
                      styles.inputStyle,
                      {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    <Text style={styles.timeStyle}>
                      {data.item.nonWorkedTime}
                    </Text>
                  </TouchableHighlight>
                </View> 

                <View style={styles.timeEntry}>
                  <Text style={styles.itemDescription}>Time Worked</Text>
                  <TextInput
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    numberOfLines={1}
                    onChangeText={(hours) =>
                      handleHoursChange(
                        data.item.rowId,
                        hours == '' ? 0.0 : hours,
                      )
                    }
                    placeholder="0.0"
                    defaultValue={parseFloat(data.item.hours).toFixed(2)}
                    textAlign={'center'}
                    scrollEnabled={false}
                    keyboardType="numeric"
                    returnKeyType="next"
                    underlineColorAndroid="transparent"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.timeEntry}>
                <Text style={styles.itemDescription}>Time Worked</Text>
                <TextInput
                  style={styles.inputStyle}
                  autoCapitalize="none"
                  numberOfLines={1}
                  onChangeText={(hours) =>
                    handleHoursChange(
                      data.item.rowId,
                      hours == '' ? 0.0 : hours,
                    )
                  }
                  placeholder="0.00"
                  defaultValue={parseFloat(data.item.hours).toFixed(2)}
                  textAlign={'center'}
                  scrollEnabled={false}
                  keyboardType="numeric"
                  returnKeyType="next"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />
              </View>
            )}
            <View style={styles.timeEntry}>
              <Text style={styles.itemDescription}>Description</Text>
              <TextInput
                style={[
                  styles.inputStyle,
                  {height: 50, flex: 1, marginBottom: 10},
                ]}
                autoCapitalize="none"
                numberOfLines={4}
                onChangeText={(value) =>
                  handleDescriptionChange(data.item.rowId, value)
                }
                defaultValue={data.item.description}
                maxLength={200}
                multiline={true}
                scrollEnabled={false}
                keyboardType="default"
                returnKeyType="next"
                underlineColorAndroid="transparent"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>

            {/* for uploading attachments */}
            <View style={styles.timeEntry}>
              <Text style={styles.itemDescription}>Upload File</Text>
              <View style={{marginLeft: 20, alignContent: 'flex-start'}}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    borderWidth: 1,
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor: APPYELLOW,
                  }}
                  onPress={() => addAttachment(data.item.rowId)}>
                  <Text>Choose Files</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Display attached files */}
            {data.item.timesheetFileList && data.item.timesheetFileList.length > 0 && (
              <View
                style={{
                  flexDirection: 'col',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}>
                <View style={{width: '100%'}}>
                  <Text style={styles.itemDescription}>Download Files</Text>
                </View>
                <View style={{width: '100%'}}>
                  {data.item.timesheetFileList?.map((file, index) => (
                    <TouchableOpacity
                      key={file.timesheetFileId || index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 6,
                        borderBottomWidth: 0.5,
                        borderColor: '#ccc',
                      }}
                      onPress={() =>
                        Alert.alert('File Download', `Downloading: ${file.fileName}`)
                      }>
                      <Text
                        style={[styles.fileText, {flex: 1}]}
                        numberOfLines={1}>
                        {file.fileName}
                      </Text>
                      <MaterialCommunityIcons
                        name="download"
                        size={18}
                        color={APPPRIMARYCOLOR}
                        style={{marginLeft: 10}}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    return (
      <VisibleItem
        data={data}
        removeRow={() => deleteRow(rowMap, data.item.rowId)}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onClose={() => closeRow(rowMap, data.item.rowId)}
        onDelete={() => deleteRow(rowMap, data.item.rowId)}
      />
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: APPWHITE, flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>SwipeListView Test</Text>
        <SwipeListView
          style={{ marginBottom: 30 }}
          showsVerticalScrollIndicator={false}
          data={listData}
          key={changed}
          extraData={changed}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.rowId}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          onRowDidOpen={onRowDidOpen}
          leftActivationValue={100}
          rightActivationValue={-9999}
          leftActionValue={0}
          rightActionValue={-500}
          onLeftAction={onLeftAction}
          swipeToOpenPercent={30}
          onLeftActionStatusChange={onLeftActionStatusChange}
          onRightActionStatusChange={onRightActionStatusChange}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  shadowBox: {
    backgroundColor: APPWHITE,
    borderRadius: 5,
    shadowColor: APPBLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontTime: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  rowFrontVisibleTime: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 17,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  itemDescription: {
    fontSize: FONT_SIZE_16,
    color: APPBLACK,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'justify',
  },
  timeStyle: {
    fontSize: FONT_SIZE_RES_14,
    color: APPBLACK,
    fontWeight: 'bold',
    alignContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: FONT_SIZE_RES_14,
    borderRadius: 10,
    marginLeft: 5,
    width: 70,
    color: APPBLACK,
    fontWeight: 'bold',
    height: 42,
    alignContent: 'center',
    borderColor: APPPRIMARYCOLOR,
    borderWidth: 1,
  },
  timeEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  fileText: {
    fontSize: FONT_SIZE_16,
    color: '#000',
    marginRight: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: FONT_SIZE_RES_14,
    paddingVertical: 2,
    paddingHorizontal: 0,
    borderWidth: 1,
    width: 200,
    color: APPBLACK,
    paddingLeft: 10,
    borderColor: APPPRIMARYCOLOR,
    borderRadius: 10,
    marginLeft: 10,
  },
  inputAndroid: {
    fontSize: FONT_SIZE_RES_14,
    paddingVertical: 2,
    paddingHorizontal: 0,
    borderWidth: 1,
    width: 200,
    color: APPBLACK,
    paddingLeft: 10,
    borderColor: APPPRIMARYCOLOR,
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default TestSwipeList;