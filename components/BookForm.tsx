import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Book } from '../types/Book';

interface BookFormProps {
  initialValues?: Book;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
  submitButtonText: string;
}

export interface BookFormData {
  name: string;
  author: string;
  editor: string;
  year: number;
  theme: string;
  rating: number;
  read: boolean;
  favorite: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    name: initialValues?.name || '',
    author: initialValues?.author || '',
    editor: initialValues?.editor || '',
    year: initialValues?.year || new Date().getFullYear(),
    theme: initialValues?.theme || '',
    rating: initialValues?.rating || 0,
    read: initialValues?.read || false,
    favorite: initialValues?.favorite || false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le titre est obligatoire';
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'auteur est obligatoire";
    }

    if (formData.year < 1000 || formData.year > new Date().getFullYear() + 10) {
      newErrors.year = 'Année invalide';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'La note doit être entre 0 et 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Titre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Titre du livre"
            placeholderTextColor="#999"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Auteur <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            value={formData.author}
            onChangeText={(text) => setFormData({ ...formData, author: text })}
            placeholder="Nom de l'auteur"
            placeholderTextColor="#999"
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Éditeur</Text>
          <TextInput
            style={styles.input}
            value={formData.editor}
            onChangeText={(text) => setFormData({ ...formData, editor: text })}
            placeholder="Nom de l'éditeur"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Année</Text>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            value={formData.year.toString()}
            onChangeText={(text) => setFormData({ ...formData, year: parseInt(text) || 0 })}
            placeholder="Année de publication"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Thème</Text>
          <TextInput
            style={styles.input}
            value={formData.theme}
            onChangeText={(text) => setFormData({ ...formData, theme: text })}
            placeholder="Genre/Thème"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Note (0-5)</Text>
          <TextInput
            style={[styles.input, errors.rating && styles.inputError]}
            value={formData.rating.toString()}
            onChangeText={(text) => setFormData({ ...formData, rating: parseInt(text) || 0 })}
            placeholder="Note sur 5"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Lu</Text>
          <Switch
            value={formData.read}
            onValueChange={(value) => setFormData({ ...formData, read: value })}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={formData.read ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Favori</Text>
          <Switch
            value={formData.favorite}
            onValueChange={(value) => setFormData({ ...formData, favorite: value })}
            trackColor={{ false: '#767577', true: '#FF3B30' }}
            thumbColor={formData.favorite ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{submitButtonText}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 100,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookForm;
