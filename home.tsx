import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//Função principal //
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✧ Padoca App ✧</Text>
      <Text style={styles.subtitle}>Bem-vindo ao app da padaria!</Text>
    </View>
  );
}

export const options = {
  title: '🏠︎ Home',
};

//Estilos //
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#FAF3E0" 
  },

  title: { 
    fontSize: 52, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: "#8B5E3C"
  },

  subtitle: {
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: "#A67C52"
  }
});