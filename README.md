# Project Details

- ### Project Name: Mock
- ### Repo Link: https://github.com/cs0320-s24/mock-emonch-b3nkang

# Design Choices

### Project Structure (Classes/Interfaces):

At a high level, everything is routed through `REPLInput`, which takes in all of the important props and sets them as commands come in, and which has a `handleSubmit()` function which generically extracts the command each time and, if a handler exists for it, will call the handler. All four handlers `mode, load_file, view, search` all implement the `REPLFunction` interface defined in `REPLFunction.tsx`, and are together housed in the `CommandHandlers.tsx` file, and then called by `REPLInput.tsx` based on the extracted command-line command.

### Specific Data Structures:

The csvs are parsed (parser is not implemented, we are just supplying the raw data structure) into lists of lists of strings. Other than that, there is a hashMap used to store different datasets.

# Errors/Bugs

- Perhaps less-so a bug and more an issue in general, we've tried to abstract as much away from the big `if-else` in `REPLInput`'s `handleSubmit()` by implementing the strategy pattern via `CommandHandlers.tsx`, but there are still a few dependencies - new handlers which require new props will still need to be added to the `REPLInput.tsx` props interface at the end of the day.
- Cell values in a sheet with spaces in between - because this isn't an implementation of parser or the backend in general, this behavior we consciously did not test for or account for.

# Tests

The testing suite mainly comprises tests for the various command handlers and permutations of their behavior depending on the given input. There are a whole host of unit tests to test all sorts of handler behavior in `basic-example.spec.ts`, such as searching without a loaded csv, calling load with an invalid filepath, or searching with weirdly-formed csv data. In addition, there is a full end-to-end testing suite in `App.spec.ts` in the `e2e` dir which runs the website, headless, with various testing automations, such as converting between `verbose` and `brief` and running a full flow of commands beginning with error-bound `load_file` and `view` all the way to `search` on a loaded csv.

to run tests, use

- `npm run test` to run all tests
- `npm run test:e2e` to run only the end-to-end tests
- `npm run test:unit` to run only the unit tests
- `npx playwright show-report` to get a more detailed report on your tests

# How to...

Ensure you have the requisite dependencies installed. Then, type `npm start` to run the website locally. Press the `Log In` button to start and start using the REPL. As a reminder, the default configuration only recognizes the following four commands:

- `mode`, which is run alone with no other args, and changes the REPL output between `brief` and `verbose` mode.
- `load_file <filepath.csv>`, which must be run first in order to use the two other commands below. `load_file` takes a required second arg which is the filepath. E.g. `load_file path1.csv`.
- `view`, which is run alone with no other args, and displays the loaded csv in a table in history.
- `search <column header or index> <search value>`, which searches the csv for cells with a given search value and returns the corresponding row in the history.

# Collaboration

_(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)_

None on Ben's end, other than using EdStem and lecture/gearup/course content.
None on Enno's end either, other than using EdStem and lecture/gearup/ course content. 
