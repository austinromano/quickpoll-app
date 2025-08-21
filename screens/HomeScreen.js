import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert 
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [pollCode, setPollCode] = useState('');

  const generatePollCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const createNewPoll = () => {
    const code = generatePollCode();
    navigation.navigate('CreatePoll', { pollCode: code });
  };

  const joinPoll = () => {
    if (pollCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit code');
      return;
    }
    navigation.navigate('Poll', { pollCode, isCreator: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 QuickPoll</Text>
        <Text style={styles.subtitle}>Real-time voting made simple</Text>
      </View>
      
      <TouchableOpacity style={styles.createButton} onPress={createNewPoll}>
        <Text style={styles.createButtonText}>✨ Create New Poll</Text>
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      
      <View style={styles.joinSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter 4-digit code"
          value={pollCode}
          onChangeText={setPollCode}
          keyboardType="numeric"
          maxLength={4}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={[styles.joinButton, pollCode.length !== 4 && styles.disabled]} 
          onPress={joinPoll}
          disabled={pollCode.length !== 4}
        >
          <Text style={styles.joinButtonText}>Join Poll →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#5865F2',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#5865F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 20,
    color: '#999',
    fontSize: 14,
  },
  joinSection: {
    gap: 15,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});