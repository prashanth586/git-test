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
      files: [],
    },
    {
      rowId: '2',
      title: 'Item 2',
      description: 'Another item with some content',
      files: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Generate sample text with 100 characters
  const generateSampleText = () => {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut.';
  };

  // Add sample item with long text and files
  const addSampleItem = () => {
    const newItem = {
      rowId: Date.now().toString(),
      title: `Sample Item ${data.length + 1}`,
      description: generateSampleText(),
      files: [
        {id: 1, name: 'Sample File 1.pdf'},
        {id: 2, name: 'Sample File 2.jpg'},
        {id: 3, name: 'Sample File 3.doc'},
      ],
    };
    setData([...data, newItem]);
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

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data} removeRow={() => deleteRow(rowMap, data.item.rowId)} />;
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

  const VisibleItem = ({data, removeRow}) => {
    return (
      <View style={styles.rowFront}>
        <TouchableHighlight
          style={[styles.rowFrontVisible, styles.shadowBox]}
          underlayColor={'#aaa'}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>{data.item.title}</Text>
            <Text style={styles.description}>{data.item.description}</Text>
            
            {/* Files list */}
            {data.item.files.length > 0 && (
              <View style={styles.filesContainer}>
                <Text style={styles.filesHeader}>Files:</Text>
                {data.item.files.map((file, index) => (
                  <Text key={index} style={styles.fileName}>
                    • {file.name}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Sample controls */}
            <View style={styles.controlsContainer}>
              <Text style={styles.rateLabel}>Rate Selection:</Text>
              <TouchableOpacity style={styles.pickerButton}>
                <Text style={styles.pickerText}>Select Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const HiddenItemWithActions = ({data, rowMap, onClose, onDelete}) => {
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

  const footerLayout = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={addSampleItem}>
          <Text style={styles.addButtonText}>Add Sample Item (100 chars + files)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SwipeList Height Test</Text>
        <TouchableOpacity style={styles.headerButton} onPress={addSampleItem}>
          <Text style={styles.headerButtonText}>+ Add Item</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
    minHeight: 100, // Use minHeight instead of fixed height
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
    marginBottom: 10,
  },
  filesContainer: {
    marginVertical: 10,
  },
  filesHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  fileName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
    marginVertical: 2,
  },
  controlsContainer: {
    marginTop: 10,
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
    minHeight: 100, // Same minHeight as front row
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
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