import React from 'react';
import {Alert, ScrollView} from 'react-native';
import {
    Body,
    Button,
    Container,
    Default,
    Form,
    Icon,
    Input,
    Left,
    List,
    ListItem,
    Picker,
    Right,
    Separator,
    Text,
    Toast
} from 'native-base';
import {TasksService} from './../services/TasksService';
import {PetsService} from './../services/PetsService';
import {Loading} from "../components/Loading";
import {t} from "../services/trans";
import genders from '../constants/Genders';
import RRule from "rrule/dist/esm/src/rrule";
import moment from "moment";
import {Frequency} from "rrule/dist/esm/src/types";

export default class PetScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: `${navigation.state.params.header ?? ''}`,
            headerLeft: <Button transparent onPress={navigation.getParam('backHandler')}>
                <Text>{t('screen.pet.list')}</Text>
            </Button>,
            headerRight: <Button transparent onPress={navigation.getParam('saveHandler')}>
                <Text>{t('screen.pet.save')}</Text>
            </Button>
        }
    };

    constructor(props) {
        super(props);

        this.tasksService = new TasksService();
        this.petsService = new PetsService();

        this.state = {
            isLoading: true,
            pet: null,
            tasks: null,
            newTaskName: '',
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            backHandler: () => {
                this.props.navigation.navigate('Pets');
            },
            saveHandler: () => {
                this._handleSaveButtonPress();
            }
        });

        this.fetchData();
    }

    fetchData() {
        this.setState({isLoading: true});

        this.petsService.getById(this.props.navigation.getParam('id'), (data) => {
            this.setState({pet: data});
            this.props.navigation.setParams({header: data.name});

            if (this.state.tasks !== null) {
                this.setState({isLoading: false});
            }
        });

        this.tasksService.getAll((data) => {
            this.setState({tasks: data});

            if (this.state.pet !== null) {
                this.setState({isLoading: false});
            }
        });
    }

    render() {
        if (this.state.isLoading) {
            return <Loading/>
        }

        const pet = this.state.pet;
        const tasks = this.state.tasks[pet.id] ?? [];
        const year = (new Date()).getFullYear();
        const years = Array.from(new Array(20), (val, index) => year - index);

        return (
            <Container style={{backgroundColor: 'transparent'}}>
                <ScrollView>
                    <List>
                        <Separator bordered>
                            <Text>{t('screen.pet.profile')}</Text>
                        </Separator>
                    </List>
                    <Form style={{backgroundColor: '#FFF'}}>
                        <ListItem icon>
                            <Left>
                                <Icon active name={pet.gender === 'm' ? 'male' : 'female'}/>
                            </Left>
                            <Body>
                            <Text>{t('screen.pet.gender')}</Text>
                            </Body>
                            <Right>
                                <Picker
                                    note
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down"/>}
                                    placeholder="Select"
                                    placeholderStyle={{color: "#bfc6ea"}}
                                    placeholderIconColor="#007aff"
                                    selectedValue={pet.gender}
                                    onValueChange={(val) => this._updatePetGender(pet, val)}
                                >
                                    {Object.keys(genders).map((key, idx) => {
                                        return <Picker.Item key={idx} label={t('genders.' + genders[key])}
                                                            value={key}/>;
                                    })}
                                </Picker>
                            </Right>
                        </ListItem>
                        <ListItem last icon>
                            <Left>
                                <Icon active name='calendar'/>
                            </Left>
                            <Body>
                            <Text>{t('screen.pet.birth_year')}</Text>
                            </Body>
                            <Right>
                                <Picker
                                    note
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down"/>}
                                    placeholder="Select"
                                    placeholderStyle={{color: "#bfc6ea"}}
                                    placeholderIconColor="#007aff"
                                    selectedValue={pet.birth_year}
                                    onValueChange={(val) => this._updatePetBirthYear(pet, val)}
                                >
                                    {years.map(function (year, index) {
                                        return <Picker.Item key={index} label={year} value={year}/>;
                                    })}
                                </Picker>
                            </Right>
                        </ListItem>
                    </Form>
                    <List style={{backgroundColor: '#FFF'}}>
                        <Separator bordered>
                            <Text>{t('screen.pet.schedule')}</Text>
                        </Separator>
                        <ListItem noIndent icon last={tasks.length === 0}>
                            <Body>
                            <Input placeholder={t('screen.pet.new_task')}
                                   defaultValue={this.state.newTaskName}
                                   onChangeText={(val) => this.setState({newTaskName: val})}/>
                            </Body>
                            <Right>
                                <Button transparent success onPress={(e) => this._handleNewTaskButtonPress(pet)}>
                                    <Icon
                                        ios="ios-add-circle"
                                        android="md-add-circle"
                                        type="Ionicons"/>
                                </Button>
                            </Right>
                        </ListItem>
                        {tasks.map((task, idx) => {
                            const hour = moment(task.hour, "HH:mm:ss").format("HH:mm");
                            let days = this._rruleToLabel(task.recurrence);

                            return <ListItem noIndent button icon last={idx === tasks.length - 1} key={idx}
                                             onPress={() => this._handleTaskListItemPress(task)}>
                                <Body>
                                <Text>{task.name}</Text>
                                <Text note style={{fontSize: 12}}>
                                    {days}
                                </Text>
                                </Body>
                                <Right>
                                    <Text note>{hour}</Text>
                                    <Icon active name="arrow-forward"/>
                                </Right>
                            </ListItem>
                        })}
                        <Separator bordered>

                        </Separator>
                    </List>

                    <Button style={{borderRadius: 0, backgroundColor: '#FFF'}} block bordered danger
                            onPress={(e) => this._handleRemoveButtonPress(pet)}>
                        <Text>{t('screen.pet.remove_profile_button')}</Text>
                    </Button>
                </ScrollView>
            </Container>
        );
    }

    _rruleToLabel(recurrence) {
        const rrule = RRule.parseString(recurrence);

        let days = (rrule.byweekday ?? [])
            .sort((dayA, dayB) => {
                return dayA.weekday - dayB.weekday;
            })
            .map((day, idx) => {
                return day.toString();
            });

        if (days.length === 7 || (rrule.freq === Frequency.DAILY && days.length === 0)) {
            days = t('screen.pet.recurrence_daily');
        } else if (JSON.stringify(days) === JSON.stringify(['MO', 'TU', 'WE', 'TH', 'FR'])) {
            days = t('screen.pet.recurrence_mo_fr');
        } else if (JSON.stringify(days) === JSON.stringify(['SA', 'SU'])) {
            days = t('screen.pet.recurrence_weekend');
        } else {
            days = days.map((day, idx) => {
                return t('days.' + day + '.shortcut');
            }).join(', ');
        }

        return days;
    }

    _handleSaveButtonPress = async () => {
        const data = {
            gender: this.state.pet.gender,
            birth_year: this.state.pet.birth_year,
        };

        this.petsService.put(this.state.pet.id, data, (data) => {
            Toast.show({
                text: t('screen.pet.saved'),
                buttonText: "Okay",
                duration: 3000,
                type: "success"
            });
        });
    };

    _handleRemoveButtonPress = async () => {
        Alert.alert(
            t('screen.pet.confirm_remove'),
            '',
            [
                {text: t('common.cancel')},
                {
                    text: t('common.ok'),
                    onPress: () => {
                        this.petsService.delete(this.state.pet.id, (data) => {
                            this.props.navigation.navigate('Pets');
                        });
                    },
                    style: 'cancel',
                },

            ],
            {cancelable: true},
        );
    };

    _handleNewTaskButtonPress = async (pet) => {
        const name = this.state.newTaskName;

        this.setState({newTaskName: ''});

        this.props.navigation.navigate('Task', {
            petId: pet.id,
            name: name,
            onBack: () => {
                this.fetchData()
            }
        });
    };

    _handleTaskListItemPress = async (task) => {
        this.props.navigation.navigate('Task', {
            petId: task.pet.id,
            taskId: task.id,
            onBack: () => {
                this.fetchData()
            }
        });
    };

    _updatePetGender(pet, value) {
        this.setState({
            pet: {
                ...this.state.pet,
                gender: value
            }
        });
    }

    _updatePetBirthYear(pet, value) {
        this.setState({
            pet: {
                ...this.state.pet,
                birth_year: value
            }
        });
    }
}