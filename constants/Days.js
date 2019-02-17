import RRule from "rrule/dist/esm/src/rrule";

const days = [
    {id: RRule.MO.weekday, code: RRule.MO.toString()},
    {id: RRule.TU.weekday, code: RRule.TU.toString()},
    {id: RRule.WE.weekday, code: RRule.WE.toString()},
    {id: RRule.TH.weekday, code: RRule.TH.toString()},
    {id: RRule.FR.weekday, code: RRule.FR.toString()},
    {id: RRule.SA.weekday, code: RRule.SA.toString()},
    {id: RRule.SU.weekday, code: RRule.SU.toString()},
];

export default days;