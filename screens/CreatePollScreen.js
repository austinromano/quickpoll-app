import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

export default function CreatePollScreen({ navigation, route }) {
  const { pollCode } = route.params;
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, text) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const startPoll = () => {
    const validOptions = options.filter(opt => opt.trim());
    
    if (!question.trim()) {
      Alert.alert('Missing Question', 'Please enter a question for your poll');
      return;
    }
    
    if (validOptions.length < 2) {
      Alert.alert('Not Enough Options', 'Please add at least 2 options');
      return;
    }

    navigation.replace('Poll', { 
      pollCode,
      isCreator: true,
      question: question.trim(),
      options: validOptions
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Poll Code</Text>
          <Text style={styles.code}>{pollCode}</Text>
          <Text style={styles.codeHint}>Share this code with participants</Text>
        </View>
        
        <Text style={styles.label}>Question</Text>
        <TextInput
          style={styles.questionInput}
          placeholder="What would you like to ask?"
          value={question}
          onChangeText={setQuestion}
          multiline
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>Options</Text>
        
        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <TextInput
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) => updateOption(index, text)}
              placeholderTextColor="#999"
            />
            {options.length > 2 && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeOption(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {options.length < 4 && (
          <TouchableOpacity style={styles.addButton} onPress={addOption}>
            <Text style={styles.addButtonText}>+ Add Option</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.startButton} onPress={startPoll}>
          <Text style={styles.startButtonText}>Start Poll 🚀</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  codeCard: {
    backgroundColor: '#5865F2',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  codeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  code: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  codeHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  questionInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 25,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  optionInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    width: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    borderWidth: 2,
    borderColor: '#5865F2',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#5865F2',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#10b981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});