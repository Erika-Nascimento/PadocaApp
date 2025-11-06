import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  Alert, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// definir a interface do pedido//
type Pedido = {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  entregue: boolean;
};

export default function PedidosScreen() {
  // controla os campos de entrada// 
  const [cliente, setCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState<number>(0);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const STORAGE_KEY = '@pedidos_padaria';

  //  carrega pedidos do armazenamento local//
  useEffect(() => {
    const carregarPedidos = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) setPedidos(JSON.parse(data));
    };
    carregarPedidos();
  }, []);

  // salva pedidos sempre que há mudança//
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  }, [pedidos]);

  //  cria novo pedido//
  function fazerPedido() {
    if (!cliente.trim() || !produto.trim() || quantidade <= 0) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos corretamente.');
      return;
    }

    const novoPedido: Pedido = {
      id: Date.now().toString(),
      cliente,
      produto,
      quantidade,
      entregue: false,
    };

    setPedidos(prev => [novoPedido, ...prev]);
    setCliente('');
    setProduto('');
    setQuantidade(0);

    Alert.alert('Pedido enviado', `Pedido de ${produto} para ${cliente} registrado!`);
  }

  //  alterna status de entregue//
  function marcarEntregue(id: string) {
    setPedidos(prev =>
      prev.map(p => (p.id === id ? { ...p, entregue: !p.entregue } : p))
    );
  }

  // exclui pedido com confirmação//
  function excluirPedido(id: string) {
    Alert.alert('Excluir pedido', 'Tem certeza que deseja excluir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setPedidos(prev => prev.filter(p => p.id !== id)),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Novo Pedido</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Cliente:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do cliente"
            value={cliente}
            onChangeText={setCliente}
          />

          <Text style={styles.label}>Produto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Produto desejado"
            value={produto}
            onChangeText={setProduto}
          />

          <Text style={styles.label}>Quantidade:</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade desejada"
            value={quantidade.toString()}
            onChangeText={text => setQuantidade(parseInt(text) || 0)}
            keyboardType="numeric"
          />

          <View style={styles.buttonWrapper}>
            <Button color="#D9A066" title="Enviar Pedido" onPress={fazerPedido} />
          </View>
        </View>

        <Text style={styles.subtitle}>Pedidos Recentes</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.pedidoItem, item.entregue && styles.entregue]}>
            <Text style={[styles.pedidoText, item.entregue && styles.entregueText]}>👤 {item.cliente}</Text>
            <Text style={[styles.pedidoText, item.entregue && styles.entregueText]}>🧺 {item.produto}</Text>
            <Text style={[styles.pedidoText, item.entregue && styles.entregueText]}>📦 {item.quantidade}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => marcarEntregue(item.id)}
                style={styles.buttonEntregue}
              >
                <Text style={styles.buttonText}>{item.entregue ? 'Desfazer' : 'Entregue'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => excluirPedido(item.id)}
                style={styles.buttonExcluir}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum pedido ainda.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  );
}

export const options = { title: 'Pedidos' };

// estilos//
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF3E0', 
    padding: 30 
  },

  header: { 
    paddingBottom: 10 
  },

  title: {
    paddingTop: 50,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#8B5E3C',
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
    backgroundColor: '#fff',
  },

  buttonWrapper: { 
    marginTop: 10, 
    marginBottom: 10 
  },

  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#A67C52',
    textAlign: 'center',
  },

  listContent: { 
    paddingBottom: 100 
  },

  pedidoItem: {
    backgroundColor: '#FFF8F0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  entregue: { 
    backgroundColor: '#B7C9B1', 
    borderColor: '#8b9a85ff' },

  pedidoText: { 
    fontSize: 16, 
    color: '#A67C52' 
  },

  entregueText: { 
    textDecorationLine: 'line-through', 
    color: '#4b8d5fff' 
  },

  buttons: { 
    flexDirection: 'row', 
    marginTop: 10, 
    justifyContent: 'center' 
  },

  buttonEntregue: { 
    backgroundColor: '#D9A066', 
    padding: 6, 
    borderRadius: 6, 
    marginRight: 10 },

  buttonExcluir: { 
    backgroundColor: '#C17E70', 
    padding: 6, 
    borderRadius: 6 
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },

  vazio: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#999' 
  },
});