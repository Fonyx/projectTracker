// || HELPER FUNCTIONS
// makes a jquery element
function makeNewJqueryElement(elementType, classString, idString){
    let newElement = $('<'+elementType+'>');
    if(classString){
        newElement.addClass(classString);
    }
    if(idString){
        newElement.attr('id', idString);
    }
    return newElement;
}
// || FULL FUNCTIONS
// function to populate 1 day of work sessions
function addTimeBlockToPage(time, am, period, text){
    // time is an integer in [9, 10, 11, 12, 1, 2, 3, 4, 5]
    // period is a string in ['past', 'present', 'future']
    // text is any text stored in local storage
    let timeBlockElement = makeNewJqueryElement('div', 'time-block', time);
    let rowElement = makeNewJqueryElement('div', 'row');
    let hourElement = makeNewJqueryElement('div', 'hour col-1');
    let textElement = makeNewJqueryElement('textarea', period+' col-10');
    let buttonElement = makeNewJqueryElement('div', 'saveBtn col-1 pt-4');
    let iconElement = makeNewJqueryElement('i', 'bi bi-save');

    // class and id details
    hourElement.attr('id', 'hour-'+time);
    hourElement.attr('data-id', time);
    textElement.attr('id', 'text-'+time);
    textElement.attr('data-id', time);
    textElement.attr('data-value', '');
    textElement.attr('onkeyup',"this.setAttribute('data-value', this.value);");
    buttonElement.attr('id', 'button-'+time);
    buttonElement.attr('data-id', time);

    // edit content of elements
    hourElement.text(time+am);
    textElement.text(text);

    // attach all elements
    buttonElement.append(iconElement);
    rowElement.append(hourElement);
    rowElement.append(textElement);
    rowElement.append(buttonElement);
    timeBlockElement.append(rowElement);

    // attach to container in dom flow
    timeBlockContElement.append(timeBlockElement);

}

// add event handlers to the buttons
function addEventHandlersToIcons(){
    let icons = $('i');
    icons.on('click', handleTextChangeSaveEvent)
}

// handling update of details through event handler
function handleTextChangeSaveEvent(event){
        // get data-id
        let buttonElement = $(event.target).parent()
        let textElement = buttonElement.siblings('textarea');
        let hourElement = buttonElement.siblings('div');
        // get text
        let textCont = textElement.data('value');
        let hourCont = parseInt(hourElement.text(), 10);
        // update corresponding hour object
        if(textCont !== ""){
            updateHourAtWith(hourCont, textCont)
            // save memory object
            save(hoursList);
            // reload page
            location.reload();
        }
}

// function make all the hour objects
function buildHourObjects(){ 
    let objects = []; 
    objects.push(new HourObject(9, 'am', 9, 'none', ''));
    objects.push(new HourObject(10, 'am', 10, 'none', ''));
    objects.push(new HourObject(11, 'am', 11, 'none', ''));
    objects.push(new HourObject(12, 'pm', 12, 'none', ''));
    objects.push(new HourObject(1, 'pm', 13, 'none', ''));
    objects.push(new HourObject(2, 'pm', 14, 'none', ''));
    objects.push(new HourObject(3, 'pm', 15, 'none', ''));
    objects.push(new HourObject(4, 'pm', 16, 'none', ''));
    objects.push(new HourObject(5, 'pm', 17, 'none', ''));
    // for(let i=9; i <= 17; i++){
    //     let am='am';
    //     let hour = i;
    //     if(i > 12){
    //         am='pm'
    //         hour -= 12;
    //     }
    //     let hourObject = new HourObject(hour, am, i, 'none', '');
    //     objects.push(hourObject);
    // }
    return objects
}

// get current 24 hour value [0-23] - tested
function getCurrentMomentAs24Hour(currentMoment = moment()){
    let currentMomentHour = parseInt(currentMoment.format('h'));
    let currentTimeSide = currentMoment.format('a');
    if(currentTimeSide == 'pm'){
        // case for midday, don't add 12
        if(currentMomentHour != 12){
            currentMomentHour += 12;
        }
    } else{
        // case for midnight
        if(currentMomentHour === 12){
            currentMomentHour = 0;
        }
    }
    return currentMomentHour;
}

// isolating memory object to functions instead
function load(){
    let memoryAsString = localStorage.getItem('hoursObject');
    return JSON.parse(memoryAsString);
}

function reloadHours(){
    hoursList = load();
    // if no details loaded, build fresh ones
    if(hoursList === null){
        hoursList = buildHourObjects();
    }
}

function renderHours(){
    for(let i =0; i<hoursList.length; i++){
        let hour = hoursList[i];
        addTimeBlockToPage(hour.hour,hour.am, hour.period, hour.text);
    }
}

function resetDays(){
    // set text of all hours to empty
    for(let i =0; i<hoursList.length; i++){
        hoursList[i].text = "";
        save(hoursList);
    }
    // reload page
    location.reload();
}

function save(hours){
    localStorage.setItem('hoursObject', JSON.stringify(hours));
}

// function to move through the hours list and set periods
function setPastPresentFuture(){
    let current24HourZeroIndex = getCurrentMomentAs24Hour();

    for(let i=0; i < hoursList.length; i++){
        if(current24HourZeroIndex > hoursList[i].zeroIndex){
            // console.log($`currently:${currentMomentHour} is less than:${hoursList[i]} so FUTURE PERIOD`);
            hoursList[i].period = 'past';
        } else if(current24HourZeroIndex === hoursList[i].zeroIndex){
            // console.log($`currently:${currentMomentHour} is equal to:${hoursList[i]} so PRESENT PERIOD`);
            hoursList[i].period = 'present';
        } else {
            // console.log($`currently:${currentMomentHour} is greater than:${hoursList[i]} so PAST PERIOD`);
            hoursList[i].period = 'future';
        }
    }
}

// set interval for current day time
function setTimerForClock(){
    // get container for clock
    clockBlockElement = $('#currentDay');
    let clock = setInterval(function(){
        let currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");
        clockBlockElement.text(currentTime);
    }, 800);
}

// function to update a specific hour object with new text
function updateHourAtWith(hourIndex, textContent){
    for(let i=0; i<hoursList.length; i++){
        if(hoursList[i].hour === hourIndex){
            hoursList[i].text = textContent;
        }
    }
}

class HourObject{
    constructor(hour, am, zeroIndex, period, text){
        this.hour = hour;
        this.am = am;
        this.zeroIndex = zeroIndex;
        this.period = period;
        this.text = text;
    }
}

setTimerForClock();
// get container for blocks
timeBlockContElement = $('#time_block_container');
// gather locally stored details
reloadHours();
// move through all hours and set period
setPastPresentFuture();

// render all hours
renderHours();

addEventHandlersToIcons();

// module exports
module.exports = getCurrentMomentAs24Hour;