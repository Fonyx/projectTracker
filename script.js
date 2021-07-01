timeBlockContElement = $('#time_block_container');
hoursList = [
    {hour: 9, am: 'AM', zeroIndex: 9, period: 'none', text: 'blank'},
    {hour: 10, am: 'AM', zeroIndex: 10, period: 'none', text: 'blank'},
    {hour: 11, am: 'AM', zeroIndex: 11, period: 'none', text: 'blank'},
    {hour: 12, am: 'PM', zeroIndex: 12, period: 'none', text: 'blank'},
    {hour: 1, am: 'PM', zeroIndex: 13, period: 'none', text: 'blank'},
    {hour: 2, am: 'PM', zeroIndex: 14, period: 'none', text: 'blank'},
    {hour: 3, am: 'PM', zeroIndex: 15, period: 'none', text: 'blank'},
    {hour: 4, am: 'PM', zeroIndex: 16, period: 'none', text: 'blank'},
    {hour: 5, am: 'PM', zeroIndex: 17, period: 'none', text: 'blank'},
]

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
function addTimeBlockToPage(index, time, period, text){
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
    hourElement.attr('id', 'hour-'+index);
    textElement.attr('id', 'text-'+index);
    buttonElement.attr('id', 'button-'+index);

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
    let currentMomentHour = moment().format('h');

    for(let i=0; i < hoursList.length; i++){
        if(currentMomentHour < hoursList[i].zeroIndex){
            console.log($`currently:${currentMomentHour} is less than:${hoursList[i]} so FUTURE PERIOD`);
            hoursList[i].period = 'future';
        } else if(currentMomentHour === hoursList[i].zeroIndex){
            console.log($`currently:${currentMomentHour} is equal to:${hoursList[i]} so PRESENT PERIOD`);
            hoursList[i].period = 'present';
        } else {
            console.log($`currently:${currentMomentHour} is greater than:${hoursList[i]} so PAST PERIOD`);
            hoursList[i].period = 'past';
        }
    }
}

// function to populate an entire day - first 9 elements of indexToHour
function populateFullDay(){
    // loop through hoursList
    for(let i=0; i < hoursList.length; i++){
        addTimeBlockToPage(hoursList[i].zeroIndex, hoursList[i].hour+hoursList[i].am, 
            hoursList[i].period, 
            hoursList[i].text);
    }
}

class MemoryManager{
    // construct score with initials: value
    constructor(hoursList){
        this.memoryName = 'userDayLog';
        this.details = hoursList;
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

setPastPresentFuture();
populateFullDay();

let memory = new MemoryManager(hoursList);

memory.save();