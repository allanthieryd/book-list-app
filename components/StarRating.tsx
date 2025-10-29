import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 32,
  interactive = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const handlePress = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <View style={styles.container}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <TouchableOpacity
            key={star}
            onPress={() => handlePress(star)}
            disabled={!interactive}
            activeOpacity={interactive ? 0.7 : 1}
            style={styles.starButton}
          >
            <Text style={[styles.star, { fontSize: size }]}>
              {isFilled ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starButton: {
    padding: 2,
  },
  star: {
    color: '#FFB800',
  },
});

export default StarRating;