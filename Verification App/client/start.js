import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/login';
import Home from './screens/home';
import About from './screens/about';
import Verification from './screens/verification';
import Account from './screens/account';
import CreateContextApi from './ContextApi/CreateContextApi';

const Stack = createNativeStackNavigator();

export default function Start() {
    const { currentUser } = useContext(CreateContextApi)
    const name = currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: '👋 Welcome ' + name,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="Verification"
                    component={Verification}
                    options={{
                        title: '👋 Welcome ' + name,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={About}
                    options={{
                        title: '👋 Welcome ' + name,
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="Account"
                    component={Account}
                    options={{
                        title: '👋 Welcome ' + name,
                        headerBackVisible: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}