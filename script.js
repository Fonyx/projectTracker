timeBlockContElement = $('#time_block_container');
hoursList = [];

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

// function to populate 1 day of work sessions
function addTimeBlockToPage(time, period, text){
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
    textElement.attr('id', 'text-'+time);
    buttonElement.attr('id', 'button-'+time);

    // edit content of elements
    hourElement.text(time);
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

// function to move through the hours list and set periods
function setPastPresentFuture(){
    // let currentMomentHour = moment().format('h');
    let currentMomentHour = 16;

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

// function make all the hour objects
function buildHourObjects(){
    for(let i=9; i <= 17; i++){
        let am='am';
        let hour = i;
        if(i > 12){
            am='pm'
            hour -= 12;
        }
        let hourObject = new HourObject(hour, am, i, 'none', 'blank_auto');
        hoursList.push(hourObject);
    }
}

//  function to render all hour objects
function renderFullDay(){
    // for(let i =0; i<hoursList.length; i++){
    //     hoursList[i].render();
    // }
    hoursList.forEach(hour => {
        hour.render();
    });
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
        } else {
            // if object has no records in memory
            if (debug){
                console.log('No result found in local storage');
            }
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

class HourObject{
    constructor(hour, am, zeroIndex, period, text){
        this.hour = hour;
        this.am = am;
        this.zeroIndex = zeroIndex;
        this.period = period;
        this.text = text;
    }

    render = () => {
        addTimeBlockToPage(this.hour, this.period, this.text);
    }

}

let memory = new MemoryManager();

buildHourObjects();
setPastPresentFuture();
renderFullDay();

memory.save();