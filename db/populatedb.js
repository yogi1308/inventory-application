#! /usr/bin/env node

const {Client} = require("pg")
const books = `
DROP TABLE IF EXISTS book_genres;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255),
    author VARCHAR(255),
    length INTEGER,
    length_type VARCHAR(50),
    cover TEXT,
    synopsis TEXT,
    rating NUMERIC(3, 1),
    copies INTEGER,
    series VARCHAR(255),
    volumes INTEGER
);
`
const insert_books = `
  INSERT INTO books (title, author, length, length_type, cover, synopsis, rating, copies, series, volumes)
  VALUES
    (
        'Vagabond',
        'Takehiko Inoue',
        327,
        'Chapters',
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421577449/vagabond-vol-37-9781421577449_hr.jpg',
        'Vagabond is a Japanese manga series written and illustrated by Takehiko Inoue. It portrays a fictionalized account of the life of Japanese swordsman Musashi Miyamoto, based on Eiji Yoshikawa''s novel Musashi. The story delves into Musashi''s journey from a brash young man to a legendary swordsman, exploring themes of self-discovery, the pursuit of greatness, and the philosophical aspects of martial arts. It has been serialized in Weekly Morning magazine since 1998, with the chapters collected into 37 tankōbon volumes by Kodansha as of September 2020.',
        10.0,
        50,
        'Vagabond',
        37
    ),
    (
        'The Slam Dunk',
        'Takehiko Inoue',
        276,
        'Chapters',
        'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781421533285_9781421533285_hr.jpg',
        'Slam Dunk is a Japanese manga series written and illustrated by Takehiko Inoue about a basketball team from Shōhoku High School in the Shōnan area. The story follows Hanamichi Sakuragi, a delinquent and basketball novice, as he joins the school''s basketball team to impress a girl he likes. Through hard work, determination, and the guidance of his teammates and coach, Hanamichi grows as a player and person, learning valuable life lessons along the way. It was serialized in Shueisha''s Weekly Shōnen Jump from October 1990 to June 1996, with the chapters collected into 31 tankōbon volumes.',
        9.0,
        40,
        'Slam Dunk',
        31
    ),
    (
        'Berserk',
        'Kentaro Miura',
        364,
        'Chapters',
        'https://images.booksense.com/images/205/070/9781593070205.jpg',
        'Berserk is a Japanese manga series written and illustrated by Kentaro Miura. Set in a medieval Europe-inspired dark fantasy world, the story centers on the characters of Guts, a lone mercenary, and Griffith, the leader of a mercenary band called the Band of the Hawk. The series explores themes of camaraderie, ambition, and the struggle between good and evil, as Guts battles against both human and supernatural foes. Miura premiered a prototype of Berserk in 1988, and the series has since become renowned for its dark, mature themes and intricate artwork.',
        10.0,
        60,
        'Berserk',
        41
    ),
    (
        'One Piece',
        'Eiichiro Oda',
        1000,
        'Chapters',
        'https://comicvine.gamespot.com/a/uploads/scale_small/11161/111610434/8594314-9160985681-97840.jpg',
        'One Piece is a Japanese manga series written and illustrated by Eiichiro Oda. It follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit. With his pirate crew, Luffy explores the Grand Line in search of the world''s ultimate treasure known as "One Piece" in order to become the next Pirate King. The series is known for its imaginative world-building, diverse cast of characters, and themes of friendship, freedom, and the pursuit of dreams.',
        10.0,
        80,
        'One Piece',
        103
    ),
    (
        'Steel Ball Run',
        'Hirohiko Araki',
        95,
        'Chapters',
        'https://m.media-amazon.com/images/I/917WFqQD1mL._AC_UF1000,1000_QL80_.jpg',
        'Steel Ball Run is the seventh story arc of the Japanese manga series JoJo''s Bizarre Adventure, written and illustrated by Hirohiko Araki. Set in 1890, it stars Gyro Zeppeli, a disgraced former executioner, and Johnny Joestar, a former jockey who was shot and lost the use of his legs. The two participate in the Steel Ball Run, a cross-country horse race across America, in pursuit of the grand prize and personal redemption. The series blends historical fiction with supernatural elements, and explores themes of perseverance, friendship, and the human spirit.',
        9.0,
        30,
        'Jojo''s Bizarre Adventure',
        24
    ),
    (
        'Chainsaw Man',
        'Tatsuki Fujimoto',
        97,
        'Chapters',
        'https://images.booksense.com/images/785/722/9781974722785.jpg',
        'Chainsaw Man is a Japanese manga series written and illustrated by Tatsuki Fujimoto. The story follows Denji, a young man who merges with his pet devil Pochita to become the titular Chainsaw Man. As a devil hunter, Denji battles against various devils while navigating the complexities of human relationships and his own desires. The series is known for its dark humor, intense action scenes, and exploration of themes such as poverty, ambition, and the nature of humanity.',
        8.0,
        70,
        'Chainsaw Man',
        11
    ),
    (
        'Vinland Saga',
        'Makoto Yukimura',
        54,
        'Chapters',
        'https://m.media-amazon.com/images/I/91+Qs9DaFZL.jpg',
        'Vinland Saga is a Japanese historical manga series written and illustrated by Makoto Yukimura. The series is published by Kodansha, and was first serialized in the youth-targeted Weekly Shōnen Magazine before moving to the monthly manga magazine Afternoon, aimed at young adult readers. The story is set in 11th-century Europe and follows Thorfinn, a young Viking warrior, as he seeks revenge against the mercenary leader Askeladd, who killed his father. The series explores themes of revenge, redemption, and the harsh realities of Viking life.',
        9.0,
        45,
        'Vinland Saga',
        26
    ),
    (
        'The Alchemist',
        'Paulo Coelho',
        197,
        'Pages',
        'https://i.harperapps.com/hcuk/covers/9780007487943/x400.jpg?ph=harperreach_coming_soon.png',
        'The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller. An allegorical novel, The Alchemist follows a young Andalusian shepherd named Santiago in his journey to the pyramids of Egypt, after having a recurring dream of finding a treasure there. Along the way, he meets various characters who guide him and teach him about the importance of following one''s dreams, listening to one''s heart, and recognizing the omens scattered along life''s path.',
        8.0,
        100,
        NULL,
        NULL
    ),
    (
        'The Hobbit',
        'J.R.R. Tolkien',
        310,
        'Pages',
        'https://m.media-amazon.com/images/I/712cDO7d73L.jpg',
        'The Hobbit, or There and Back Again is a children''s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children''s literature. The story follows the journey of Bilbo Baggins, a hobbit who is reluctantly drawn into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug.',
        0.0,
        120,
        'The Lord of the Rings',
        NULL
    ),
    (
        'The Great Gatsby',
        'F. Scott Fitzgerald',
        180,
        'Pages',
        'https://m.media-amazon.com/images/I/61OTNorhqVS._AC_UF894,1000_QL80_.jpg',
        'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway''s interactions with mysterious millionaire Jay Gatsby and Gatsby''s obsession to reunite with his former lover, Daisy Buchanan. The novel explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.',
        8.0,
        90,
        NULL,
        NULL
    ),
    (
        'The Hunger Games',
        'Suzanne Collins',
        374,
        'Pages',
        'https://m.media-amazon.com/images/I/71un2hI4mcL.jpg',
        'The Hunger Games is a 2008 dystopian novel by the American writer Suzanne Collins. It is written in the voice of 16-year-old Katniss Everdeen, who lives in the future, post-apocalyptic nation of Panem in North America. The Capitol, a highly advanced metropolis, exercises political control over the rest of the nation. The story follows Katniss as she volunteers to take her sister''s place in the Hunger Games, a televised event in which children fight to the death. The novel explores themes of survival, government control, and the effects of violence on society.',
        9.0,
        110,
        'The Hunger Games',
        3
    ),
    (
        'The Lord of the Rings',
        'J.R.R. Tolkien',
        1178,
        'Pages',
        'https://s26162.pcdn.co/wp-content/uploads/2017/05/the-lord-of-the-rings-book-cover.jpg',
        'The Lord of the Rings is an epic high-fantasy novel by the English author and scholar J. R. R. Tolkien. Set in Middle-earth, the world at some distant time in the past, the story began as a sequel to Tolkien''s 1937 children''s book The Hobbit, but eventually developed into a much larger work. The novel is divided into three volumes: The Fellowship of the Ring, The Two Towers, and The Return of the King. It follows the quest to destroy the One Ring, which was created by the Dark Lord Sauron, and the journey of the hobbit Frodo Baggins and his companions.',
        9.0,
        130,
        'The Lord of the Rings',
        3
    ),
    (
        'The Silmarillion',
        'J.R.R. Tolkien',
        365,
        'Pages',
        'https://m.media-amazon.com/images/I/71Gt0U59D3L._AC_UF894,1000_QL80_.jpg',
        'The Silmarillion is a collection of mythopoeic works by English writer J. R. R. Tolkien, edited and published posthumously by his son, Christopher Tolkien, in 1977, with assistance from Guy Gavriel Kay. It is the primary and essential source material for Tolkien''s Middle-earth legendarium. The book includes several works, the most prominent of which is the "Quenta Silmarillion," which tells the history of the First Age of Middle-earth, including the creation of the world, the rise and fall of the great Elven kingdoms, and the wars against the dark lord Morgoth.',
        8.0,
        80,
        'The Lord of the Rings',
        NULL
    ),
    (
        'The Two Towers',
        'J.R.R. Tolkien',
        322,
        'Pages',
        'https://m.media-amazon.com/images/I/71nNxfSvGnL._UF1000,1000_QL80_.jpg',
        'The Two Towers is the second volume of J.R.R. Tolkien''s high fantasy novel The Lord of the Rings. It is preceded by The Fellowship of the Ring and followed by The Return of the King. The story continues the quest to destroy the One Ring, following the separate journeys of the members of the Fellowship after they are scattered. The volume is divided into two books: Book Three, which focuses on the adventures of Aragorn, Legolas, Gimli, Merry, and Pippin, and Book Four, which follows Frodo and Sam as they make their way to Mordor.',
        9.0,
        90,
        'The Lord of the Rings',
        NULL
    ),
    (
        'The Fellowship of the Ring',
        'J.R.R. Tolkien',
        398,
        'Pages',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoX5QopXUKl6j79ro89axxAkcC253ryvX7Gg&shttps://ic.pics.livejournal.com/tree_lady/14285127/10506/10506_600.jpg',
        'The Fellowship of the Ring is the first of three volumes of the epic novel The Lord of the Rings by the English author J. R. R. Tolkien. It is followed by The Two Towers and The Return of the King. The story begins in the Shire, where the hobbit Frodo Baggins inherits the One Ring from his uncle Bilbo. Frodo sets out on a journey to destroy the Ring, accompanied by his friends Sam, Merry, and Pippin, and later joined by Aragorn, Legolas, Gimli, Boromir, and Gandalf. Together, they form the Fellowship of the Ring, united in their quest to save Middle-earth.',
        9.0,
        100,
        'The Lord of the Rings',
        NULL
    ),
    (
        'The Return of the King',
        'J.R.R. Tolkien',
        416,
        'Pages',
        'https://m.media-amazon.com/images/I/71tDovoHA+L._UF1000,1000_QL80_.jpg',
        'The Return of the King is the third and final volume of J.R.R. Tolkien''s high fantasy novel The Lord of the Rings. It is preceded by The Two Towers and The Fellowship of the Ring. The story concludes the quest to destroy the One Ring and defeat the Dark Lord Sauron, as the members of the Fellowship face their greatest challenges and sacrifices. The volume is divided into two books: Book Five, which follows the battles and events in Gondor and Rohan, and Book Six, which focuses on Frodo and Sam''s journey to Mount Doom.',
        9.0,
        100,
        'The Lord of the Rings',
        NULL
    ),
    (
        'Can''t Hurt Me',
        'David Goggins',
        364,
        'Pages',
        'https://m.media-amazon.com/images/I/81gTRv2HXrL.jpg',
        'Can''t Hurt Me is a memoir by David Goggins that recounts his journey from hardship and adversity to becoming an ultramarathon runner, endurance athlete, and motivational speaker.',
        10.0,
        50,
        NULL,
        NULL
    ),
    (
        'No Longer Human',
        'Osamu Dazai',
        176,
        'Pages',
        'https://i.ebayimg.com/images/g/gVwAAOSwEdFhB0ph/s-l1200.jpg',
        'No Longer Human is a Japanese novel that delves into themes of alienation and despair, narrated through the life of a deeply troubled man.',
        8.0,
        60,
        NULL,
        NULL
    ),
    (
        '20th Century Boys',
        'Naoki Urasawa',
        249,
        'Chapters',
        'https://m.media-amazon.com/images/I/91E+lJPR4SL._AC_UF1000,1000_QL80_.jpg',
        '20th Century Boys is a manga series about a group of friends who must confront a mysterious cult and prevent a global catastrophe.',
        9.0,
        70,
        '20th Century Boys',
        22
    ),
    (
        'Haikyu!!',
        'Haruichi Furudate',
        250,
        'Chapters',
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974710720/haikyu-vol-36-9781974710720.jpg',
        'Haikyu!! is a sports manga series about Shoyo Hinata, a young volleyball player determined to become a champion despite his height.',
        9.0,
        45,
        'Haikyu!!',
        45
    ),
    (
        'Oyasumi Punpun',
        'Inio Asano',
        455,
        'Chapters',
        'https://prodimage.images-bn.com/pimages/9781421586229_p0_v3_s600x595.jpg',
        'Oyasumi Punpun is a coming-of-age manga that explores the complexities of adolescence, relationships, and emotional struggles.',
        8.0,
        35,
        'Oyasumi Punpun',
        13
    ),
    (
        'Great Teacher Onizuka',
        'Tooru Fujisawa',
        310,
        'Chapters',
        'https://m.media-amazon.com/images/I/312aFyMub6L._AC_UF1000,1000_QL80_.jpg',
        'Great Teacher Onizuka is a manga series about Eikichi Onizuka, a former gang member who becomes an unorthodox yet inspiring high school teacher.',
        10.0,
        55,
        'Great Teacher Onizuka',
        25
    ),
    (
        'Naruto',
        'Masashi Kishimoto',
        700,
        'Chapters',
        'https://pictures.abebooks.com/isbn/9781421528434-us.jpg',
        'Naruto is a popular manga series that follows the journey of Naruto Uzumaki, a young ninja striving to become the leader of his village.',
        9.0,
        90,
        'Naruto',
        72
    ),
    (
        'Tokyo Ghoul',
        'Sui Ishida',
        320,
        'Chapters',
        'https://i.redd.it/n29vodhkuhe81.jpg',
        'Tokyo Ghoul is a dark fantasy manga series about Ken Kaneki, a college student who becomes a half-ghoul after a chance encounter.',
        7.0,
        65,
        'Tokyo Ghoul',
        14
    ),
    (
        'Tokyo Ghoul:re',
        'Sui Ishida',
        300,
        'Chapters',
        'https://www.lowplexbooks.com/cdn/shop/products/9646_4_800x.jpg?v=1590448106https://m.media-amazon.com/images/I/81L5P9ecOsL._UF1000,1000_QL80_.jpg',
        'Tokyo Ghoul:re is the sequel to Tokyo Ghoul, following Kaneki''s journey as he battles inner conflicts and external threats.',
        8.0,
        55,
        'Tokyo Ghoul',
        16
    ),
    (
        'Hell''s Paradise',
        'Yuji Kaku',
        370,
        'Chapters',
        'https://m.media-amazon.com/images/I/91ua+OaEBKL._UF1000,1000_QL80_.jpg',
        'Hell''s Paradise is a manga series about Gabimaru, a ninja on death row, who seeks redemption and freedom through a perilous journey.',
        8.0,
        40,
        'Hell''s Paradise',
        13
    ),
    (
        'Dorohedoro',
        'Q Hayashida',
        320,
        'Chapters',
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421533636/dorohedoro-vol-1-9781421533636_hr.jpg',
        'Dorohedoro is a dark fantasy manga set in a post-apocalyptic world, combining gritty action with surreal humor.',
        9.0,
        30,
        'Dorohedoro',
        23
    ),
    (
        'Ikigai',
        'Héctor García, Francesc Miralles',
        208,
        'Pages',
        'https://www.apolloadvisor.com/content/images/2023/09/ikigai.png',
        'Ikigai explores the Japanese concept of finding one''s purpose in life to achieve fulfillment and happiness.',
        8.0,
        80,
        NULL,
        NULL
    ),
    (
        'The Book of Basketball',
        'Bill Simmons',
        752,
        'Pages',
        'https://i.ebayimg.com/images/g/fJUAAOSwJRJfkbZw/s-l1200.jpg',
        'The Book of Basketball is a comprehensive history and analysis of the sport, written by ESPN columnist Bill Simmons. The book covers the history of the NBA, the greatest players and teams, and the most memorable moments in basketball history.',
        9.0,
        20,
        NULL,
        NULL
    ),
    (
        'Michael Jordan: The Life',
        'Roland Lazenby',
        720,
        'Pages',
        'https://m.media-amazon.com/images/I/61J2vNv1mBL._AC_UF1000,1000_QL80_.jpg',
        'Michael Jordan: The Life is a biography of the legendary basketball player, written by Roland Lazenby. The book explores Jordan''s life, from his childhood in North Carolina to his rise to stardom in the NBA, and his impact on the sport and popular culture.',
        10.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Kaiju No. 8',
        'Naoya Matsumoto',
        192,
        'Chapters',
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974725984/kaiju-no-8-vol-1-9781974725984_hr.jpg',
        'Kaiju No. 8 is a manga series about a man named Kafka Hibino who works for the Japan Defense Force, cleaning up the aftermath of kaiju attacks. However, after being exposed to kaiju-related substances, he gains the ability to transform into a kaiju himself.',
        8.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Dandadan',
        'Yukinobu Tatsu',
        200,
        'Chapters',
        'https://m.media-amazon.com/images/I/81kHWcb7n4L._AC_UF894,1000_QL80_.jpg',
        'Dandadan is a manga series that combines horror, action, and comedy. It follows the story of a high school girl named Momo Ayase who encounters the supernatural world after meeting a boy who claims to be able to see ghosts.',
        8.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Blue Period',
        'Tsubasa Yamaguchi',
        248,
        'Chapters',
        'https://comicvine.gamespot.com/a/uploads/scale_small/11145/111450787/9174444-8373747544-97840.jpg',
        'Blue Period is a manga series that follows Yatora Yaguchi, a high school student who discovers a passion for art and decides to pursue it as a career, despite the challenges and obstacles he faces along the way.',
        9.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Assassination Classroom',
        'Yusei Matsui',
        192,
        'Chapters',
        'https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/6363964-21.jpg',
        'Assassination Classroom is a manga series about a class of misfit students who are tasked with assassinating their alien teacher, Koro-sensei, who has vowed to destroy the Earth within a year unless they succeed.',
        6.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Harry Potter and the Philosopher''s Stone',
        'J.K. Rowling',
        223,
        'Pages',
        'https://pictures.abebooks.com/isbn/9780320081064-us.jpg',
        'Harry Potter and the Philosopher''s Stone is the first book in the Harry Potter series, following the young wizard Harry Potter as he discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.',
        9.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Sakamoto Days',
        'Yuto Suzuki',
        192,
        'Pages',
        'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974749782/sakamoto-days-vol-14-9781974749782_hr.jpg',
        'Sakamoto Days is a manga series about Taro Sakamoto, a retired hitman who now runs a convenience store. Despite leaving his dangerous past behind, he finds himself drawn back into the world of crime to protect his loved ones.',
        8.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'The Invisible Man',
        'H.G. Wells',
        208,
        'Pages',
        'https://images.penguinrandomhouse.com/cover/9780451531674',
        'The Invisible Man is a science fiction novel by H.G. Wells about a scientist named Griffin who discovers the secret to invisibility, but struggles with the consequences of his newfound power.',
        7.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'To Kill a Mockingbird',
        'Harper Lee',
        281,
        'Pages',
        'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
        'To Kill a Mockingbird is a novel by Harper Lee that explores themes of racial injustice, morality, and empathy in the American South during the 1930s, through the perspective of a young girl named Scout Finch.',
        9.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'Life of Pi',
        'Yann Martel',
        319,
        'Pages',
        'https://m.media-amazon.com/images/I/91QaIM2JMRL._AC_UF894,1000_QL80_.jpg',
        'Life of Pi is a novel by Yann Martel that tells the story of a young boy named Pi Patel who survives a shipwreck and is stranded on a lifeboat with a Bengal tiger named Richard Parker.',
        8.0,
        NULL,
        NULL,
        NULL
    ),
    (
        'A Clockwork Orange',
        'Anthony Burgess',
        213,
        'Pages',
        'https://m.media-amazon.com/images/I/71Xnph99DyL._AC_UF894,1000_QL80_.jpg',
        'A Clockwork Orange is a dystopian novel by Anthony Burgess that explores themes of free will, violence, and the nature of humanity through the eyes of a young delinquent named Alex.',
        8.0,
        NULL,
        NULL,
        NULL
    );
`;

const genres = `
    CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL UNIQUE
    );
`

const insert_genres = `
    INSERT INTO genres (name)
    VALUES
        ('Action'),
        ('Adventure'),
        ('Historical'),
        ('Seinen'),
        ('Sports'),
        ('Comedy'),
        ('Shounen'),
        ('Dark Fantasy'),
        ('Fantasy'),
        ('Horror'),
        ('Supernatural'),
        ('Dystopian'),
        ('Young Adult'),
        ('Epic'),
        ('Mythology'),
        ('Childrens'),
        ('Classic'),
        ('Fiction'),
        ('Tragedy'),
        ('Autobiography'),
        ('Motivational'),
        ('Self-help'),
        ('Psychological'),
        ('Mystery'),
        ('Sci-Fi'),
        ('Coming-of-age'),
        ('Slice of Life'),
        ('School'),
        ('Biography'),
        ('Non-fiction'),
        ('Philosophical')
    ;
`

const book_genres = `
CREATE TABLE IF NOT EXISTS book_genres (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id),
    genre VARCHAR(20),
    title VARCHAR(50)
);
`

const insert_book_genres = `
INSERT INTO book_genres (book_id, genre_id, genre, title)
VALUES
    -- Vagabond
    (1, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Vagabond'),
    (1, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Vagabond'),
    (1, (SELECT id FROM genres WHERE name = 'Historical'), 'Historical', 'Vagabond'),
    (1, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Vagabond'),
    -- The Slam Dunk
    (2, (SELECT id FROM genres WHERE name = 'Sports'), 'Sports', 'The Slam Dunk'),
    (2, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'The Slam Dunk'),
    (2, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'The Slam Dunk'),
    -- Berserk
    (3, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Berserk'),
    (3, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Berserk'),
    (3, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Berserk'),
    (3, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Berserk'),
    -- One Piece
    (4, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'One Piece'),
    (4, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'One Piece'),
    (4, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'One Piece'),
    (4, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'One Piece'),
    -- Steel Ball Run
    (5, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Steel Ball Run'),
    (5, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Steel Ball Run'),
    (5, (SELECT id FROM genres WHERE name = 'Supernatural'), 'Supernatural', 'Steel Ball Run'),
    (5, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Steel Ball Run'),
    -- Chainsaw Man
    (6, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Chainsaw Man'),
    (6, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Chainsaw Man'),
    (6, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Chainsaw Man'),
    (6, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Chainsaw Man'),
    -- Vinland Saga
    (7, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Vinland Saga'),
    (7, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Vinland Saga'),
    (7, (SELECT id FROM genres WHERE name = 'Historical'), 'Historical', 'Vinland Saga'),
    (7, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Vinland Saga'),
    -- The Alchemist
    (8, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Alchemist'),
    (8, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Alchemist'),
    (8, (SELECT id FROM genres WHERE name = 'Philosophical'), 'Philosophical', 'The Alchemist'),
    -- The Hobbit
    (9, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Hobbit'),
    (9, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Hobbit'),
    (9, (SELECT id FROM genres WHERE name = 'Childrens'), 'Childrens', 'The Hobbit'),
    -- The Great Gatsby
    (10, (SELECT id FROM genres WHERE name = 'Classic'), 'Classic', 'The Great Gatsby'),
    (10, (SELECT id FROM genres WHERE name = 'Fiction'), 'Fiction', 'The Great Gatsby'),
    (10, (SELECT id FROM genres WHERE name = 'Tragedy'), 'Tragedy', 'The Great Gatsby'),
    -- The Hunger Games
    (11, (SELECT id FROM genres WHERE name = 'Dystopian'), 'Dystopian', 'The Hunger Games'),
    (11, (SELECT id FROM genres WHERE name = 'Young Adult'), 'Young Adult', 'The Hunger Games'),
    (11, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'The Hunger Games'),
    -- The Lord of the Rings
    (12, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Lord of the Rings'),
    (12, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Lord of the Rings'),
    (12, (SELECT id FROM genres WHERE name = 'Epic'), 'Epic', 'The Lord of the Rings'),
    -- The Silmarillion
    (13, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Silmarillion'),
    (13, (SELECT id FROM genres WHERE name = 'Mythology'), 'Mythology', 'The Silmarillion'),
    (13, (SELECT id FROM genres WHERE name = 'Epic'), 'Epic', 'The Silmarillion'),
    -- The Two Towers
    (14, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Two Towers'),
    (14, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Two Towers'),
    (14, (SELECT id FROM genres WHERE name = 'Epic'), 'Epic', 'The Two Towers'),
    -- The Fellowship of the Ring
    (15, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Fellowship of the Ring'),
    (15, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Fellowship of the Ring'),
    (15, (SELECT id FROM genres WHERE name = 'Epic'), 'Epic', 'The Fellowship of the Ring'),
    -- The Return of the King
    (16, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'The Return of the King'),
    (16, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'The Return of the King'),
    (16, (SELECT id FROM genres WHERE name = 'Epic'), 'Epic', 'The Return of the King'),
    -- Can''t Hurt Me
    (17, (SELECT id FROM genres WHERE name = 'Autobiography'), 'Autobiography', 'Can''t Hurt Me'),
    (17, (SELECT id FROM genres WHERE name = 'Motivational'), 'Motivational', 'Can''t Hurt Me'),
    (17, (SELECT id FROM genres WHERE name = 'Self-help'), 'Self-help', 'Can''t Hurt Me'),
    -- No Longer Human
    (18, (SELECT id FROM genres WHERE name = 'Classic'), 'Classic', 'No Longer Human'),
    (18, (SELECT id FROM genres WHERE name = 'Fiction'), 'Fiction', 'No Longer Human'),
    (18, (SELECT id FROM genres WHERE name = 'Psychological'), 'Psychological', 'No Longer Human'),
    -- 20th Century Boys
    (19, (SELECT id FROM genres WHERE name = 'Mystery'), 'Mystery', '20th Century Boys'),
    (19, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', '20th Century Boys'),
    (19, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', '20th Century Boys'),
    -- Haikyu!!
    (20, (SELECT id FROM genres WHERE name = 'Sports'), 'Sports', 'Haikyu!!'),
    (20, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'Haikyu!!'),
    (20, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Haikyu!!'),
    -- Oyasumi Punpun
    (21, (SELECT id FROM genres WHERE name = 'Coming-of-age'), 'Coming-of-age', 'Oyasumi Punpun'),
    (21, (SELECT id FROM genres WHERE name = 'Psychological'), 'Psychological', 'Oyasumi Punpun'),
    (21, (SELECT id FROM genres WHERE name = 'Slice of Life'), 'Slice of Life', 'Oyasumi Punpun'),
    (21, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Oyasumi Punpun'),
    -- Great Teacher Onizuka
    (22, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'Great Teacher Onizuka'),
    (22, (SELECT id FROM genres WHERE name = 'School'), 'School', 'Great Teacher Onizuka'),
    (22, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Great Teacher Onizuka'),
    -- Naruto
    (23, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Naruto'),
    (23, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Naruto'),
    (23, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'Naruto'),
    (23, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Naruto'),
    -- Tokyo Ghoul
    (24, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Tokyo Ghoul'),
    (24, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Tokyo Ghoul'),
    (24, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Tokyo Ghoul'),
    (24, (SELECT id FROM genres WHERE name = 'Supernatural'), 'Supernatural', 'Tokyo Ghoul'),
    (24, (SELECT id FROM genres WHERE name = 'Psychological'), 'Psychological', 'Tokyo Ghoul'),
    (24, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Tokyo Ghoul'),
    -- Tokyo Ghoul:re
    (25, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Tokyo Ghoul:re'),
    (25, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Tokyo Ghoul:re'),
    (25, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Tokyo Ghoul:re'),
    (25, (SELECT id FROM genres WHERE name = 'Supernatural'), 'Supernatural', 'Tokyo Ghoul:re'),
    (25, (SELECT id FROM genres WHERE name = 'Psychological'), 'Psychological', 'Tokyo Ghoul:re'),
    (25, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Tokyo Ghoul:re'),
    -- Hell's Paradise
    (26, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Hell''s Paradise'),
    (26, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Hell''s Paradise'),
    (26, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Hell''s Paradise'),
    (26, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Hell''s Paradise'),
    -- Dorohedoro
    (27, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Dorohedoro'),
    (27, (SELECT id FROM genres WHERE name = 'Dark Fantasy'), 'Dark Fantasy', 'Dorohedoro'),
    (27, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Dorohedoro'),
    (27, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'Dorohedoro'),
    (27, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Dorohedoro'),
    -- Ikigai
    (28, (SELECT id FROM genres WHERE name = 'Self-help'), 'Self-help', 'Ikigai'),
    (28, (SELECT id FROM genres WHERE name = 'Non-fiction'), 'Non-fiction', 'Ikigai'),
    (28, (SELECT id FROM genres WHERE name = 'Philosophical'), 'Philosophical', 'Ikigai'),
    -- The Book of Basketball
    (29, (SELECT id FROM genres WHERE name = 'Sports'), 'Sports', 'The Book of Basketball'),
    (29, (SELECT id FROM genres WHERE name = 'Non-fiction'), 'Non-fiction', 'The Book of Basketball'),
    (30, (SELECT id FROM genres WHERE name = 'Sports'), 'Sports', 'Michael Jordan: The Life'),
    (30, (SELECT id FROM genres WHERE name = 'Non-fiction'), 'Non-fiction', 'Michael Jordan: The Life'),
    -- Kaiju No. 8
    (31, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Kaiju No. 8'),
    (31, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'Kaiju No. 8'),
    (31, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Kaiju No. 8'),
    -- Dandadan
    (32, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Dandadan'),
    (32, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'Dandadan'),
    (32, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'Dandadan'),
    (32, (SELECT id FROM genres WHERE name = 'Supernatural'), 'Supernatural', 'Dandadan'),
    (32, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Dandadan'),
    -- Blue Period
    (33, (SELECT id FROM genres WHERE name = 'Coming-of-age'), 'Coming-of-age', 'Blue Period'),
    (33, (SELECT id FROM genres WHERE name = 'Slice of Life'), 'Slice of Life', 'Blue Period'),
    (33, (SELECT id FROM genres WHERE name = 'Seinen'), 'Seinen', 'Blue Period'),
    -- Assassination Classroom
    (34, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Assassination Classroom'),
    (34, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'Assassination Classroom'),
    (34, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'Assassination Classroom'),
    (34, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Assassination Classroom'),
    -- Harry Potter and the Philosopher's Stone
    (35, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'Harry Potter and the Philosopher''s Stone'),
    (35, (SELECT id FROM genres WHERE name = 'Young Adult'), 'Young Adult', 'Harry Potter and the Philosopher''s Stone'),
    (35, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Harry Potter and the Philosopher''s Stone'),
    -- Sakamoto Days
    (36, (SELECT id FROM genres WHERE name = 'Action'), 'Action', 'Sakamoto Days'),
    (36, (SELECT id FROM genres WHERE name = 'Comedy'), 'Comedy', 'Sakamoto Days'),
    (36, (SELECT id FROM genres WHERE name = 'Shounen'), 'Shounen', 'Sakamoto Days'),
    -- The Invisible Man
    (37, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'The Invisible Man'),
    (37, (SELECT id FROM genres WHERE name = 'Classic'), 'Classic', 'The Invisible Man'),
    (37, (SELECT id FROM genres WHERE name = 'Horror'), 'Horror', 'The Invisible Man'),
    -- To Kill a Mockingbird
    (38, (SELECT id FROM genres WHERE name = 'Classic'), 'Classic', 'To Kill a Mockingbird'),
    (38, (SELECT id FROM genres WHERE name = 'Fiction'), 'Fiction', 'To Kill a Mockingbird'),
    (38, (SELECT id FROM genres WHERE name = 'Historical'), 'Historical', 'To Kill a Mockingbird'),
    -- Life of Pi
    (39, (SELECT id FROM genres WHERE name = 'Adventure'), 'Adventure', 'Life of Pi'),
    (39, (SELECT id FROM genres WHERE name = 'Fantasy'), 'Fantasy', 'Life of Pi'),
    (39, (SELECT id FROM genres WHERE name = 'Philosophical'), 'Philosophical', 'Life of Pi'),
    -- A Clockwork Orange
    (40, (SELECT id FROM genres WHERE name = 'Dystopian'), 'Dystopian', 'A Clockwork Orange'),
    (40, (SELECT id FROM genres WHERE name = 'Sci-Fi'), 'Sci-Fi', 'A Clockwork Orange'),
    (40, (SELECT id FROM genres WHERE name = 'Classic'), 'Classic', 'A Clockwork Orange');
`

async function main() {
  console.log("seeding...");
  try {
    const client = new Client({
        connectionString: "postgresql://yogi:Yogi@psql123@localhost:5432/books_inventory",
    });
    await client.connect();

    await client.query(books);
    await client.query(genres);
    
    await client.query(insert_books);
    await client.query(insert_genres);

    await client.query(book_genres);
    await client.query(insert_book_genres);

    await client.end();
    console.log("done"); 
  }
  
  catch (error) {
    console.log("failed loading the database", error); 
  }
}

main();

// class Book {
//   constructor (title, author, length, lengthType, cover, synopsis, rating, genres, copies, series, volumes) {
//     this.title = title
//     this.author = author
//     this.length = length
//     this.lengthType = lengthType
//     this.cover = cover
//     this.synopsis = synopsis
//     this.rating = rating
//     this.genres = genres
//     this.copies = copies
//     this.series = series
//     this.volumes = volumes
//   }
// }

// Vagabond = new Book('Vagabond', 'Takehiko Inoue', 327, 'Chapters', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421577449/vagabond-vol-37-9781421577449_hr.jpg', 'Vagabond is a Japanese manga series written and illustrated by Takehiko Inoue. It portrays a fictionalized account of the life of Japanese swordsman Musashi Miyamoto, based on Eiji Yoshikawa\'s novel Musashi. The story delves into Musashi\'s journey from a brash young man to a legendary swordsman, exploring themes of self-discovery, the pursuit of greatness, and the philosophical aspects of martial arts. It has been serialized in Weekly Morning magazine since 1998, with the chapters collected into 37 tankōbon volumes by Kodansha as of September 2020.', 10, ['Action', 'Adventure', 'Historical', 'Seinen'], 50, 'Vagabond', 37);
// TheSlamDunk = new Book('The Slam Dunk', 'Takehiko Inoue', 276, 'Chapters', 'https://d28hgpri8am2if.cloudfront.net/book_images/cvr9781421533285_9781421533285_hr.jpg', 'Slam Dunk is a Japanese manga series written and illustrated by Takehiko Inoue about a basketball team from Shōhoku High School in the Shōnan area. The story follows Hanamichi Sakuragi, a delinquent and basketball novice, as he joins the school\'s basketball team to impress a girl he likes. Through hard work, determination, and the guidance of his teammates and coach, Hanamichi grows as a player and person, learning valuable life lessons along the way. It was serialized in Shueisha\'s Weekly Shōnen Jump from October 1990 to June 1996, with the chapters collected into 31 tankōbon volumes.', 9, ['Sports', 'Comedy', 'Shounen'], 40, 'Slam Dunk', 31);
// Berserk = new Book('Berserk', 'Kentaro Miura', 364, 'Chapters', 'https://images.booksense.com/images/205/070/9781593070205.jpg', 'Berserk is a Japanese manga series written and illustrated by Kentaro Miura. Set in a medieval Europe-inspired dark fantasy world, the story centers on the characters of Guts, a lone mercenary, and Griffith, the leader of a mercenary band called the Band of the Hawk. The series explores themes of camaraderie, ambition, and the struggle between good and evil, as Guts battles against both human and supernatural foes. Miura premiered a prototype of Berserk in 1988, and the series has since become renowned for its dark, mature themes and intricate artwork.', 10, ['Action', 'Dark Fantasy', 'Horror', 'Seinen'], 60, 'Berserk', 41);
// OnePiece = new Book('One Piece', 'Eiichiro Oda', 1000, 'Chapters', 'https://comicvine.gamespot.com/a/uploads/scale_small/11161/111610434/8594314-9160985681-97840.jpg', 'One Piece is a Japanese manga series written and illustrated by Eiichiro Oda. It follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit. With his pirate crew, Luffy explores the Grand Line in search of the world\'s ultimate treasure known as "One Piece" in order to become the next Pirate King. The series is known for its imaginative world-building, diverse cast of characters, and themes of friendship, freedom, and the pursuit of dreams.', 10, ['Action', 'Adventure', 'Fantasy', 'Shounen'], 80, 'One Piece', 103);
// SteelBallRun = new Book('Steel Ball Run', 'Hirohiko Araki', 95, 'Chapters', 'https://m.media-amazon.com/images/I/917WFqQD1mL._AC_UF1000,1000_QL80_.jpg', 'Steel Ball Run is the seventh story arc of the Japanese manga series JoJo\'s Bizarre Adventure, written and illustrated by Hirohiko Araki. Set in 1890, it stars Gyro Zeppeli, a disgraced former executioner, and Johnny Joestar, a former jockey who was shot and lost the use of his legs. The two participate in the Steel Ball Run, a cross-country horse race across America, in pursuit of the grand prize and personal redemption. The series blends historical fiction with supernatural elements, and explores themes of perseverance, friendship, and the human spirit.', 9, ['Action', 'Adventure', 'Supernatural', 'Seinen'], 30, 'Jojo\'s Bizarre Adventure', 24);
// ChainsawMan = new Book('Chainsaw Man', 'Tatsuki Fujimoto', 97, 'Chapters', 'https://images.booksense.com/images/785/722/9781974722785.jpg', 'Chainsaw Man is a Japanese manga series written and illustrated by Tatsuki Fujimoto. The story follows Denji, a young man who merges with his pet devil Pochita to become the titular Chainsaw Man. As a devil hunter, Denji battles against various devils while navigating the complexities of human relationships and his own desires. The series is known for its dark humor, intense action scenes, and exploration of themes such as poverty, ambition, and the nature of humanity.', 8, ['Action', 'Dark Fantasy', 'Horror', 'Shounen'], 70, 'Chainsaw Man', 11);
// VinLandSaga = new Book('Vinland Saga', 'Makoto Yukimura', 54, 'Chapters', 'https://m.media-amazon.com/images/I/91+Qs9DaFZL.jpg', 'Vinland Saga is a Japanese historical manga series written and illustrated by Makoto Yukimura. The series is published by Kodansha, and was first serialized in the youth-targeted Weekly Shōnen Magazine before moving to the monthly manga magazine Afternoon, aimed at young adult readers. The story is set in 11th-century Europe and follows Thorfinn, a young Viking warrior, as he seeks revenge against the mercenary leader Askeladd, who killed his father. The series explores themes of revenge, redemption, and the harsh realities of Viking life.', 9, ['Action', 'Adventure', 'Historical', 'Seinen'], 45, 'Vinland Saga', 26);
// TheAlchemist = new Book('The Alchemist', 'Paulo Coelho', 197, 'Pages', 'https://i.harperapps.com/hcuk/covers/9780007487943/x400.jpg?ph=harperreach_coming_soon.png', 'The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller. An allegorical novel, The Alchemist follows a young Andalusian shepherd named Santiago in his journey to the pyramids of Egypt, after having a recurring dream of finding a treasure there. Along the way, he meets various characters who guide him and teach him about the importance of following one\'s dreams, listening to one\'s heart, and recognizing the omens scattered along life\'s path.', 8, ['Adventure', 'Fantasy', 'Philosophical'], 100, null, null);
// TheHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 310, 'Pages', 'https://m.media-amazon.com/images/I/712cDO7d73L.jpg' , 'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction. The book remains popular and is recognized as a classic in children\'s literature. The story follows the journey of Bilbo Baggins, a hobbit who is reluctantly drawn into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug.', 0, ['Fantasy', 'Adventure', 'Childrens'], 120, 'The Lord of the Rings', null);
// TheGreatGatsby = new Book('The Great Gatsby', 'F. Scott Fitzgerald', 180, 'Pages', 'https://m.media-amazon.com/images/I/61OTNorhqVS._AC_UF894,1000_QL80_.jpg', 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan. The novel explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.', 8, ['Classic', 'Fiction', 'Tragedy'], 90, null, null);
// TheHungerGames = new Book('The Hunger Games', 'Suzanne Collins', 374, 'Pages', 'https://m.media-amazon.com/images/I/71un2hI4mcL.jpg', 'The Hunger Games is a 2008 dystopian novel by the American writer Suzanne Collins. It is written in the voice of 16-year-old Katniss Everdeen, who lives in the future, post-apocalyptic nation of Panem in North America. The Capitol, a highly advanced metropolis, exercises political control over the rest of the nation. The story follows Katniss as she volunteers to take her sister\'s place in the Hunger Games, a televised event in which children fight to the death. The novel explores themes of survival, government control, and the effects of violence on society.', 9, ['Dystopian', 'Young Adult', 'Sci-Fi'], 110, 'The Hunger Games', 3);
// TheLordOfTheRings = new Book('The Lord of the Rings', 'J.R.R. Tolkien', 1178, 'Pages', 'https://s26162.pcdn.co/wp-content/uploads/2017/05/the-lord-of-the-rings-book-cover.jpg', 'The Lord of the Rings is an epic high-fantasy novel by the English author and scholar J. R. R. Tolkien. Set in Middle-earth, the world at some distant time in the past, the story began as a sequel to Tolkien\'s 1937 children\'s book The Hobbit, but eventually developed into a much larger work. The novel is divided into three volumes: The Fellowship of the Ring, The Two Towers, and The Return of the King. It follows the quest to destroy the One Ring, which was created by the Dark Lord Sauron, and the journey of the hobbit Frodo Baggins and his companions.', 9, ['Fantasy', 'Adventure', 'Epic'], 130, 'The Lord of the Rings', 3);
// TheSilmarillion = new Book('The Silmarillion', 'J.R.R. Tolkien', 365, 'Pages', 'https://m.media-amazon.com/images/I/71Gt0U59D3L._AC_UF894,1000_QL80_.jpg', 'The Silmarillion is a collection of mythopoeic works by English writer J. R. R. Tolkien, edited and published posthumously by his son, Christopher Tolkien, in 1977, with assistance from Guy Gavriel Kay. It is the primary and essential source material for Tolkien\'s Middle-earth legendarium. The book includes several works, the most prominent of which is the "Quenta Silmarillion," which tells the history of the First Age of Middle-earth, including the creation of the world, the rise and fall of the great Elven kingdoms, and the wars against the dark lord Morgoth.', 8, ['Fantasy', 'Mythology', 'Epic'], 80, 'The Lord of the Rings', null);
// TheTwoTowers = new Book('The Two Towers', 'J.R.R. Tolkien', 322, 'Pages', 'https://m.media-amazon.com/images/I/71nNxfSvGnL._UF1000,1000_QL80_.jpg', 'The Two Towers is the second volume of J.R.R. Tolkien\'s high fantasy novel The Lord of the Rings. It is preceded by The Fellowship of the Ring and followed by The Return of the King. The story continues the quest to destroy the One Ring, following the separate journeys of the members of the Fellowship after they are scattered. The volume is divided into two books: Book Three, which focuses on the adventures of Aragorn, Legolas, Gimli, Merry, and Pippin, and Book Four, which follows Frodo and Sam as they make their way to Mordor.', 9, ['Fantasy', 'Adventure', 'Epic'], 90, 'The Lord of the Rings', null)
// TheFellowshipOfTheRing = new Book('The Fellowship of the Ring', 'J.R.R. Tolkien', 398, 'Pages', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoX5QopXUKl6j79ro89axxAkcC253ryvX7Gg&shttps://ic.pics.livejournal.com/tree_lady/14285127/10506/10506_600.jpg', 'The Fellowship of the Ring is the first of three volumes of the epic novel The Lord of the Rings by the English author J. R. R. Tolkien. It is followed by The Two Towers and The Return of the King. The story begins in the Shire, where the hobbit Frodo Baggins inherits the One Ring from his uncle Bilbo. Frodo sets out on a journey to destroy the Ring, accompanied by his friends Sam, Merry, and Pippin, and later joined by Aragorn, Legolas, Gimli, Boromir, and Gandalf. Together, they form the Fellowship of the Ring, united in their quest to save Middle-earth.', 9, ['Fantasy', 'Adventure', 'Epic'], 100, 'The Lord of the Rings', null)
// TheReturnOfTheKing = new Book('The Return of the King', 'J.R.R. Tolkien', 416, 'Pages', 'https://m.media-amazon.com/images/I/71tDovoHA+L._UF1000,1000_QL80_.jpg', 'The Return of the King is the third and final volume of J.R.R. Tolkien\'s high fantasy novel The Lord of the Rings. It is preceded by The Two Towers and The Fellowship of the Ring. The story concludes the quest to destroy the One Ring and defeat the Dark Lord Sauron, as the members of the Fellowship face their greatest challenges and sacrifices. The volume is divided into two books: Book Five, which follows the battles and events in Gondor and Rohan, and Book Six, which focuses on Frodo and Sam\'s journey to Mount Doom.', 9, ['Fantasy', 'Adventure', 'Epic'], 100, 'The Lord of the Rings', null)

// CantHurtMe = new Book('Can\'t Hurt Me', 'David Goggins', 364, 'Pages', 'https://m.media-amazon.com/images/I/81gTRv2HXrL.jpg', 'Can\'t Hurt Me is a memoir by David Goggins that recounts his journey from hardship and adversity to becoming an ultramarathon runner, endurance athlete, and motivational speaker.', '10', ['Autobiography', 'Motivational', 'Self-help'], 50, null, null);
// NoLongerHuman = new Book('No Longer Human', 'Osamu Dazai', 176, 'Pages', 'https://i.ebayimg.com/images/g/gVwAAOSwEdFhB0ph/s-l1200.jpg', 'No Longer Human is a Japanese novel that delves into themes of alienation and despair, narrated through the life of a deeply troubled man.', '8', ['Classic', 'Fiction', 'Psychological'], 60, null, null);
// TwentiethCenturyBoys = new Book('20th Century Boys', 'Naoki Urasawa', 249, 'Chapters', 'https://m.media-amazon.com/images/I/91E+lJPR4SL._AC_UF1000,1000_QL80_.jpg', '20th Century Boys is a manga series about a group of friends who must confront a mysterious cult and prevent a global catastrophe.', '9', ['Mystery', 'Sci-Fi', 'Seinen'], 70, '20th Century Boys', 22);
// Haikyu = new Book('Haikyu!!', 'Haruichi Furudate', 250, 'Chapters', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974710720/haikyu-vol-36-9781974710720.jpg', 'Haikyu!! is a sports manga series about Shoyo Hinata, a young volleyball player determined to become a champion despite his height.', '9', ['Sports', 'Comedy', 'Shounen'], 45, 'Haikyu!!', 45);
// OyasumiPunpun = new Book('Oyasumi Punpun', 'Inio Asano', 455, 'Chapters', 'https://prodimage.images-bn.com/pimages/9781421586229_p0_v3_s600x595.jpg', 'Oyasumi Punpun is a coming-of-age manga that explores the complexities of adolescence, relationships, and emotional struggles.', '8', ['Coming-of-age', 'Psychological', 'Slice of Life', 'Seinen'], 35, 'Oyasumi Punpun', 13);

// GreatTeacherOnizuka = new Book('Great Teacher Onizuka', 'Tooru Fujisawa', 310, 'Chapters', 'https://m.media-amazon.com/images/I/312aFyMub6L._AC_UF1000,1000_QL80_.jpg', 'Great Teacher Onizuka is a manga series about Eikichi Onizuka, a former gang member who becomes an unorthodox yet inspiring high school teacher.', '10', ['Comedy', 'School', 'Shounen'], 55, 'Great Teacher Onizuka', 25);
// Naruto = new Book('Naruto', 'Masashi Kishimoto', 700, 'Chapters', 'https://pictures.abebooks.com/isbn/9781421528434-us.jpg', 'Naruto is a popular manga series that follows the journey of Naruto Uzumaki, a young ninja striving to become the leader of his village.', '9', ['Action', 'Adventure', 'Fantasy', 'Shounen'], 90, 'Naruto', 72);
// TokyoGhoul = new Book('Tokyo Ghoul', 'Sui Ishida', 320, 'Chapters', 'https://i.redd.it/n29vodhkuhe81.jpg', 'Tokyo Ghoul is a dark fantasy manga series about Ken Kaneki, a college student who becomes a half-ghoul after a chance encounter.', '7', ['Action', 'Dark Fantasy', 'Horror', 'Supernatural', 'Psychological', 'Seinen'], 65, 'Tokyo Ghoul', 14);
// TokyoGhoulRe = new Book('Tokyo Ghoul:re', 'Sui Ishida', 300, 'Chapters', 'https://www.lowplexbooks.com/cdn/shop/products/9646_4_800x.jpg?v=1590448106https://m.media-amazon.com/images/I/81L5P9ecOsL._UF1000,1000_QL80_.jpg', 'Tokyo Ghoul:re is the sequel to Tokyo Ghoul, following Kaneki\'s journey as he battles inner conflicts and external threats.', '8', ['Action', 'Dark Fantasy', 'Horror', 'Supernatural', 'Psychological', 'Seinen'], 55, 'Tokyo Ghoul', 16);
// HellsParadise = new Book('Hell\'s Paradise', 'Yuji Kaku', 370, 'Chapters', 'https://m.media-amazon.com/images/I/91ua+OaEBKL._UF1000,1000_QL80_.jpg', 'Hell\'s Paradise is a manga series about Gabimaru, a ninja on death row, who seeks redemption and freedom through a perilous journey.', 8, ['Action', 'Adventure', 'Dark Fantasy', 'Shounen'], 40, 'Hell\'s Paradise', 13);
// Dorohedoro = new Book('Dorohedoro', 'Q Hayashida', 320, 'Chapters', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421533636/dorohedoro-vol-1-9781421533636_hr.jpg', 'Dorohedoro is a dark fantasy manga set in a post-apocalyptic world, combining gritty action with surreal humor.', 9, ['Action', 'Dark Fantasy', 'Horror', 'Sci-Fi', 'Seinen'], 30, 'Dorohedoro', 23);
// Ikigai = new Book('Ikigai', 'Héctor García, Francesc Miralles', 208, 'Pages', 'https://www.apolloadvisor.com/content/images/2023/09/ikigai.png', 'Ikigai explores the Japanese concept of finding one\'s purpose in life to achieve fulfillment and happiness.', 8, ['Self-help', 'Non-fiction', 'Philosophical'], 80, null, null);
// BookOfBasketball = new Book('The Book of Basketball', 'Bill Simmons', 752, 'Pages', 'https://i.ebayimg.com/images/g/fJUAAOSwJRJfkbZw/s-l1200.jpg', 'The Book of Basketball is a comprehensive history and analysis of the sport, written by ESPN columnist Bill Simmons. The book covers the history of the NBA, the greatest players and teams, and the most memorable moments in basketball history.', '9', ['Sports', 'Non-fiction'], 20, null, null);
// MichaelJordanTheLife = new Book('Michael Jordan: The Life', 'Roland Lazenby', 720, 'Pages', 'https://m.media-amazon.com/images/I/61J2vNv1mBL._AC_UF1000,1000_QL80_.jpg', 'Michael Jordan: The Life is a biography of the legendary basketball player, written by Roland Lazenby. The book explores Jordan\'s life, from his childhood in North Carolina to his rise to stardom in the NBA, and his impact on the sport and popular culture.', '10', ['Biography', 'Sports', 'Non-fiction']);
// KaijuNo8 = new Book('Kaiju No. 8', 'Naoya Matsumoto', 192, 'Chapters', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974725984/kaiju-no-8-vol-1-9781974725984_hr.jpg', 'Kaiju No. 8 is a manga series about a man named Kafka Hibino who works for the Japan Defense Force, cleaning up the aftermath of kaiju attacks. However, after being exposed to kaiju-related substances, he gains the ability to transform into a kaiju himself.', 8, ['Action', 'Sci-Fi', 'Shounen']);
// Dandadan = new Book('Dandadan', 'Yukinobu Tatsu', 200, 'Chapters', 'https://m.media-amazon.com/images/I/81kHWcb7n4L._AC_UF894,1000_QL80_.jpg', 'Dandadan is a manga series that combines horror, action, and comedy. It follows the story of a high school girl named Momo Ayase who encounters the supernatural world after meeting a boy who claims to be able to see ghosts.', 8, ['Action', 'Comedy', 'Horror', 'Supernatural', 'Shounen']);
// BluePeriod = new Book('Blue Period', 'Tsubasa Yamaguchi', 248, 'Chapters', 'https://comicvine.gamespot.com/a/uploads/scale_small/11145/111450787/9174444-8373747544-97840.jpg', 'Blue Period is a manga series that follows Yatora Yaguchi, a high school student who discovers a passion for art and decides to pursue it as a career, despite the challenges and obstacles he faces along the way.', 9, ['Coming-of-age', 'Slice of Life', 'Seinen']);
// AssassinationClassroom = new Book('Assassination Classroom', 'Yusei Matsui', 192, 'Chapters', 'https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/6363964-21.jpg', 'Assassination Classroom is a manga series about a class of misfit students who are tasked with assassinating their alien teacher, Koro-sensei, who has vowed to destroy the Earth within a year unless they succeed.', '6', ['Action', 'Comedy', 'Sci-Fi', 'Shounen']);
// HarryPotterPhilosophersStone = new Book('Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 223, 'Pages', 'https://pictures.abebooks.com/isbn/9780320081064-us.jpg', 'Harry Potter and the Philosopher\'s Stone is the first book in the Harry Potter series, following the young wizard Harry Potter as he discovers his magical heritage and attends Hogwarts School of Witchcraft and Wizardry.', 9, ['Fantasy', 'Young Adult', 'Adventure']);
// SakamotoDays = new Book('Sakamoto Days', 'Yuto Suzuki', 192, 'Pages', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974749782/sakamoto-days-vol-14-9781974749782_hr.jpg', 'Sakamoto Days is a manga series about Taro Sakamoto, a retired hitman who now runs a convenience store. Despite leaving his dangerous past behind, he finds himself drawn back into the world of crime to protect his loved ones.', 8, ['Action', 'Comedy', 'Shounen']);
// TheInvisibleMan = new Book('The Invisible Man', 'H.G. Wells', 208, 'Pages', 'https://images.penguinrandomhouse.com/cover/9780451531674', 'The Invisible Man is a science fiction novel by H.G. Wells about a scientist named Griffin who discovers the secret to invisibility, but struggles with the consequences of his newfound power.', 7, ['Sci-Fi', 'Classic', 'Horror']);
// ToKillAMockingbird = new Book('To Kill a Mockingbird', 'Harper Lee', 281, 'Pages', 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg', 'To Kill a Mockingbird is a novel by Harper Lee that explores themes of racial injustice, morality, and empathy in the American South during the 1930s, through the perspective of a young girl named Scout Finch.', 9, ['Classic', 'Fiction', 'Historical']);
// LifeOfPi = new Book('Life of Pi', 'Yann Martel', 319, 'Pages', 'https://m.media-amazon.com/images/I/91QaIM2JMRL._AC_UF894,1000_QL80_.jpg', 'Life of Pi is a novel by Yann Martel that tells the story of a young boy named Pi Patel who survives a shipwreck and is stranded on a lifeboat with a Bengal tiger named Richard Parker.', 8, ['Adventure', 'Fantasy', 'Philosophical']);
// ClockworkOrange = new Book('A Clockwork Orange', 'Anthony Burgess', 213, 'Pages', 'https://m.media-amazon.com/images/I/71Xnph99DyL._AC_UF894,1000_QL80_.jpg', 'A Clockwork Orange is a dystopian novel by Anthony Burgess that explores themes of free will, violence, and the nature of humanity through the eyes of a young delinquent named Alex.', 8, ['Dystopian', 'Sci-Fi', 'Classic']);
// Dune = new Book('Dune', 'Frank Herbert', 412, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91JV0+3pZEL.jpg', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for... When House Atreides is betrayed, the destruction of Paul’s family will set the boy on a journey toward a destiny greater than he could ever have imagined. And as he evolves into the mysterious man known as Muad\'Dib, he will bring to fruition humankind’s most ancient and unattainable dream.', 9, ['Sci-Fi', 'Fantasy', 'Classic']);
// DuneMessiah = new Book('Dune Messiah', 'Frank Herbert', 256, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91O+q9+wQhL.jpg', 'Dune Messiah continues the story of Paul Atreides, better known—and feared—as the man christened Muad\'Dib. As Emperor of the known universe, he possesses more power than a single man was ever meant to wield. Worshipped as a religious icon by the fanatical Fremen, Paul faces the enmity of the political houses he displaced when he assumed the throne—and a conspiracy conducted from within his own sphere of influence. And even as House Atreides begins to crumble around him from the machinations of his enemies, the true threat to Paul comes to his lover, Chani, and the unborn heir to his family’s dynasty...', 8, ['Sci-Fi', 'Fantasy', 'Classic']);
// ChildrenOfDune = new Book('Children of Dune', 'Frank Herbert', 416, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91y+8+g4zFL.jpg', 'The desert planet of Arrakis has begun to grow green and lush. The life-giving spice is abundant. The nine-year-old royal twins, Leto and Ghanima Atreides, children of the Emperor Paul Muad\'Dib, possess their father’s supernormal gifts. But their royal Aunt Alia, who rules the Empire in their name, is succumbing to the evil of the Baron Harkonnen, and the spice-addicted Bene Gesserit are plotting to regain control of the Empire. The future of the Atreides dynasty is threatened, and it is up to the twins to save it.', 8, ['Sci-Fi', 'Fantasy', 'Classic']);
// GodEmperorOfDune = new Book('God Emperor of Dune', 'Frank Herbert', 432, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91+p+q5JmZL.jpg', 'Millennia have passed on Arrakis, and the once-desert planet is now a lush green world. Leto Atreides, the son of the world’s savior, the Emperor Paul Muad’Dib, is now a godlike creature, a hybrid of human and sandworm, who has ruled the universe as a tyrant for 3,500 years. His long reign has brought peace and stability to the galaxy, but at a terrible price. With a rebellion on the horizon, Leto must make a choice that will change the course of humanity forever.', 8, ['Sci-Fi', 'Fantasy', 'Classic']);
// HereticsOfDune = new Book('Heretics of Dune', 'Frank Herbert', 480, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91+p+q5JmZL.jpg', 'The planet Arrakis—now called Rakis—is becoming a desert again. The Lost Ones are returning from the far reaches of space in pursuit of power. And a girl named Sheeana, who can control the great sandworms, is the new messiah. From the remnants of the old Empire, the Bene Gesserit have come to Rakis to take control of the spice and the girl, and to restore their power over the galaxy.', 8, ['Sci-Fi', 'Fantasy', 'Classic']);
// ChapterhouseDune = new Book('Chapterhouse: Dune', 'Frank Herbert', 464, 'Pages', 'https://images-na.ssl-images-amazon.com/images/I/91+p+q5JmZL.jpg', 'The desert planet of Dune has been destroyed. The remnants of the old Empire have been scattered. The Bene Gesserit, heirs to the power of the spice, are now hunted by a violent and ruthless matriarchal cult, the Honored Matres. The Bene Gesserit must use their wits and their breeding program to survive, and to restore their power over the galaxy.', 8, ['Sci-Fi', 'Fantasy', 'Classic']);
