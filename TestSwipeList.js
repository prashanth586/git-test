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
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

const APPWHITE = '#FFFFFF';

const TestSwipeList = () => {
  const [listData, setListData] = useState([
    {
      rowId: '1',
      rateId: 'rate1',
      description: 'Project A - Development',
      attachments: ['document1.pdf', 'image1.jpg']
    },
    {
      rowId: '2',
      rateId: 'rate2',
      description: 'Project B - Testing and QA',
      attachments: ['report1.doc', 'screenshot1.png', 'video1.mp4']
    },
    {
      rowId: '3',
      rateId: 'rate3',
      description: 'Project C - Design Review',
      attachments: ['design1.sketch']
    },
    {
      rowId: '4',
      rateId: 'rate4',
      description: 'Project D - Client Meeting and Documentation',
      attachments: ['notes1.txt', 'presentation1.ppt', 'contract1.pdf', 'invoice1.pdf']
    },
  ]);

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
    
    const newData = listData.map(item => {
      if (item.rowId === rowId) {
        return {
          ...item,
          attachments: [...(item.attachments || []), newFileName]
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
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onClose}>
          <Text style={styles.backTextWhite}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onDelete}>
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const VisibleItem = ({ data }) => {
    const handleAttachmentPress = (filename) => {
      Alert.alert('Attachment', `Clicked on: ${filename}`);
    };

    const handleAddAttachment = () => {
      addAttachment(data.item.rowId);
    };

    return (
      <View style={styles.rowFront}>
        <TouchableHighlight
          style={styles.rowFrontVisible}
          underlayColor={'#aaa'}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <Text style={styles.itemDescription}>Task Details</Text>
              <Text style={styles.rateText}>Rate ID: {data.item.rateId}</Text>
            </View>
            
            <Text style={styles.description}>{data.item.description}</Text>
            
            <View style={styles.attachmentsContainer}>
              <View style={styles.attachmentsHeader}>
                <Text style={styles.attachmentsTitle}>
                  Attachments ({data.item.attachments ? data.item.attachments.length : 0}):
                </Text>
                <TouchableOpacity
                  style={styles.addAttachmentButton}
                  onPress={handleAddAttachment}>
                  <Text style={styles.addAttachmentText}>+ Add File</Text>
                </TouchableOpacity>
              </View>
              
              {data.item.attachments && data.item.attachments.length > 0 ? (
                data.item.attachments.map((filename, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.attachmentButton}
                    onPress={() => handleAttachmentPress(filename)}>
                    <Text style={styles.attachmentText}>{filename}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noAttachmentsText}>No attachments yet</Text>
              )}
            </View>
          </View>
        </TouchableHighlight>
      </View>
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
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowFrontVisible: {
    borderRadius: 12,
    minHeight: 120,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rateText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 22,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  addAttachmentButton: {
    backgroundColor: '#4caf50',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addAttachmentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noAttachmentsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  attachmentButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  attachmentText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    borderRadius: 12,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#ff1744',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default TestSwipeList;