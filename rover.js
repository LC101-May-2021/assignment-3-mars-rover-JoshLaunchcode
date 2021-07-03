class Rover {
   constructor(position){
     this.position = position,
     this.mode = `NORMAL`,
     this.generatorWatts = 110
   }

  receiveMessage(message){
    let response = {
      message: "",
      results: []
    }

    response.message = message.name;

    for(let i = 0; i < message.commands.length; i++){
      let commandType = message.commands[i].commandType;
      let commandValue = message.commands[i].value;

      if(commandType === 'STATUS_CHECK'){
        response.results.push({
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
          }
        })
      } else if(commandType === 'MODE_CHANGE') {
        if(commandValue === 'LOW_POWER'){
          this.mode = 'LOW_POWER';
          response.results.push(wasCompleted(true));
        } else {
          this.mode = 'NORMAL';
          response.results.push(wasCompleted(true));
        }
      } else if(commandType === 'MOVE'){
        if(this.mode === 'LOW_POWER'){
          response.results.push(wasCompleted(false))
        } else {
          this.position = commandValue;
          response.results.push(wasCompleted(true));
        }
      }
    }

    return response
  }   
}

let wasCompleted = function(response){
  return {
    completed: response
  }
}

module.exports = Rover;