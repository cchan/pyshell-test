/*
Simple test usage of python-shell package to offload computation onto Python processes.
This program just calculates Collatz Conjecture sequences.
*/

const PythonShell = require('python-shell');
const readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var halfProcessor = new PythonShell('./halver.py');
var triplePlusOneProcessor = new PythonShell('./doubler.py');

function message_callback(message){
  console.log('Message received:', message);
  const number = parseInt(message);
  if(isNaN(number))
    console.error('Not a number!');
  else if(number == 1)
    console.log('end!\n');
  else if(number % 2 == 0)
    halfProcessor.send(number);
  else
    triplePlusOneProcessor.send(number);
}

halfProcessor.on('message', message_callback);
triplePlusOneProcessor.on('message', message_callback);

rl.on('line', function(line){
  message_callback(line);
});

// end the input stream and allow the process to exit 
// pyshell.end(function (err) {
//  if (err) throw err;
//  console.log('finished');
//});
