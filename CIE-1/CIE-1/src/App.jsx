import React from 'react'
import Greeting from './Greeting'
import Liveclock from './Liveclock'
import Feedback from './Feedback'
import RealTimeVoting from './RealTimeVoting'
import CounterPanel from './CounterPanel'
import './App.css'

function App() {
  return (
    <>
    <div className="App">
      <Greeting />
    </div>
    <div className="Liveclock">
      <Liveclock />
    </div>
    <div className='Feedback'>
      <h1>Feedback Voting Panel</h1>
      <p>Click the buttons below to give your feedback:</p>
      <Feedback />
    </div>
    <div className='RealTimeVoting'>
      <h1>Real-Time Voting Panel</h1>
      <p>Watch the feedback votes update in real-time:</p>
      <RealTimeVoting />
    </div>
    <div className='CounterPanel'>
      <h1>Counter Panel</h1>
      <p>Use the buttons below to increment or decrement the vote count:</p>
      <CounterPanel />
    </div>
    </>
  );
}

export default App;

