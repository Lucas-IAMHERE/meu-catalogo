import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { logout } from '../store/authSlice';

export default function ProductListScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Masculino');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Função que busca os produtos na API
  const fetchProducts = async (tab) => {
    setLoading(true);
    try {
      // Define quais categorias buscar dependendo da aba
      const categories = tab === 'Masculino' 
        ? ['mens-shirts', 'mens-shoes', 'mens-watches']
        : ['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'];

      // Cria os "pedidos" para o Axios buscar todos ao mesmo tempo
      const requests = categories.map(cat => api.get(`products/category/${cat}`));
      const responses = await Promise.all(requests);

      // Junta os produtos de todas as categorias em uma lista só
      let allProducts = [];
      responses.forEach(response => {
        allProducts = [...allProducts, ...response.data.products];
      });

      setProducts(allProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sempre que a aba mudar, ele busca os produtos novamente
  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  // Como o design de cada produto vai aparecer na lista (AGORA COM O CLIQUE FUNCIONANDO)
  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { productId: item.id })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Botão de Logout */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
        <TouchableOpacity onPress={() => dispatch(logout())} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Abas (Tabs) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Masculino' && styles.activeTab]}
          onPress={() => setActiveTab('Masculino')}
        >
          <Text style={[styles.tabText, activeTab === 'Masculino' && styles.activeTabText]}>Masculino</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Feminino' && styles.activeTab]}
          onPress={() => setActiveTab('Feminino')}
        >
          <Text style={[styles.tabText, activeTab === 'Feminino' && styles.activeTabText]}>Feminino</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Produtos ou Loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  logoutButton: { justifyContent: 'center' },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 10 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#007BFF' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#007BFF', fontWeight: 'bold' },
  loader: { marginTop: 50 },
  list: { padding: 15 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, padding: 10, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 16, color: 'green', fontWeight: 'bold' }
});