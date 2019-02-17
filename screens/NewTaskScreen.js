import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Days, RRule} from 'rrule'
import {Body, Button, Container, Icon, Input, List, ListItem, Right, Separator, Switch, Text} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TasksService} from "../services/TasksService";
import days from "../constants/Days";
import {t} from "../services/trans";

export default class NewTaskScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: t('screen.task.header'),
            headerLeft: <Button transparent onPress={navigation.getParam('backHandler')}>
                <Text>{t('screen.task.cancel')}</Text>
            </Button>,
            headerRight: <Button transparent onPress={navigation.getParam('addHandler')}>
                <Text>{t('screen.task.add')}</Text>
            </Button>,
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.navigation.getParam('name'),
            hour: null,
            hourDate: null,
            days: days.map((day, idx) => day.code),
            isDateTimePickerVisible: false,
        };

        this.tasksService = new TasksService();
    }

    componentDidMount() {
        this.props.navigation.setParams({
            backHandler: () => {
                this.props.navigation.navigate('Pet', {
                    id: this.props.navigation.getParam('petId')
                });
            },
            addHandler: () => {
                this._handleSaveButtonPress();
            }
        });
    }

    render() {
        return (
            <Container style={styles.contentContainer}>
                <ScrollView>
                    <List style={styles.list}>
                        <Separator bordered>
                        </Separator>
                        <ListItem noIndent icon>
                            <Body>
                            <Input placeholder={t('screen.task.name')}
                                   defaultValue={this.state.name}
                                   onChangeText={(val) => this.state.name = val}/>

                            </Body>
                        </ListItem>
                        <ListItem button={true} icon last onPress={this._showDateTimePicker}>
                            <Body>
                            <Text>{t('screen.task.hour')}</Text>
                            </Body>
                            <Right>
                                <Text note>{this.state.hour}</Text>
                                <Icon active name="arrow-forward"/>
                            </Right>
                        </ListItem>
                    </List>
                    <List style={{...styles.list}}>
                        <Separator bordered>
                            <Text>{t('screen.task.days')}</Text>
                        </Separator>
                        {days.map((day, index) => {
                            return <ListItem noIndent key={index} style={{paddingLeft: 0}}>
                                <Body style={{paddingLeft: 0, marginLeft: 0}}>
                                <Text>{t('days.' + day.code + '.name')}</Text>
                                </Body>
                                <Switch value={this.state.days.includes(day.code)} onValueChange={(val) => {
                                    this._handleDayChange(val, day.code)
                                }}/>
                            </ListItem>;
                        })}

                    </List>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        mode={"time"}
                    />
                </ScrollView>
            </Container>
        );
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({hour: this._timeformat(date), hourDate: date});
        this._hideDateTimePicker();
    };

    _timeformat = (date) => {
        var h = date.getHours();
        var m = date.getMinutes();
        m = m < 10 ? '0' + m : m;
        return h + ':' + m;
    };

    _handleDayChange = async (val, id) => {
        let days = this.state.days;

        if (val) {
            days.push(id);
            days = days.filter((v, i, a) => a.indexOf(v) === i);
        } else {
            days = days.filter(el => el !== id);
        }

        this.setState({days: days});
    };

    _handleSaveButtonPress = async () => {
        const rule = new RRule({
            freq: RRule.DAILY,
            byweekday: this.state.days.map((val) => {
                return RRule[val]
            }),
        });

        this.tasksService.post({
            pet_id: this.props.navigation.getParam('petId'),
            name: this.state.name,
            hour: this.state.hour + ':00',
            time_zone: "Europe\/Warsaw",
            recurrence: rule.toString().replace('RRULE:', ''),
        }, (data) => {
            const reloadLastScreen = this.props.navigation.getParam('onBack');
            reloadLastScreen();

            this.props.navigation.navigate('Pet', {
                id: this.props.navigation.getParam('petId')
            });
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
    list: {
        backgroundColor: '#FFF',
    },
    content: {},
});
