import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params; // Pega o ID que a tela de lista mandou
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os detalhes apenas do produto clicado
    api.get(`products/${productId}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (!product) return null;

  // Calculando o preço original antes do desconto
  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
      
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>De: R$ {originalPrice}</Text>
          <Text style={styles.discountBadge}>-{product.discountPercentage}%</Text>
        </View>
        <Text style={styles.price}>Por: R$ {product.price.toFixed(2)}</Text>
        
        <Text style={styles.descriptionTitle}>Descrição</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  backButton: { padding: 20, paddingTop: 50 },
  backText: { color: '#007BFF', fontSize: 16, fontWeight: 'bold' },
  image: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#f4f4f4' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  originalPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through', marginRight: 10 },
  discountBadge: { backgroundColor: '#ff4d4f', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
  price: { fontSize: 26, color: 'green', fontWeight: 'bold', marginBottom: 20 },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 16, color: '#444', lineHeight: 24 }
});