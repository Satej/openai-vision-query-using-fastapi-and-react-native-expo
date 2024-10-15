import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, useColorScheme, } from 'react-native';
import axios from 'axios';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const colorScheme = useColorScheme();

  const sendMessage = async () => {
    if (!query.trim()) return; // Don't send empty queries

    setMessages((prevMessages) => [
      { id: Date.now().toString(), role: 'user', content: query },
      ...prevMessages, // Add new message at the top
    ]);

    setQuery(''); // Clear the input

    try {
      // Send request to the API
      const response = await axios.post(
        'http://localhost:8000/info/',
        null,
        { params: { query } }
      );

      // Add the API response to the chat
      const assistantMessage = response.data.choices[0].message.content;
      setMessages((prevMessages) => [
        { id: Date.now().toString() + 'AI', role: 'assistant', content: assistantMessage },
        ...prevMessages, // Add new message at the top
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setQuery(''); // Clear the input
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        inverted // Show the latest message at the bottom
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colorScheme === 'dark' ? '#fff' : '#000', // Change text color based on theme
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', // Change background based on theme
          },
        ]}
        placeholder="Type your query..."
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'} // Change placeholder color based on theme
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={sendMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  userMessage: {
    backgroundColor: '#d1f5d3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '70%',
  },
  assistantMessage: {
    backgroundColor: '#f5d1d1',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
});
