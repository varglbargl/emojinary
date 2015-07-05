exports.list = ['Ghostbusters',
                'Die Hard',
                'Terminator 2',
                'Teenage Mutant Ninja Turtles',
                'Back to the Future',
                'Batman Begins',
                'Aliens',
                'Labyrinth',
                'Groundhog Day',
                'Spirited Away',
                'The Truman Show',
                'Iron Giant',
                'Home Alone 2: Lost in New York',
                'Contact',
                'Toy Story',
                'Fight Club',
                'Point Break',
                'Jurassic Park',
                'Pulp Fiction',
                'The Matrix',
                'Independence Day',
                'The Breakfast Club',
                'Monsters Inc.',
                'Finding Nemo',
                'Indiana Jones and the Raiders of the Lost Ark',
                'The Princess Bride',
                'The Karate Kid',
                'Beetlejuice',
                'Gremlins',
                'Who Framed Roger Rabbit',
                'The Thing',
                'RoboCop',
                'The Shining',
                'Clerks',
                'Jaws',
                'A Clockwork Orange',
                'Blazing Saddles',
                'Willy Wonka and the Chocolate Factory',
                '2001: A Space Odyssey',
                'Super Mario Bros: The Movie',
                'Hook',
                'Cool Runnings',
                'Blues Brothers',
                'Seven Samurai',
                'The Social Network',
                'Gravity',
                'Planet of the Apes',
                'Star Wars: The Empire Strikes Back',
                'Lord of the Rings: The Fellowship of the Ring',
                'Snow White and the Seven Dwarfs',
                'The Lion King'
              ];

exports.randomMovie = function () {
  return exports.list[Math.floor(Math.random()*exports.list.length)];
};

exports.getThree = function () {
  var swapElements = function (n) {
    var temp = exports.list[n];
    var randomIndex = Math.floor(Math.random()*(exports.list.length - 3) + 3);
    exports.list[n] = exports.list[randomIndex];
    exports.list[randomIndex] = temp;
  };

  swapElements(0);
  swapElements(1);
  swapElements(2);

  return exports.list.slice(0, 3);
};
