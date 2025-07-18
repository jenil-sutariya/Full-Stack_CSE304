Develop a Live Event Feedback Dashboard for a virtual event platform. The dashboard must display a personalized greeting using the participant's first name and surname. It should enable participants to submit real-time feedback on the session's quality, offering options such as Excellent, Good, Average, and Poor. The interface must also show the current time, updating every second. A submission counter is required to track the number of feedback entries made by the participant. The counter should include controls to increment, decrement, reset, and increment by five. Additionally, the system should simulate feedback from other users by randomly increasing the count of one feedback category every two seconds.
1. Greeting Section:
 Two input boxes for the participant to enter their first name and surname.
 Show a personalized greeting like: ➤ Welcome, Priyanka Padhiyar !
2. Live Clock:
 Show the current local date and time, updating every second using React concepts (no plain JS DOM).
3. Feedback Voting Panel:
 Four buttons labeled: Excellent, Good, Average, Poor.
 When the user clicks a feedback button, increment the corresponding feedback count and update the results immediately.
Display the total feedback count per category dynamically.
4. Simulated Real-Time Voting:
 Use a timer to simulate votes from other participants.
 Every 2 seconds, randomly increase the vote count for one of the four feedback options.
5. Counter Panel:
 Display a separate feedback counter for how many votes the user has personally submitted.
 Provide buttons: Increment, Decrement, Reset, and Increment by 5 to modify this counter.

Evaluation Rubric:
Criteria
Marks
Proper use of useState and useEffect
4
Correct implementation of timer updates (real-time)
4
Functional greeting & input form handling
4
Working feedback vote system with UI update
4
Counter operations and separate state tracking
4
Total
20