import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PrecificacaoScreen () {
    const [custo, setCusto] = useState ('');
    const [margem, setMargem] = useState ('');
    const [imposto, setImposto] = useState ('');
    const [precoFinal, setPrecoFinal] = useState<number | null>(null);

    // calculando

    const calcularPreco = () => {
        const custoNum = parseFloat(custo.replace(',', '.')) || 0;
        const margemNum = parseFloat(margem) || 0;
        const impostoNum = parseFloat(imposto) || 0;

        if (custoNum <=0) {
            setPrecoFinal(null);
            return;
        }

        const preco = custoNum / (1 - (margemNum + impostoNum) / 100);
        setPrecoFinal(parseFloat(preco.toFixed(2)));
    };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Precificar</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Custo do produto (R$):</Text>
                    <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Ex: 10.50"
                    value={custo}
                    onChangeText={(text) => {
                        setCusto(text);
                        calcularPreco();
                    }}
                />

            <Text style={styles.label}>Margem de lucro (%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ex: 40"
            value={margem}
            onChangeText={(text) => {
              setMargem(text);
              calcularPreco();
            }}
          />

          <Text style={styles.label}>Imposto (%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Ex: 5"
            value={imposto}
            onChangeText={(text) => {
              setImposto(text);
              calcularPreco();
            }}
          />

          <TouchableOpacity style={styles.button} onPress={calcularPreco}>
            <Text style={styles.buttonText}>Calcular</Text>
          </TouchableOpacity>

          {precoFinal !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Preço de venda sugerido:</Text>
              <Text style={styles.resultValue}>R$ {precoFinal.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// estilos//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    paddingTop: 50,
    fontSize: 35,
    fontWeight: 'bold',
    color: '#5C4033',
    marginVertical: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF8E7',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#6F4E37',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C2B280',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#D9A066',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF8E7',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: '#E9D8A6',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#5C4033',
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'center',
    marginTop: 8,
  },
});