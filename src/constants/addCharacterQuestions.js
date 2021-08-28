const ADD_CHARACTER_QUESTIONS = [
  {
    type: 'input',
    name: 'name',
    message: "Let's add a character. What is their name?",
  },
  {
    type: 'input',
    name: 'hp',
    message: "How many hit points do they have?",
    validate(value) {
      const pass = value.match(/^\d+$/);
      if (pass) {
        return true;
      }

      return 'Please enter a valid number';
    }
  },
  {
    type: 'input',
    name: 'roll',
    message: "What did they roll for initiative?",
    validate(value) {
      const pass = value.match(/^\d+$/);
      if (pass) {
        return true;
      }

      return 'Please enter a valid number';
    }
  }
];

module.exports = ADD_CHARACTER_QUESTIONS
