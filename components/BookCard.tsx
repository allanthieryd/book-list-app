import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Book } from '../types/Book';
import { coverService } from '../services/coverService';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer "${book.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const coverUrl = coverService.getCoverUrl(book.cover, book.isbn);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        {coverUrl && (
          <Image
            source={{ uri: coverUrl }}
            style={styles.coverImage}
            resizeMode="cover"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
        )}
        {!coverUrl && (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderIcon}>📖</Text>
          </View>
        )}
        
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.bookInfo}>
              <Text style={styles.title} numberOfLines={2}>{book.name}</Text>
              <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
              <Text style={styles.details}>
                {book.editor} • {book.year}
              </Text>
              <Text style={styles.theme}>{book.theme}</Text>
            </View>
            <View style={styles.bookMeta}>
              <Text style={styles.rating}>⭐ {book.rating}/5</Text>
              {book.read && <Text style={styles.badge}>✓ Lu</Text>}
              {book.favorite && <Text style={styles.favoriteBadge}>❤️</Text>}
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
              <Text style={styles.buttonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  placeholderCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flex: 1,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  details: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  theme: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  bookMeta: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
    marginBottom: 5,
  },
  badge: {
    backgroundColor: '#34C759',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 3,
    overflow: 'hidden',
  },
  favoriteBadge: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BookCard;