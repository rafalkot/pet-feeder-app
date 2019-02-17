import {Body, Icon, Left, List, ListItem, Right, Separator, Text} from "native-base";
import {PetTypeIcon} from "./PetTypeIcon";
import React from "react";

const PetListItem = ({pet, onPress, last}) => (
    <ListItem noIndent button last={last} icon onPress={onPress}>
        <Left>
            <PetTypeIcon type={pet.type}/>
        </Left>
        <Body>
        <Text>{pet.name}</Text>
        </Body>
        <Right>
            <Icon active name="arrow-forward"/>
        </Right>
    </ListItem>
);

export const PetList = ({pets, onPress}) => {
    const listLength = pets.length;

    return <List style={{backgroundColor: '#FFF'}}>
        <Separator bordered></Separator>
        {pets.map((pet, idx) => {
            return <PetListItem key={idx} last={idx === listLength - 1} onPress={() => {
                onPress(pet);
            }} pet={pet}/>
        })}
    </List>
};
