1. Functional Requirements:

    System has to allow users to input code for the baseline assessment problems.

    System must analyze the code to identify specific error types.

    User can make an account with their email and password

    User can linked their google account with the application

    System has to store user data like names and problems solved/progress

    System has to recommend problems in the form of roadmap to the user

    System must provide feedback to users solutions to problems

    System must help the user when requested for help

    User should be able to pick any problem in the roadmap



Story 1: Code Submission Analysis
    As a developer, I want a coding practice site to analyze my code for correctness and efficiency, so that I get objective         feedback on my skills.
Acceptance Criteria:
    Code is executed against at least 10 hidden test cases.
    The AI analyzes the time complexity of the solution and decides if it bad,ok or great
    The AI should explain where the code would fail if its not up to par
    Provide hints to solve the problem when prompted too
Story 2: The Living Roadmap
    As a developer, I want a personalized roadmap so that I can efficiently progress toward my goal without guessing what to practice next. 
    Acceptance Criteria:
        Personalized road map that shows the user a clear path to achieve their goal
        The roadmap adapts to the users skill as the user grows
        The roadmap is saved and is ready for the user to continue it at their own pace. 

2.Non-Functional Requirements:


    The roadmap should take no more than 45 seconds to be generated

    AI Analysis must stream tokens to reduce perceived latency.

    The user code compiler must be strictly isolated to prevent users from attacking the server via the code runner.

    The system must comply with GDPR/CCPA for user data

    The system should be able to handle hundreds of user prompts every minute

    Every page besides the roadmap should load in under a second

    The user interface should be very easy and intuitive to use

    The system should always maintain scalability

    The system should always follow best practices for data security


4. AI-Specific Requirements
    Context Window Management:
        The AI will need to fetch data from the database because it can’t hold all of the users data like problems solved in context.
    Tone & Style Calibration:
        The AI must maintain a "Socratic" teaching style asking guiding questions rather than correcting the code immediately.
    AI Capabilities:
        The AI must be able to know if a solution to a problem is optimal or brute force.
        AI should learn from the users past prompts to better tailor the answers it gives to what the users is looking for.
        AI should not take more than 20 seconds to answer a prompt
        AI should always know the current skill level of the user
5. Prioritization

Must haves:
    System must have all types of problems for all skill levels .
    The roadmap should be dynamically, changing depending on the users performance in problems.
    Must have a skill examination to known the current skill level of the user
    Must know the problems they already solved before

Should have:
    Hints using the socratic method, while solving a problem.(When the user asks for a hint)
    Should have solutions to problems in a couple languages 

Nice to have:
    Syntax error highlighting, and built in function tab complete 
    Sharing your map with other users
    Improvement metric which tells you how much you improved so far.

