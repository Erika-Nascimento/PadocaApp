import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from 'expo-router';


const screenWidth = Dimensions.get('window').width * 0.9;

export default function RelatoriosScreen() {
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pedidosEntregues, setPedidosEntregues] = useState(0);
  const [pedidosPendentes, setPedidosPendentes] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);

  const STORAGE_PEDIDOS = '@pedidos_padaria';
  const STORAGE_ESTOQUE = '@estoque_padaria';

  // Carrega dados do AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
        const carregarDados = async () => {
            const pedidosData = await AsyncStorage.getItem(STORAGE_PEDIDOS);
            const estoqueData = await AsyncStorage.getItem(STORAGE_ESTOQUE);

      if (pedidosData) {
        const pedidos = JSON.parse(pedidosData);
        setTotalPedidos(pedidos.length);
        setPedidosEntregues(pedidos.filter((p: any) => p.entregue).length);
        setPedidosPendentes(pedidos.filter((p: any) => !p.entregue).length);
      }

      if (estoqueData) {
        const estoque = JSON.parse(estoqueData);
        setEstoqueBaixo(estoque.filter((item: any) => item.quantidade <= 3).length);
      }
    };

    carregarDados();
  }, [])
);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          ⬧ Total de pedidos: <Text style={styles.number}>{totalPedidos}</Text>
        </Text>
        <Text style={styles.label}>
          ⬧ Entregues: <Text style={styles.number}>{pedidosEntregues}</Text>
        </Text>
        <Text style={styles.label}>
          ⬧ Pendentes: <Text style={styles.number}>{pedidosPendentes}</Text>
        </Text>
        <Text style={styles.label}>
          ⬧ Itens com estoque baixo: <Text style={styles.number}>{estoqueBaixo}</Text>
        </Text>
      </View>

      <BarChart
        data={{
          labels: ['Entregues', 'Pendentes'],
          datasets: [
            {
              data: [pedidosEntregues, pedidosPendentes],
            },
          ],
        }}
        width={screenWidth}
        height={220}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""

        chartConfig={{
          backgroundGradientFrom: '##FFF8F0',
          backgroundGradientTo: '#FFF8F0',
          color: (opacity: number) => `rgba(166, 166, 124, ${opacity})`,
          labelColor: (opacity: number) => `rgba(166, 124, 82, ${opacity})`,
          barPercentage: 0.6,
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
}

export const options = { title: '📊 Relatórios' };

// estilos//
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#FAF3E0',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    paddingTop: 50,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#8B5E3C',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 20,
    color: '#A67C52',
    marginBottom: 8,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A67C52',
  },
  chart: {
    fontSize: 25,
    padding: 70,
    borderRadius: 16,
    backgroundColor: "fff",
  },
});