import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { statService, BookStats } from '../../services/statService';
import EChartComponent from '../../components/EChartComponent';

export default function StatsScreen() {
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Impossible de charger les statistiques</Text>
      </View>
    );
  }

  // Configuration pour le graphique en donut (Livres lus vs non lus)
  const readUnreadChartOption = {
    title: {
      text: 'Statut de lecture',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
    },
    series: [
      {
        name: 'Livres',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c} livres',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: [
          {
            value: stats.readCount,
            name: 'Lus',
            itemStyle: { color: '#34C759' },
          },
          {
            value: stats.unreadCount,
            name: 'Non lus',
            itemStyle: { color: '#FF9500' },
          },
        ],
      },
    ],
  };

  // Configuration pour le graphique en barres (Vue d'ensemble)
  const overviewChartOption = {
    title: {
      text: 'Vue d\'ensemble',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: ['Total', 'Lus', 'Non lus', 'Favoris'],
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    series: [
      {
        name: 'Nombre',
        type: 'bar',
        data: [
          {
            value: stats.totalBooks,
            itemStyle: { color: '#007AFF' },
          },
          {
            value: stats.readCount,
            itemStyle: { color: '#34C759' },
          },
          {
            value: stats.unreadCount,
            itemStyle: { color: '#FF9500' },
          },
          {
            value: stats.favoritesCount,
            itemStyle: { color: '#FF3B30' },
          },
        ],
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
        barWidth: '50%',
      },
    ],
  };

  // Configuration pour le graphique de jauge (Note moyenne)
  const ratingGaugeOption = {
    title: {
      text: 'Note moyenne',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 5,
        splitNumber: 5,
        center: ['50%', '70%'],
        radius: '90%',
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.2, '#FF3B30'],
              [0.4, '#FF9500'],
              [0.6, '#FFCC00'],
              [0.8, '#34C759'],
              [1, '#007AFF'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: '#333',
          },
          length: '70%',
          width: 8,
        },
        axisTick: {
          length: 8,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 3,
          },
        },
        axisLabel: {
          color: '#333',
          fontSize: 14,
          distance: -40,
          formatter: (value: number) => value.toFixed(1),
        },
        title: {
          offsetCenter: [0, '100%'],
          fontSize: 16,
        },
        detail: {
          fontSize: 36,
          offsetCenter: [0, '5%'],
          valueAnimation: true,
          formatter: (value: number) => value.toFixed(2),
          color: '#333',
        },
        data: [
          {
            value: stats.averageRating,
            name: 'sur 5',
          },
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>📊 Statistiques détaillées</Text>
        </View>

        {/* Cartes de statistiques */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Text style={styles.statValue}>{stats.totalBooks}</Text>
            <Text style={styles.statLabel}>Livres au total</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <Text style={styles.statValue}>{stats.readCount}</Text>
            <Text style={styles.statLabel}>Livres lus</Text>
          </View>

          <View style={[styles.statCard, styles.warningCard]}>
            <Text style={styles.statValue}>{stats.unreadCount}</Text>
            <Text style={styles.statLabel}>Non lus</Text>
          </View>

          <View style={[styles.statCard, styles.favoriteCard]}>
            <Text style={styles.statValue}>{stats.favoritesCount}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
        </View>

        {/* Graphiques */}
        <View style={styles.chartContainer}>
          <EChartComponent option={overviewChartOption} height={300} />
        </View>

        <View style={styles.chartContainer}>
          <EChartComponent option={readUnreadChartOption} height={350} />
        </View>

        <View style={styles.chartContainer}>
          <EChartComponent option={ratingGaugeOption} height={300} />
        </View>
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 100,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
