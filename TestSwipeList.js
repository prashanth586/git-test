import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';

const TestSwipeList = () => {
  const [data, setData] = useState([
    {
      rowId: '1',
      title: 'Item 1',
      description: 'This is a basic item description',
      attachments: [],
    },
    {
      rowId: '2',
      title: 'Item 2',
      description: 'Another item with some content',
      attachments: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Generate sample attachment with 100 characters
  const generateSampleAttachment = () => {
    const sampleTexts = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea comm.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit an.',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium volup.',
    ];
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    return {
      id: Date.now() + Math.random(),
      name: `attachment_${Date.now()}.pdf`,
      text: randomText,
    };
  };

  // Add attachment to specific item
  const addAttachmentToItem = (rowId) => {
    const newAttachment = generateSampleAttachment();
    setData(prevData => 
      prevData.map(item => 
        item.rowId === rowId 
          ? {...item, attachments: [...item.attachments, newAttachment]}
          : item
      )
    );
  };

  const deleteRow = (rowMap, rowKey) => {
    const newData = data.filter(item => item.rowId !== rowKey);
    setData(newData);
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const onLeftAction = (rowKey, rowMap) => {
    console.log('Left action triggered for:', rowKey);
    closeRow(rowMap, rowKey);
  };

  const onRowDidOpen = (rowKey) => {
    console.log('Row opened:', rowKey);
  };

  const onLeftActionStatusChange = (rowKey) => {
    console.log('Left action status changed:', rowKey);
  };

  const onRightActionStatusChange = (rowKey) => {
    console.log('Right action status changed:', rowKey);
  };

  // Calculate dynamic height based on content
  const calculateItemHeight = (item) => {
    const baseHeight = 120; // Base height for title, description, controls
    const attachmentHeight = item.attachments.length * 45; // Each attachment adds 45px
    return baseHeight + attachmentHeight;
  };

  const renderItem = (data, rowMap) => {
    const itemHeight = calculateItemHeight(data.item);
    return (
      <VisibleItem 
        data={data} 
        removeRow={() => deleteRow(rowMap, data.item.rowId)}
        addAttachment={() => addAttachmentToItem(data.item.rowId)}
        itemHeight={itemHeight}
      />
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const itemHeight = calculateItemHeight(data.item);
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onClose={() => closeRow(rowMap, data.item.rowId)}
        onDelete={() => deleteRow(rowMap, data.item.rowId)}
        itemHeight={itemHeight}
      />
    );
  };

  const VisibleItem = ({data, removeRow, addAttachment, itemHeight}) => {
    return (
      <View style={[styles.rowFront, {height: itemHeight}]}>
        <TouchableHighlight
          style={[styles.rowFrontVisible, styles.shadowBox, {height: itemHeight}]}
          underlayColor={'#aaa'}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{data.item.title}</Text>
            <Text style={styles.description}>{data.item.description}</Text>
            
            {/* Rate Selection */}
            <View style={styles.controlsContainer}>
              <Text style={styles.rateLabel}>Rate Selection:</Text>
              <TouchableOpacity style={styles.pickerButton}>
                <Text style={styles.pickerText}>Select Rate</Text>
              </TouchableOpacity>
            </View>

            {/* Add Attachment Button */}
            <TouchableOpacity 
              style={styles.addAttachmentButton} 
              onPress={addAttachment}
              activeOpacity={0.7}>
              <Text style={styles.addAttachmentText}>+ Add Attachment (100 chars)</Text>
            </TouchableOpacity>
            
            {/* Attachments list */}
            {data.item.attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                <Text style={styles.attachmentsHeader}>
                  Attachments ({data.item.attachments.length}):
                </Text>
                {data.item.attachments.map((attachment, index) => (
                  <View key={attachment.id} style={styles.attachmentItem}>
                    <Text style={styles.attachmentName}>📎 {attachment.name}</Text>
                    <Text style={styles.attachmentText} numberOfLines={2}>
                      {attachment.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const HiddenItemWithActions = ({data, rowMap, onClose, onDelete, itemHeight}) => {
    return (
      <View style={[styles.rowBack, {height: itemHeight}]}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft, {height: itemHeight}]}
          onPress={onClose}>
          <Text style={styles.backTextWhite}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight, {height: itemHeight}]}
          onPress={onDelete}>
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const addNewItem = () => {
    const newItem = {
      rowId: Date.now().toString(),
      title: `New Item ${data.length + 1}`,
      description: 'This is a new item for testing purposes',
      attachments: [],
    };
    setData([...data, newItem]);
  };

  const footerLayout = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SwipeList Height Test</Text>
        <Text style={styles.headerSubtext}>Tap "Add Attachment" inside cards</Text>
      </View>

      <SwipeListView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.rowId}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        disableRightSwipe={false}
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        rightActivationValue={-200}
        ListFooterComponent={footerLayout}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        swipeToOpenPercent={30}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  rowFront: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  controlsContainer: {
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  pickerButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 5,
    padding: 10,
  },
  pickerText: {
    fontSize: 14,
    color: '#6c757d',
  },
  addAttachmentButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  addAttachmentText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  attachmentsContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  attachmentsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  attachmentItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#ff3333',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TestSwipeList;