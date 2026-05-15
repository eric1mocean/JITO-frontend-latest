import data from './data.json';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Provider as PaperProvider,
  FAB
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { statusLabels } from './constants';
import { usefetchTasks } from './customHooks/useFetchTasks';

const AppContent = () => {
  
  
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [statusInput, setStatusInput] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const {dataOfCols, handleRefresh, changeStatus, addTask, tasks} = usefetchTasks();
  
  

  

  

  const deleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    handleRefresh(updated);
  };

  return (
    <>
      <ScrollView horizontal style={{ padding: 10 }}>
        {Object.entries(dataOfCols).map(([columnName, taskList]) => (
          <View key={columnName} style={styles.column}>
            <Text style={styles.columnTitle}>{columnName}</Text>
            <FlatList
              data={taskList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Card style={styles.card}>
                  <Card.Content>
                    <Title>{item.title}</Title>
                    <Paragraph>{item.description}</Paragraph>
                    <Text style={styles.date}>
                      📅 {new Date(item.deadline).toLocaleString()}
                    </Text>
                    <Text>Status: {statusLabels[item.status] || 'Unknown'}</Text>

                    {item.assignees?.length > 0 && (
                      <View style={styles.avatars}>
                        {item.assignees.map((a, idx) => (
                          <Avatar.Image
                            key={idx}
                            size={32}
                            source={{ uri: a.avatar }}
                            style={{ marginRight: 5 }}
                          />
                        ))}
                      </View>
                    )}

                    <Picker
                      selectedValue={item.status}
                      onValueChange={(value) => changeStatus(item, value)}
                      style={styles.picker}
                    >
                      {Object.entries(statusLabels).map(([val, label]) => (
                        <Picker.Item key={val} label={label} value={Number(val)} />
                      ))}
                    </Picker>

                    <TouchableOpacity
                      onPress={() => deleteTask(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Text style={styles.btnText}>Delete</Text>
                    </TouchableOpacity>
                  </Card.Content>
                </Card>
              )}
            />
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.formTitle}>Add New Task</Text>
            <TextInput
              placeholder="Title"
              value={titleInput}
              onChangeText={setTitleInput}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={descInput}
              onChangeText={setDescInput}
              style={styles.input}
            />
            <Picker
              selectedValue={statusInput}
              onValueChange={setStatusInput}
              style={styles.picker}
            >
              {Object.entries(statusLabels).map(([val, label]) => (
                <Picker.Item key={val} label={label} value={Number(val)} />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {addTask(titleInput,descInput,statusInput); setTitleInput('');setDescInput('');setStatusInput(0);setModalVisible(false);}} style={styles.addBtn}>
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Task"
        onPress={() => setModalVisible(true)}
      />
    </>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <AppContent />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 320,
    marginRight: 20
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center'
  },
  card: {
    marginBottom: 20,
    padding: 10
  },
  date: {
    marginTop: 8,
    color: '#666'
  },
  avatars: {
    flexDirection: 'row',
    marginTop: 8
  },
  picker: {
    height: 50,
    marginTop: 10
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 32
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  addBtn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6
  },
  cancelBtn: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 6
  },
  deleteBtn: {
    backgroundColor: '#e53935',
    padding: 8,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
