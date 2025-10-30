import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { statService, BookStats } from '../services/statService';

const DashboardStats: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<BookStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      Alert.alert('Erreur', 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <Text style={styles.statValue}>{stats.totalBooks}</Text>
          <Text style={styles.statLabel}>Livres au total 📚</Text>
        </View>

        <View style={[styles.statCard, styles.successCard]}>
          <Text style={styles.statValue}>{stats.readCount}</Text>
          <Text style={styles.statLabel}>Livres lus 📖</Text>
        </View>

        <View style={[styles.statCard, styles.warningCard]}>
          <Text style={styles.statValue}>{stats.unreadCount}</Text>
          <Text style={styles.statLabel}>Non lus 📕</Text>
        </View>

        <View style={[styles.statCard, styles.favoriteCard]}>
          <Text style={styles.statValue}>{stats.favoritesCount}</Text>
          <Text style={styles.statLabel}>Favoris ❤️</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => router.push('/screens/StatsScreen')}
      >
        <Text style={styles.expandButtonText}>Voir les graphiques détaillés</Text>
        <Text style={styles.expandIcon}>▼</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    opacity: 0.8,
  },
  primaryCard: {
    backgroundColor: '#007AFF',
  },
  successCard: {
    backgroundColor: '#34C759',
  },
  warningCard: {
    backgroundColor: '#FF9500',
  },
  favoriteCard: {
    backgroundColor: '#FF3B30',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  expandButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  expandIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DashboardStats;
