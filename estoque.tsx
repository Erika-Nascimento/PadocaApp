import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//definir a interface do produto no estoque //
type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  categoria: string;
};

// componente principal de Estoque //
export default function EstoqueScreen() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoque, setEstoque] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');

  const STORAGE_KEY = '@estoque_padaria';

  // carregar os dados salvos ao iniciar //
  useEffect(() => {
    const carregarEstoque = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setEstoque(JSON.parse(data));
    };
    carregarEstoque();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(estoque));
  }, [estoque]);

  function adicionarProduto() {
    if (!nome.trim() || !quantidade.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e a quantidade.');
      return;
    }

    // cria novo produto //
    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome,
      quantidade: parseInt(quantidade),
      categoria,
    };

    setEstoque(prev => [novoProduto, ...prev]);
    setNome('');
    setQuantidade('');
    setCategoria('');
  }

  function removerProduto(id: string) {
    Alert.alert('Remover produto', 'Tem certeza que deseja remover?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setEstoque(prev => prev.filter(p => p.id !== id)) },
    ]);
  }

  function aumentarQuantidade(id: string) {
    setEstoque(prev =>
      prev.map(p => (p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p))
    );
  }

  function diminuirQuantidade(id: string) {
    setEstoque(prev =>
      prev.map(p =>
        p.id === id && p.quantidade > 0 ? { ...p, quantidade: p.quantidade - 1 } : p
      )
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Estoque</Text>

    <View style={styles.formContainer}>
      <Text style={styles.label}>Produto:</Text>
      <TextInput style={styles.input} placeholder="Nome do produto" value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput style={styles.input} placeholder="Ex: 10" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />

      <Text style={styles.label}>Categoria:</Text>
      <TextInput style={styles.input} placeholder="Ex: Pães, Bebidas, Doces" value={categoria} onChangeText={setCategoria} />

      <Button title="Adicionar ao Estoque" onPress={adicionarProduto} color="#D9A066" />
    </View>

      <Text style={styles.label}>Buscar Produto:</Text>
      <TextInput style={styles.input} placeholder="Digite para buscar..." value={busca} onChangeText={setBusca} />

      <FlatList
        data={estoque.filter(produto => produto.nome.toLowerCase().includes(busca.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const cardStyle = [
            styles.produtoItem,
            item.quantidade <= 3 ? styles.estoqueBaixo : null
          ];
      
          return (
            <View style={cardStyle}>
              <Text style={styles.produtoNome}>🍞 {item.nome}</Text>
              <Text style={styles.produtoCategoria}>📁 {item.categoria}</Text>
              <Text style={styles.produtoQtd}>Quantidade: {item.quantidade}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => aumentarQuantidade(item.id)} style={styles.buttonAdd}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => diminuirQuantidade(item.id)} style={styles.buttonRemove}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removerProduto(item.id)} style={styles.buttonExcluir}>
                  <Text style={styles.buttonText}>x</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
      }}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto no estoque.</Text>}
      />
    </KeyboardAvoidingView>
  );
}

export const options = { title: 'Estoque' };

// estilos //
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 30, 
    backgroundColor: '#FAF3E0' 
  },

  header: {
    paddingBottom: 10,
  },

  title: { 
    paddingTop: 50,
    fontSize: 35, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center', 
    color: '#8B5E3C' 
  },

   formContainer: {
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },

  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10, 
    color: '#A67C52' 
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#B28C5C', 
    borderRadius: 6, 
    padding: 10, 
    marginBottom: 12, 
    backgroundColor: '#fff' 
  },

  produtoItem: { 
    backgroundColor: '#FFF8F0', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  produtoNome: { 
    fontSize: 16, 
    color: '#A67C52' 
  },

  produtoCategoria: { 
    fontSize: 13, 
    fontStyle: 'italic', 
    color: '#A67C52', 
    marginBottom: 6 
  },

  produtoQtd: { 
    fontSize: 14, 
    color: '#A67C52', 
    marginBottom: 8 
  },

  buttons: { 
    flexDirection: 'row', 
    gap: 10 
  },

  buttonAdd: { 
    backgroundColor: '#D9A066', 
    padding: 12, 
    borderRadius: 6 
  },

  buttonRemove: { 
    backgroundColor: '#edc792ff', 
    padding: 13, 
    borderRadius: 6 
  },

  buttonExcluir: { 
    backgroundColor: '#C17E70', 
    padding: 11, 
    borderRadius: 6, 
    alignItems: 'center' 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  vazio: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#999' 
  },

  estoqueBaixo: {
    backgroundColor: '#fff7c0',
    borderColor: '#ffde59',
    fontWeight: 'bold',
    marginBottom: 6,
  }
});
