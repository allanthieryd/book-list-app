import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

export type FilterType = 'all' | 'read' | 'unread' | 'favorite';
export type SortType = 'title' | 'author' | 'theme' | 'rating' | 'year';

interface FilterBarProps {
  activeFilter: FilterType;
  activeSort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  resultCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  activeSort,
  onFilterChange,
  onSortChange,
  resultCount,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const filters: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'Tous', icon: '📚' },
    { value: 'read', label: 'Lus', icon: '✓' },
    { value: 'unread', label: 'Non lus', icon: '○' },
    { value: 'favorite', label: 'Favoris', icon: '❤️' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'title', label: 'Titre' },
    { value: 'author', label: 'Auteur' },
    { value: 'theme', label: 'Thème' },
    { value: 'rating', label: 'Note' },
    { value: 'year', label: 'Année' },
  ];

  const getFilterLabel = () => {
    const filter = filters.find((f) => f.value === activeFilter);
    return filter ? `${filter.icon} ${filter.label}` : 'Filtre';
  };

  const getSortLabel = () => {
    const sort = sortOptions.find((s) => s.value === activeSort);
    return sort ? sort.label : 'Tri';
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>{getFilterLabel()}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>Trier: {getSortLabel()}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {resultCount >= 0 && (
        <Text style={styles.resultCount}>
          {resultCount} livre{resultCount > 1 ? 's' : ''}
        </Text>
      )}

      {/* Modal Filtres */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrer par</Text>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.modalOption,
                  activeFilter === filter.value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onFilterChange(filter.value);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.modalOptionIcon}>{filter.icon}</Text>
                <Text
                  style={[
                    styles.modalOptionText,
                    activeFilter === filter.value && styles.modalOptionTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                {activeFilter === filter.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Tri */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trier par</Text>
            {sortOptions.map((sort) => (
              <TouchableOpacity
                key={sort.value}
                style={[
                  styles.modalOption,
                  activeSort === sort.value && styles.modalOptionActive,
                ]}
                onPress={() => {
                  onSortChange(sort.value);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    activeSort === sort.value && styles.modalOptionTextActive,
                  ]}
                >
                  {sort.label}
                </Text>
                {activeSort === sort.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 10,
    color: '#666',
  },
  resultCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  modalOptionActive: {
    backgroundColor: '#E3F2FD',
  },
  modalOptionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default FilterBar;