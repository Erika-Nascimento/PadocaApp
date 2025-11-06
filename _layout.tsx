import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarActiveTintColor: 'rgba(102, 64, 34, 1)',
        tabBarInactiveTintColor: '#A67C52',
        tabBarStyle: {
          backgroundColor: '#FFF8F0',
          height: 60,
          borderTopColor: 'rgba(154, 120, 28, 1)8F0',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ color, size }) => {
        if (route.name === 'home') {
          return <Ionicons name="home" size={size} color={color} />;
        } else if (route.name === 'estoque') {
          return <Ionicons name="cube" size={size} color={color} />;
        } else if (route.name === 'pedidos') {
          return <Ionicons name="receipt" size={size} color={color} />;
        } else if (route.name === 'relatorios') {
          return <Ionicons name="bar-chart" size={size} color={color} />;
        }
          return <Ionicons name="alert-circle" size={size} color={color} />; // fallback
        },
      })}
    >
    </Tabs>
  );
}
