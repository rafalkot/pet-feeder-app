import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Container, Form, Icon, Input, Item, Label, Picker, Text} from 'native-base';
import {PetsService} from './../services/PetsService';
import {t} from "../services/trans";
import types from "../constants/PetTypes";

export default class NewPetScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: t('screen.new_pet.header'),
            headerLeft: <Button transparent onPress={navigation.getParam('backHandler')}>
                <Text>{t('screen.new_pet.cancel')}</Text>
            </Button>,
            headerRight: <Button transparent onPress={navigation.getParam('addHandler')}>
                <Text>{t('screen.new_pet.add')}</Text>
            </Button>,
            headerMode: 'float'
        }
    };

    constructor(props) {
        super(props);

        this.petsService = new PetsService();

        this.state = {name: '', type: ''};
    }

    componentDidMount() {
        this.props.navigation.setParams({
            backHandler: () => {
                this.props.navigation.navigate('Pets');
            },
            addHandler: () => {
                this._handleSubmitButtonPress();
            }
        });
    }

    render() {
        return (
            <Container style={styles.contentContainer}>
                <View style={styles.content}>
                    <Form style={styles.form}>
                        <Item>
                            <Input placeholder={t('screen.new_pet.name')} onChangeText={(val) => this.state.name = val}/>
                        </Item>
                        <Item picker fixedLabel last>
                            <Label>{t('screen.new_pet.type')}</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down"/>}
                                style={{width: undefined}}
                                placeholder={t('common.select')}
                                placeholderStyle={{color: "#bfc6ea"}}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.type}
                                onValueChange={this._onPetTypeChange.bind(this)}
                            >
                                {Object.keys(types).map(function (name, index) {
                                    return <Picker.Item key={index} label={t('pet_types.' + name)} value={name}/>;
                                })}
                            </Picker>
                        </Item>
                    </Form>
                </View>
            </Container>
        );
    }

    _onPetTypeChange(value) {
        this.setState({type: value});
    }

    _handleSubmitButtonPress = async () => {
        const {navigate} = this.props.navigation;
        const data = {
            name: this.state.name,
            type: this.state.type,
        };

        this.petsService.post(data, (response) => {
            navigate('Pet', {id: response.id});
        });
    };
}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'transparent'
    },
    form: {
        backgroundColor: '#FFF'
    },
});
