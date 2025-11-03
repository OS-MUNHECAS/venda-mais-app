import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    photoUri?: string;
    onPhotoSelected: (uri: string) => void;
    onPhotoRemoved: () => void;
}

export default function PhotoSelector({ photoUri, onPhotoSelected, onPhotoRemoved }: Props) {
    const pickImage = async () => {
        Alert.alert(
            'Selecionar Foto',
            'Escolha uma opção:',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Câmera', onPress: () => openCamera() },
                { text: 'Galeria', onPress: () => openGallery() },
            ]
        );
    };

    const openCamera = async () => {
        // Solicita permissão da câmera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Permissão da câmera é necessária!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Quadrado
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onPhotoSelected(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        // Solicita permissão da galeria
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Erro', 'Permissão da galeria é necessária!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Quadrado
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onPhotoSelected(result.assets[0].uri);
        }
    };

    const removePhoto = () => {
        Alert.alert(
            'Remover Foto',
            'Tem certeza que deseja remover a foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', style: 'destructive', onPress: onPhotoRemoved },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Foto do Cliente</Text>
            
            {photoUri ? (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photo} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
                            <Text style={styles.buttonText}>📷 Alterar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeButton} onPress={removePhoto}>
                            <Text style={styles.removeButtonText}>🗑️ Remover</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                    <Text style={styles.addPhotoIcon}>📷</Text>
                    <Text style={styles.addPhotoText}>Adicionar Foto</Text>
                    <Text style={styles.addPhotoSubtext}>Toque para tirar foto ou selecionar da galeria</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    photoContainer: {
        alignItems: 'center',
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    changeButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    removeButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    addPhotoButton: {
        backgroundColor: '#f8f8f8',
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    addPhotoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    addPhotoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    addPhotoSubtext: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});