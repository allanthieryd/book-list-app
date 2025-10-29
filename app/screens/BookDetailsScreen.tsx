import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Book } from '../../types/Book';
import { Note } from '../../types/Note';
import { bookService } from '../../services/bookService';
import { noteService } from '../../services/noteService';
import { coverService } from '../../services/coverService';
import StarRating from '../../components/StarRating';
import NotesList from '../../components/NotesList';

export default function BookDetailsScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [updatingRating, setUpdatingRating] = useState<boolean>(false);

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

  const loadNotes = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoadingNotes(true);
      const data = await noteService.getNotesByBookId(Number(bookId));
      setNotes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBook();
    loadNotes();
  }, [loadBook, loadNotes]);

  const handleRatingChange = async (newRating: number) => {
    if (!book || !bookId) return;

    try {
      setUpdatingRating(true);
      await bookService.updateBook(Number(bookId), {
        ...book,
        rating: newRating,
      });
      setBook({ ...book, rating: newRating });
      Alert.alert('Succès', `Note mise à jour : ${newRating}/5`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      Alert.alert('Erreur', 'Impossible de mettre à jour la note');
    } finally {
      setUpdatingRating(false);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!bookId) return;

    await noteService.createNote(Number(bookId), { content });
    await loadNotes(); // Recharger les notes
  };

  const handleDelete = () => {
    if (!bookId) return;

    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir supprimer "${book?.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookService.deleteBook(Number(bookId));
              Alert.alert('Succès', 'Le livre a été supprimé', [
                {
                  text: 'OK',
                  onPress: () => router.push('/'),
                },
              ]);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
              setError(errorMessage);
              Alert.alert('Erreur', 'Impossible de supprimer le livre');
            }
          },
        },
      ]
    );
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

  // ✅ Déterminer l'URL de la couverture en gérant les images locales
  const getCoverSource = () => {
    // 1. Image locale depuis l'appareil (file://)
    if (book.cover && book.cover.startsWith('file://')) {
      return { uri: book.cover };
    }

    // 2. URL distante (http/https) ou ISBN via coverService
    const coverUrl = coverService.getCoverUrl(book.cover, book.isbn);
    if (coverUrl) {
      return { uri: coverUrl };
    }

    return null;
  };

  const coverSource = getCoverSource();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          {coverSource ? (
            <Image 
              source={coverSource} 
              style={styles.coverImage} 
              resizeMode="cover"
              onError={(e) => console.log('Erreur de chargement image:', e.nativeEvent.error)}
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverIcon}>📖</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{book.name}</Text>
          <Text style={styles.author}>{book.author}</Text>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Votre note :</Text>
            <StarRating
              rating={book.rating}
              onRatingChange={handleRatingChange}
              size={40}
              interactive={true}
            />
            {updatingRating && (
              <ActivityIndicator size="small" color="#007AFF" style={styles.ratingLoader} />
            )}
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Année</Text>
              <Text style={styles.metaValue}>{book.year}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Éditeur</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {book.editor}
              </Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            {book.read && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ Lu</Text>
              </View>
            )}
            {book.favorite && (
              <View style={[styles.badge, styles.favoriteBadge]}>
                <Text style={styles.badgeText}>❤️ Favori</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thème</Text>
              <Text style={styles.infoValue}>{book.theme}</Text>
            </View>
            {book.isbn && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ISBN</Text>
                <Text style={styles.infoValue}>{book.isbn}</Text>
              </View>
            )}
          </View>

          {/* Section Notes */}
          <View style={styles.notesSection}>
            <NotesList notes={notes} onAddNote={handleAddNote} loading={loadingNotes} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/screens/EditBookScreen?bookId=${book.id}`)}
        >
          <Text style={styles.actionButtonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000',
    marginTop: Platform.OS === 'web' ? 0 : 80,
  },
  coverImage: {
    width: '100%',
    maxWidth: 500,
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  coverPlaceholder: {
    width: '100%',
    maxWidth: 500,
    height: 400,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverIcon: {
    fontSize: 80,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  ratingSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  ratingLoader: {
    marginTop: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoriteBadge: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  notesSection: {
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
    marginBottom: 60,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});