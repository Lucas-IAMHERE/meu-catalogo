import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';

// Importando a memória e as telas que você criou
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen'; // <- Tela de detalhes adicionada
import ProductListScreen from './src/screens/ProductListScreen';
import { store } from './src/store';

const Stack = createNativeStackNavigator();

// Gerenciador de rotas que decide qual tela mostrar baseado no Redux
function RootNavigator() {
  // Pega a informação "isAuthenticated" da nossa memória do Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          // Se NÃO estiver logado, mostra apenas a tela de Login
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        ) : (
          // Se ESTIVER logado, libera o acesso para a Lista e para os Detalhes
          <>
            <Stack.Screen 
              name="Products" 
              component={ProductListScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Details" 
              component={ProductDetailsScreen} 
              options={{ headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// O componente principal que envolve o app todo com o Redux
export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}