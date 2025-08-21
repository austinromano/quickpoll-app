import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Share,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PollScreen({ route }) {
  const { pollCode, isCreator, question: initialQuestion, options: initialOptions } = route.params;
  const [pollData, setPollData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [voterId, setVoterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const animatedValues = useRef([]);

  // Initialize animated values
  useEffect(() => {
    if (pollData) {
      animatedValues.current = pollData.options.map(() => new Animated.Value(0));
    }
  }, [pollData]);

  useEffect(() => {
    const initializeConnection = async () => {
      // Get or create voter ID
      let id = await AsyncStorage.getItem('voterId');
      if (!id) {
        id = Math.random().toString(36).substring(7);
        await AsyncStorage.setItem('voterId', id);
      }
      setVoterId(id);

      // Connect to PartyKit - UPDATE THIS URL AFTER DEPLOYMENT
      // For local development (web/local):
      const wsUrl = Platform.OS === 'web' ? 
        `ws://127.0.0.1:62641/parties/main/${pollCode}` :
        `ws://192.168.1.74:62641/parties/main/${pollCode}`;
      const ws = new WebSocket(wsUrl);
      
      // For production (after deployment):
      // const ws = new WebSocket(`wss://quickpoll.YOUR-USERNAME.partykit.dev/parties/main/${pollCode}`);

      ws.onopen = () => {
        setLoading(false);
        
        if (isCreator && initialQuestion) {
          ws.send(JSON.stringify({
            type: 'CREATE_POLL',
            question: initialQuestion,
            options: initialOptions
          }));
        } else {
          ws.send(JSON.stringify({ type: 'GET_STATE' }));
        }
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'STATE_UPDATE') {
          setPollData(message.data);
          
          // Animate bars
          if (message.data && animatedValues.current.length > 0) {
            message.data.options.forEach((option, index) => {
              const percentage = message.data.totalVotes > 0 
                ? (option.votes / message.data.totalVotes) * 100 
                : 0;
              
              Animated.timing(animatedValues.current[index], {
                toValue: percentage,
                duration: 500,
                useNativeDriver: false,
              }).start();
            });
          }
        }
      };

      ws.onerror = (error) => {
        Alert.alert('Connection Error', 'Could not connect to poll. Please try again.');
        setLoading(false);
      };

      ws.onclose = () => {
      };

      setSocket(ws);
    };

    initializeConnection();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const vote = (optionIndex) => {
    if (!hasVoted && socket && voterId) {
      socket.send(JSON.stringify({
        type: 'VOTE',
        optionIndex,
        voterId
      }));
      setHasVoted(true);
      
    }
  };

  const sharePoll = () => {
    Share.share({
      message: `Join my poll!\n\n"${pollData?.question || 'Poll'}"\n\nCode: ${pollCode}\n\nJoin at QuickPoll app!`,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5865F2" />
        <Text style={styles.loadingText}>Connecting to poll...</Text>
      </View>
    );
  }

  if (!pollData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Waiting for poll to start...</Text>
        <Text style={styles.codeText}>Code: {pollCode}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>CODE</Text>
          <Text style={styles.code}>{pollCode}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={sharePoll}>
          <Text style={styles.shareButtonText}>Share 📤</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.question}>{pollData.question}</Text>
      <Text style={styles.voteCount}>
        {pollData.totalVotes} {pollData.totalVotes === 1 ? 'vote' : 'votes'}
      </Text>
      
      <View style={styles.optionsContainer}>
        {pollData.options.map((option, index) => {
          const percentage = pollData.totalVotes > 0 
            ? (option.votes / pollData.totalVotes) * 100 
            : 0;
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.option, hasVoted && styles.optionVoted]}
              onPress={() => vote(index)}
              disabled={hasVoted}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{option.text}</Text>
                <Text style={styles.optionVotes}>
                  {option.votes} ({percentage.toFixed(0)}%)
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: animatedValues.current[index] ? 
                        animatedValues.current[index].interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%']
                        }) : '0%'
                    }
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {hasVoted && (
        <View style={styles.votedBadge}>
          <Text style={styles.votedText}>✓ You voted!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5865F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  codeBox: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  codeLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  code: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5865F2',
    letterSpacing: 3,
  },
  shareButton: {
    backgroundColor: '#5865F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionVoted: {
    opacity: 0.8,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  optionText: {
    fontSize: 18,
    color: '#1a1a1a',
    flex: 1,
  },
  optionVotes: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#e0e0e0',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5865F2',
  },
  votedBadge: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 30,
  },
  votedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});