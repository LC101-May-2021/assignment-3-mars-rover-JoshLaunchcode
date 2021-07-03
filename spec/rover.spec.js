const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function(){
    let newRover = new Rover(100);
    let values = [newRover.position, newRover.mode, newRover.generatorWatts];
    expect(values).toEqual([100, `NORMAL`, 110]);
  })

  it("response returned by receiveMessage contains name of message", function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Sending a test message');
  })

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{completed: true}, {
      completed: true,
      roverStatus: {
        mode: 'LOW_POWER',
        generatorWatts: 110,
        position: 98382
      }
    }]);
  })

  it("responds correctly to status check command", function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    expect(response.results[0]).toEqual({
      completed: true,
      roverStatus: {
        mode: 'NORMAL',
        generatorWatts: 110,
        position: 98382
      }
    })
  })

  it("responds correctly to mode change command", function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    let statusCheck = [response.results, rover.mode];

    expect(statusCheck).toEqual([[{completed: true}], 'LOW_POWER']);
  })

  it("responds with false completed value when attempting to move in LOW_POWER mode", function(){
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 20)];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    let statusCheck = [response.results, rover.position];

    expect(statusCheck).toEqual([[{completed: true}, {completed: false}], 98382])
  })

  it("responds with position for move command", function(){
    let commands = [new Command('MOVE', 20)];
    let message = new Message('Sending a test message', commands);
    let rover = new Rover(98382); 
    let response = rover.receiveMessage(message);
    let statusCheck = [response.results, rover.position];
    
    expect(statusCheck).toEqual([[{completed: true}], 20])
  })
});
