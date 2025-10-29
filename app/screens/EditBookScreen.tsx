import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Book } from '../../types/Book';
import { bookService } from '../../services/bookService';
import BookForm, { BookFormData } from '../../components/BookForm';

export default function EditBookScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getBookById(Number(bookId));
      setBook(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      Alert.alert('Erreur', 'Impossible de charger le livre', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [bookId, router]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  const handleSubmit = async (data: BookFormData) => {
    if (!bookId) return;

    try {
      setError(null);
      await bookService.updateBook(Number(bookId), {
        ...data,
        cover: null,
      });
      Alert.alert('Succès', 'Le livre a été modifié', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      Alert.alert('Erreur', 'Impossible de modifier le livre');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Livre introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookForm
        initialValues={book}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Modifier"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
  },
});
