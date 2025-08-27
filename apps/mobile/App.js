import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setAnswer(data.answer || '');
    } catch (e) {
      setAnswer('Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <StatusBar style="auto" />
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>AI Legal Assistant</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Ask..." style={{ flex: 1, borderWidth: 1, padding: 8 }} />
        <Button title={loading ? '...' : 'Ask'} onPress={ask} />
      </View>
      <ScrollView style={{ marginTop: 12 }}>
        <Text>{answer}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
