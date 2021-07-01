timeBlockContElement = $('#time_block_container');
hoursDict = {1: '9', 2: '10', 3: '11', 4: '12', 5: '1', 6: '2', 7: '3', 8: '4', 9: '5'};
hoursList = ['9', '10', '11', '12', '1', '2', '3', '4', '5'];


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
// gets current hour as integer
function currentHour(){
    currentMoment = moment();
    let currentHour = parseInt(currentMoment.format('h'), 10);
    return currentHour
}
// function to swap index number to a base 12 counter
function getTimeSideFromIndex(index){
    let am='PM';
    if (index < 11){
        am = 'AM';
    }
    return am;
}
function getTimeFromIndex(index){
    let hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return hours[index];
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

// function to populate an entire day - first 9 elements of indexToHour
function populateFullDay(){
    let moment = currentHour();
    // loop through hours 9AM to 5PM
    for(let i=0; i <= hoursList.length; i++){
        let hour = hoursList[i];
        let am = getTimeSideFromIndex();
        let period = 'past';
        // case for present
        if(hour===moment){
            period = 'present';
        // override for future
        } else if(hour > moment){
            period = 'future';
        } 
        addTimeBlockToPage(hour+am, period, 'blank');
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
            this.results = loadedResults;
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

populateFullDay();