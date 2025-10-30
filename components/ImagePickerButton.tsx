import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadCoverService } from '../services/uploadCoverService';

interface ImagePickerButtonProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string | null;
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImageSelected,
  currentImage,
}) => {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          "L'application a besoin d'accéder à vos photos pour cette fonctionnalité."
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setUploading(true);

      // 1. Sélectionner l'image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;

        // 2. Uploader l'image vers le serveur
        try {
          const uploadResponse = await uploadCoverService.uploadImage(localUri);

          if (uploadResponse.url) {
            // ✅ Utiliser l'URL du serveur au lieu de l'URI locale
            onImageSelected(uploadResponse.url);
            Alert.alert('Succès', 'Image uploadée avec succès');
          } else {
            throw new Error('Pas d\'URL dans la réponse');
          }
        } catch (uploadError) {
          console.error('Erreur upload:', uploadError);
          Alert.alert(
            'Erreur',
            'Impossible d\'uploader l\'image. Voulez-vous utiliser l\'image locale ?',
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                text: 'Oui',
                onPress: () => onImageSelected(localUri), // Fallback vers URI locale
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    } finally {
      setUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          "L'application a besoin d'accéder à votre caméra."
        );
        return;
      }

      setUploading(true);

      // 1. Prendre la photo
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;

        // 2. Uploader la photo vers le serveur
        try {
          const uploadResponse = await uploadCoverService.uploadImage(localUri);

          if (uploadResponse.url) {
            onImageSelected(uploadResponse.url);
            Alert.alert('Succès', 'Photo uploadée avec succès');
          } else {
            throw new Error('Pas d\'URL dans la réponse');
          }
        } catch (uploadError) {
          console.error('Erreur upload:', uploadError);
          Alert.alert(
            'Erreur',
            'Impossible d\'uploader la photo. Voulez-vous utiliser l\'image locale ?',
            [
              {
                text: 'Non',
                style: 'cancel',
              },
              {
                text: 'Oui',
                onPress: () => onImageSelected(localUri), // Fallback vers URI locale
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Choisir une image',
      'Comment souhaitez-vous ajouter la couverture ?',
      [
        {
          text: '📷 Prendre une photo',
          onPress: takePhoto,
        },
        {
          text: '🖼️ Galerie',
          onPress: pickImage,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const removeImage = () => {
    Alert.alert(
      'Supprimer l\'image',
      'Voulez-vous vraiment supprimer cette image ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onImageSelected(''),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {currentImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentImage }} style={styles.preview} resizeMode="cover" />
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={showImageOptions}
              disabled={uploading}
            >
              <Text style={styles.changeButtonText}>
                {uploading ? 'Upload...' : 'Changer'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeImage}
              disabled={uploading}
            >
              <Text style={styles.removeButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
          {uploading && (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={styles.uploadingIndicator}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.pickButton}
          onPress={showImageOptions}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <ActivityIndicator color="#007AFF" size="large" />
              <Text style={styles.uploadingText}>Upload en cours...</Text>
            </>
          ) : (
            <>
              <Text style={styles.pickIcon}>📷</Text>
              <Text style={styles.pickText}>Ajouter une couverture</Text>
              <Text style={styles.pickSubtext}>depuis l&apos;appareil</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  pickButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  pickIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  pickText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  pickSubtext: {
    fontSize: 14,
    color: '#666',
  },
  uploadingText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  preview: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingIndicator: {
    marginTop: 10,
  },
});

export default ImagePickerButton;