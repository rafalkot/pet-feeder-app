import React from 'react';
import {ScrollView} from 'react-native';
import {Button, Container, Default, Icon, Separator} from 'native-base';
import {PetsService} from './../services/PetsService';
import {Loading} from "../components/Loading";
import {PetList} from "../components/PetList";
import {t} from "../services/trans";

export default class PetsScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: t('screen.pets.header'),
            headerLeft: null,
            headerRight: <Button transparent onPress={navigation.getParam('newPetHandler')}>
                <Icon ios="ios-add" android="md-add" type="Ionicons"/>
            </Button>
        }
    };

    constructor(props) {
        super(props);

        this.petsService = new PetsService();

        this.state = {
            isLoading: true,
            pets: null,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            newPetHandler: () => {
                this.props.navigation.navigate('NewPet');
            }
        });

        this.props.navigation.addListener('willFocus', () => {
            this.fetchData();
        });
    }

    fetchData() {
        this.petsService.getAll((data) => {
            this.setState({pets: data, isLoading: false});
        });
    }

    render() {
        const {isLoading, pets} = this.state;

        if (isLoading) {
            return <Loading/>;
        }

        return (
            <Container style={{backgroundColor: 'transparent'}}>
                <ScrollView>
                    <PetList pets={pets} onPress={(pet) => {
                        this.props.navigation.navigate('Pet', {id: pet.id});
                    }}/>
                </ScrollView>
            </Container>
        );
    }
}
