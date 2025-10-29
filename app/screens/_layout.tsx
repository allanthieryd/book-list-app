import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InfosLayout() {
  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
        }}
      >
        <Tabs.Screen 
          name="AddBookScreen"
          options={{ 
            title: 'Ajouter un livre',
            tabBarLabel: 'Ajouter un livre',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="EditBookScreen"
          options={{ 
            href: null,
          }}
      />
       <Tabs.Screen 
          name="BookDetailsScreen"
          options={{ 
            href: null,
          }}
        />
      </Tabs>
      
  );
}