exports.list = ['Ghostbusters',
                'Die Hard',
                'Terminator 2',
                'Teenage Mutant Ninja Turtles',
                'Back to the Future',
                'Back to the Future Part II',
                'Event Horrizon',
                'Jumanji',
                'Batman Begins',
                'Aliens',
                'Labyrinth',
                'Groundhog Day',
                'Spirited Away',
                'The Truman Show',
                'Iron Giant',
                'Honey I Shrunk The Kids',
                'Stargate',
                '101 Dalmatians',
                'Shaun of the Dead',
                '28 Days Later',
                'Dunston Checks In',
                'The Life Aquatic',
                'Flubber',
                'Fargo',
                'Stand By Me',
                'Mulan',
                'Total Recall',
                'Home Alone 2: Lost in New York',
                'Contact',
                'Toy Story',
                'Fight Club',
                'Silence of the Lambs',
                'Pee-wee\'s Big Adventure',
                'The Fifth Element',
                'Point Break',
                'Weekend at Bernie\'s',
                'Ferris Bueller\'s Day Off',
                'Pacific Rim',
                'Beverly Hills Cop',
                'WarGames',
                'Top Gun',
                'Hackers',
                'Inception',
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
                'The Lion King',
                'Grown Ups 2'
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
