import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Book } from '../types/Book';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import FilterBar, { FilterType, SortType } from '../components/FilterBar';
import { searchIncludes } from '../utils/searchHelper';

export default function HomeScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('title');

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      Alert.alert('Erreur', 'Impossible de charger les livres');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  // ✅ OPTIMISATION : Calcul des livres filtrés avec useMemo (pas de re-calcul inutile)
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // 1. Appliquer la recherche (avec gestion UTF-8)
    if (searchQuery.trim() !== '') {
      result = result.filter((book) => {
        const titleMatch = searchIncludes(book.name, searchQuery);
        const authorMatch = searchIncludes(book.author, searchQuery);
        return titleMatch || authorMatch;
      });
    }

    // 2. Appliquer le filtre
    switch (activeFilter) {
      case 'read':
        result = result.filter((book) => book.read);
        break;
      case 'unread':
        result = result.filter((book) => !book.read);
        break;
      case 'favorite':
        result = result.filter((book) => book.favorite);
        break;
      case 'all':
      default:
        break;
    }

    // 3. Appliquer le tri
    result.sort((a, b) => {
      switch (activeSort) {
        case 'title':
          return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
        case 'author':
          return a.author.localeCompare(b.author, 'fr', { sensitivity: 'base' });
        case 'theme':
          return a.theme.localeCompare(b.theme, 'fr', { sensitivity: 'base' });
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchQuery, activeFilter, activeSort]); // ✅ Recalcule seulement si ces valeurs changent

  // Gérer la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // ✅ Plus besoin d'appeler une fonction - useMemo s'en charge automatiquement
  };

  // Gérer le changement de filtre
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // Gérer le changement de tri
  const handleSortChange = (sort: SortType) => {
    setActiveSort(sort);
  };

  const handleDeleteBook = useCallback(async (id: number) => {
  try {
    await bookService.deleteBook(id);
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    Alert.alert('Succès', 'Le livre a été supprimé');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    setError(errorMessage);
    Alert.alert('Erreur', 'Impossible de supprimer le livre');
  }
  }, [books]);

  const renderBook = useCallback(
    ({ item }: { item: Book }) => (
      <BookCard
        book={item}
        onPress={() => router.push(`/screens/BookDetailsScreen?bookId=${item.id}`)}
        onEdit={() => router.push(`/screens/EditBookScreen?bookId=${item.id}`)}
        onDelete={() => handleDeleteBook(item.id)}
      />
    ),
    [router, handleDeleteBook]
  );

  // ✅ Optimisation : keyExtractor mémorisé
  const keyExtractor = useCallback((item: Book) => item.id.toString(), []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des livres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Rechercher par titre ou auteur..."
      />

      <FilterBar
        activeFilter={activeFilter}
        activeSort={activeSort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        resultCount={filteredBooks.length}
      />

      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        // ✅ Optimisations performance FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || activeFilter !== 'all' ? '🔍' : '📚'}
            </Text>
            <Text style={styles.emptyTitle}>
              {searchQuery || activeFilter !== 'all' ? 'Aucun résultat' : 'Aucun livre'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || activeFilter !== 'all'
                ? 'Essayez de modifier vos critères'
                : 'Ajoutez votre premier livre'}
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/screens/AddBookScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 30,
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
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});