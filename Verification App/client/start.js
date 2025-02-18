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
import Hello from './screens/hello';

const Stack = createNativeStackNavigator();

export default function Start() {
    const { currentUser } = useContext(CreateContextApi)
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen
                    name="Login"
                    component={Hello}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerTitle: () => (
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'right' }}>
                                👋 <Text style={{ fontWeight: 'bold' }}>خوش آمدید</Text> {currentUser.urduName}
                            </Text>
                        ),
                        headerBackVisible: false,
                        headerStyle: {
                            // backgroundColor: "#3662AA", // Header background color
                        },
                    }}

                />
                <Stack.Screen
                    name="Verification"
                    component={Verification}
                    options={{
                        headerTitle: () => (
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'right' }}>
                                👋 <Text style={{ fontWeight: 'bold' }}>خوش آمدید</Text> {currentUser.urduName}
                            </Text>
                        ),
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={About}
                    options={{
                        headerTitle: () => (
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'right' }}>
                                👋 <Text style={{ fontWeight: 'bold' }}>خوش آمدید</Text> {currentUser.urduName}
                            </Text>
                        ),
                        headerBackVisible: false
                    }}
                />
                <Stack.Screen
                    name="Account"
                    component={Account}
                    options={{
                        headerTitle: () => (
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'right' }}>
                                👋 <Text style={{ fontWeight: 'bold' }}>خوش آمدید</Text> {currentUser.urduName}
                            </Text>
                        ),
                        headerBackVisible: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}