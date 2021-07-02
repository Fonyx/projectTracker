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
        console.log(event);
        // get data-id
        let buttonElement = $(event.target).parent()
        let textElement = buttonElement.siblings('textarea');
        let hourElement = buttonElement.siblings('div');
        console.log(textElement);
        console.log(hourElement);
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
    for(let i=9; i <= 17; i++){
        let am='am';
        let hour = i;
        if(i > 12){
            am='pm'
            hour -= 12;
        }
        let hourObject = new HourObject(hour, am, i, 'none', 'blank_auto');
        objects.push(hourObject);
    }
    return objects
}
//  function to render all hour objects
function renderFullDay(){
    for(let i =0; i<hoursList.length; i++){
        render(hoursList[i]);
    }
}
// function to move through the hours list and set periods
function setPastPresentFuture(){
    let currentMomentHour = parseInt(moment().format('h'), 10);

    for(let i=0; i < hoursList.length; i++){
        if(currentMomentHour < hoursList[i].zeroIndex){
            // console.log($`currently:${currentMomentHour} is less than:${hoursList[i]} so FUTURE PERIOD`);
            hoursList[i].period = 'future';
        } else if(currentMomentHour === hoursList[i].zeroIndex){
            // console.log($`currently:${currentMomentHour} is equal to:${hoursList[i]} so PRESENT PERIOD`);
            hoursList[i].period = 'present';
        } else {
            // console.log($`currently:${currentMomentHour} is greater than:${hoursList[i]} so PAST PERIOD`);
            hoursList[i].period = 'past';
        }
    }
}

// function to update a specific hour object with new text
function updateHourAtWith(hourIndex, textContent){
    for(let i=0; i<hoursList.length; i++){
        if(hoursList[i].hour === hourIndex){
            hoursList[i].text = textContent;
        }
    }
}

class MemoryManager{
    // construct score with initials: value
    constructor(){
        this.memoryName = 'userDayLog';
        this.details = [];
    }

    // function that loads all details from storage
    load(){
        // reset details
        this.details = [];
        // get results from the save store
        let memoryAsString = localStorage.getItem(this.memoryName);
        let loadedResults = JSON.parse(memoryAsString);
        if (loadedResults){
            // add the results from local storage to results list
            this.details = loadedResults;
            return true
        } else {
            // if object has no records in memory
            return false
        }
    }

    // saves details to local storage
    save(){
        localStorage.setItem(this.memoryName, JSON.stringify(this.details));
    }

    // add new object
    update(hoursList){
        this.details = hoursList;
    }

    // edit a specific detail
    updateDetail(index, text){
        self.details[index] = text;
    }

    // reset local memory
    resetLocalMemory(){
        localStorage.clear();
        console.log('reset local storage was complete');
    }
}

// isolating memory object to functions instead
function load(){
    let memoryAsString = localStorage.getItem('hoursObject');
    return JSON.parse(memoryAsString);
}

function save(hours){
    localStorage.setItem('hoursObject', JSON.stringify(hours));
}

function render(hour) {
    addTimeBlockToPage(hour.hour,hour.am, hour.period, hour.text);
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

timeBlockContElement = $('#time_block_container');

hoursList = load();
if(hoursList === null){
    hoursList = buildHourObjects();
}
setPastPresentFuture();
renderFullDay();
addEventHandlersToIcons();