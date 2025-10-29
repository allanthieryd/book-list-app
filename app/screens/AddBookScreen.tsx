import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { bookService } from '../../services/bookService';
import BookForm, { BookFormData } from '../../components/BookForm';

export default function AddBookScreen() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BookFormData) => {
    try {
      setError(null);
      await bookService.createBook({
        ...data,
        cover: null,
      });
      Alert.alert('Succès', 'Le livre a été ajouté', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      Alert.alert('Erreur', "Impossible d'ajouter le livre");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <BookForm onSubmit={handleSubmit} onCancel={handleCancel} submitButtonText="Ajouter" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
