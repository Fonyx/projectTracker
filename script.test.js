// const { test } = require('jest-circus');
const getCurrentMomentAs24Hour = require('./getCurrentMomentAs24Hour');


test('testing all hours return 24 hour equivalent', () => {
    for(let i=0; i<24; i++){
        // handling format being base 10
        if(i < 10){
            currentMoment = moment(i, "h");
        } else{
            currentMoment = moment(i, "hh");
        }
        let currentAm = moment(i, "h").format('a');
        if(currentAm === "pm"){
            expect(getCurrentMomentAs24Hour(currentMoment).toBe(i+12));
        }else{
            expect(getCurrentMomentAs24Hour(currentMoment).toBe(i));
        }
    }
})
