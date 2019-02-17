import React from 'react';
import {ScrollView} from 'react-native';
import {Body, CheckBox, Container, List, ListItem, Right, Separator, Text} from 'native-base';
import {ScheduledTasksService} from "../services/ScheduledTasksService";
import api from "../services/api";
import moment from 'moment';
import {Loading} from "../components/Loading";
import {t} from "../services/trans";

export default class ScheduleScreen extends React.Component {
    static navigationOptions = () => ({
        title: t('screen.schedule.header')
    });

    constructor(props) {
        super(props);

        this.scheduledTasksService = new ScheduledTasksService();

        this.state = {isLoading: true, tasks: null, done: []};
    }

    componentDidMount() {
        this.scheduledTasksService.getAll((tasks) => {
            let done = [];

            tasks.forEach((petsTasks) => {
                petsTasks.tasks.forEach(task => {
                    if (typeof task.completed === 'object') {
                        done.push(task.id);
                    }
                })
            });

            this.setState({tasks: tasks, done: done, isLoading: false});
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loading/>
        }

        let items = [];

        this.state.tasks.forEach((data, idx) => {
            items.push(
                <Separator bordered key={idx}>
                    <Text>{data.pet_name.toUpperCase()}</Text>
                </Separator>
            );

            data.tasks.forEach((task, idx) => {
                let date = moment(task.date);

                items.push(
                    <ListItem noIndent key={task.id}>
                        <CheckBox
                            checked={this.state.done.includes(task.id)}
                            onPress={() => {
                                this._toggleTaskStatus(task.id);
                            }}/>
                        <Body>
                            <Text style={{paddingLeft: 10}}>{task.name}</Text>
                        </Body>
                        <Right>
                            <Text note>{date.format('hh:mm')}</Text>
                        </Right>
                    </ListItem>
                );
            });
        });

        return (
            <Container style={{backgroundColor: 'transparent'}}>
                <ScrollView>
                    <List style={{backgroundColor: '#FFF'}}>
                        {items}
                    </List>
                </ScrollView>
            </Container>
        );
    }

    _toggleTaskStatus(id) {
        let done = this.state.done;

        if (done.includes(id)) {
            this._incompleteTask(id);
        } else {
            this._completeTask(id);
        }
    }

    _removeFromDone(id, cb) {
        let done = this.state.done.filter(el => el !== id);
        this.setState({done: done}, cb);
    }

    _pushToDone(id, cb) {
        let done = this.state.done;
        done.push(id);
        this.setState({done: done}, cb);
    }

    _incompleteTask(id) {
        this._removeFromDone(id, () => {
            this.scheduledTasksService.incomplete(id, (res) => {
            }, (error) => {
                this._pushToDone(id);

                api.errorHandler(error);
            });
        });
    }

    _completeTask(id) {
        this._pushToDone(id, () => {
            this.scheduledTasksService.complete(id, (res) => {
            }, (error) => {
                this._removeFromDone(id);

                api.errorHandler(error);
            });
        });
    }
}
