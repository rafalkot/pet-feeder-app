import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Days, RRule} from 'rrule'
import {Body, Button, Container, Icon, Input, List, ListItem, Right, Separator, Switch, Text} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TasksService} from "../services/TasksService";
import days from "../constants/Days";
import {t} from "../services/trans";
import {Loading} from "../components/Loading";
import moment from "moment";

export default class TaskScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('taskId') ? t('screen.task.edit_task') : t('screen.task.new_task'),
            headerLeft: <Button transparent onPress={navigation.getParam('backHandler')}>
                <Text>{t('screen.task.cancel')}</Text>
            </Button>,
            headerRight: <Button transparent onPress={navigation.getParam('addHandler')}>
                <Text>{navigation.getParam('taskId') ? t('screen.task.save') : t('screen.task.add')}</Text>
            </Button>,
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isDateTimePickerVisible: false,
        };

        if (this.props.navigation.getParam('taskId')) {
            this.state.task = null;
            this.state.isLoading = true;
        } else {
            this.state.task = {
                name: this.props.navigation.getParam('name'),
                hour: null,
                hourDate: new Date(),
                days: days.map((day, idx) => day.code),
            };
            this.state.isLoading = false;
        }

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

        this.fetchData();
    }

    fetchData() {
        if (this.props.navigation.getParam('taskId')) {
            this.tasksService.getById(this.props.navigation.getParam('taskId'), (data) => {
                const rrule = RRule.parseString(data.recurrence);

                data.days = rrule.byweekday ? rrule.byweekday.map((day, idx) => {
                    return day.toString();
                }) : days.map((day) => {
                    return day.code;
                });
                data.hourDate = moment(data.hour, "HH:mm:ss").toDate();
                data.hour = this._timeformat(data.hourDate);

                this.setState({task: data, isLoading: false});
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loading/>
        }

        return (
            <Container style={styles.contentContainer}>
                <ScrollView>
                    <List style={styles.list}>
                        <Separator bordered>
                        </Separator>
                        <ListItem noIndent icon>
                            <Body>
                            <Input placeholder={t('screen.task.name')}
                                   defaultValue={this.state.task.name}
                                   onChangeText={(val) => this.state.task.name = val}/>

                            </Body>
                        </ListItem>
                        <ListItem button={true} icon last onPress={this._showDateTimePicker}>
                            <Body>
                            <Text>{t('screen.task.hour')}</Text>
                            </Body>
                            <Right>
                                <Text note>{this.state.task.hour}</Text>
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
                                <Switch value={this.state.task.days.includes(day.code)} onValueChange={(val) => {
                                    this._handleDayChange(val, day.code)
                                }}/>
                            </ListItem>;
                        })}

                    </List>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                        date={this.state.task.hourDate}
                        mode={"time"}
                    />
                </ScrollView>
            </Container>
        );
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({task: {...this.state.task, hour: this._timeformat(date), hourDate: date}});
        this._hideDateTimePicker();
    };

    _timeformat = (date) => {
        return moment(date).format('HH:mm');
    };

    _handleDayChange = async (val, id) => {
        let days = this.state.task.days;

        if (val) {
            days.push(id);
            days = days.filter((v, i, a) => a.indexOf(v) === i);
        } else {
            days = days.filter(el => el !== id);
        }
        console.log(days);

        this.setState({task: {...this.state.task, days: days}});
    };

    _handleSaveButtonPress = async () => {
        const rule = new RRule({
            freq: RRule.DAILY,
            byweekday: this.state.task.days.map((val) => {
                return RRule[val]
            }),
        });

        const data = {
            name: this.state.task.name,
            hour: this.state.task.hour + ':00',
            time_zone: "Europe\/Warsaw",
            recurrence: rule.toString().replace('RRULE:', ''),
        };

        const onSuccess = (data) => {
            const reloadLastScreen = this.props.navigation.getParam('onBack');
            reloadLastScreen();

            console.log(data);
            console.log(this.props.navigation.getParam('petId'));
            this.props.navigation.navigate('Pet', {
                id: this.props.navigation.getParam('petId')
            });
        };

        if (this.state.task.id) {
            this.tasksService.put(this.state.task.id, data, onSuccess);

        } else {
            this.tasksService.post({
                ...data,
                pet_id: this.props.navigation.getParam('petId')
            }, onSuccess);
        }

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
