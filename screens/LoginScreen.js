import React from 'react';
import {StyleSheet,} from 'react-native';
import {Storage} from '../services/Storage';
import {setToken} from './../services/api';
import {Button, Container, Content, Form, Icon, Input, Item, Tab, Tabs, Text} from 'native-base';
import {AuthService} from "../services/AuthService";
import {t} from "../services/trans";
import {Loading} from "../components/Loading";

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            login: {
                username: 'person1', password: 'password', isLoggedIn: false,
            },
            register: {
                username: 'person10', password: 'password10', email: 'person10@example.com',
            }
        };

        this.authService = new AuthService();

        this.checkIsLogged();
    }

    async checkIsLogged() {
        const {navigate} = this.props.navigation;
        const currentJwt = await Storage.get('JWT');

        if (currentJwt) {
            this.authService.validateToken(
                currentJwt,
                data => {
                    setToken(currentJwt);

                    navigate('Main');
                },
                error => {
                    setToken(null);
                    Storage.clear('JWT');

                    this.setState({isLoading: false});

                }
            );

            return;
        }

        this.setState({isLoading: false});
    }

    render() {
        const {isLoading} = this.state;

        if (isLoading) {
            return <Loading/>;
        }

        return (
            <Container style={styles.contentContainer}>
                <Content style={styles.content}>
                    <Tabs>
                        <Tab heading={t('screen.login.login_tab')}>
                            <Form>
                                <Item>
                                    <Icon active name='person'/>
                                    <Input placeholder={t('screen.login.login')} autoCapitalize={'none'}
                                           defaultValue={this.state.login.username}
                                           onChangeText={(val) => this.state.login.username = val}/>
                                </Item>
                                <Item last>
                                    <Icon active name='lock'/>
                                    <Input placeholder={t('screen.login.password')} autoCapitalize={'none'} textContentType={"password"}
                                           secureTextEntry={true} defaultValue={this.state.login.password}
                                           onChangeText={(val) => this.state.login.password = val}/>
                                </Item>
                                <Button block onPress={this._handleLoginButtonPress}>
                                    <Text>{t('screen.login.login_button')}</Text>
                                </Button>
                            </Form>
                        </Tab>
                        <Tab heading={t('screen.login.register_tab')}>
                            <Form>
                                <Item>
                                    <Icon active name='person'/>
                                    <Input placeholder={t('screen.login.login')} autoCapitalize={'none'}
                                           defaultValue={this.state.register.username}
                                           onChangeText={(val) => this.state.register.username = val}/>
                                </Item>
                                <Item>
                                    <Icon active name='lock'/>
                                    <Input placeholder={t('screen.login.password')} autoCapitalize={'none'} textContentType={"password"}
                                           secureTextEntry={true} defaultValue={this.state.register.password}
                                           onChangeText={(val) => this.state.password = val}/>
                                </Item>
                                <Item last>
                                    <Icon active name='mail'/>
                                    <Input placeholder={t('screen.login.email')} autoCapitalize={'none'}
                                           defaultValue={this.state.register.email}
                                           onChangeText={(val) => this.state.register.email = val}/>
                                </Item>
                                <Button block onPress={this._handleRegisterButtonPress}>
                                    <Text>{t('screen.login.register_button')}</Text>
                                </Button>
                            </Form>
                        </Tab>
                    </Tabs>
                </Content>
            </Container>
        );
    }

    _handleLoginButtonPress = async () => {
        const {navigate} = this.props.navigation;

        this.authService.login(
            this.state.login.username,
            this.state.login.password,
            (data) => {
                this.state.login.isLoggedIn = true;
                console.log(data);
                Storage.set('JWT', data.token);
                setToken(data.token);

                navigate('Main');
            }
        );
    };

    _handleRegisterButtonPress = async () => {
        const {navigate} = this.props.navigation;

        this.authService.register(
            {
                username: this.state.register.username,
                password: this.state.register.password,
                email: this.state.register.email,
            },
            (data) => {
                this.state.login.isLoggedIn = true;
                Storage.set('JWT', data.token);
                setToken(data.token);

                navigate('NewPet');
            }
        );
    };
}

const styles = StyleSheet.create({
    content: {
        padding: 10,
    },
    contentContainer: {
        paddingTop: 130,
    },
});
