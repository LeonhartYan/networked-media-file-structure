require("dotenv").config();

const m = require("masto");

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN,
});

const stream = m.createStreamingAPIClient({
    accessToken: process.env.TOKEN,
    streamingApiUrl: "wss://networked-media.itp.io", // special url we use for sockets
  });
  
  let replied = [];
  // async function to wait for the notification and reply to it
  async function reply() {
    // finding the specific route to watch for notifications
    // based off the stream client and the notification path
    const notificationSubscription = await stream.user.notification.subscribe();
  
    // makes sure objects exist in the returned obj before going through array
    for await (let notif of notificationSubscription) {
  
      // printing the structure to the console to see how to access data
      // console.log(notif.payload.type);
  
      // local variables for each piece of data i want
      let type = notif.payload.type;
      let acct = notif.payload.account.acct;
      let replyId = notif.payload.status.id;
    for (i = 0; i < replied.length; i++){
      // if the type of notification is a mention
      if (notif.payload.type == "mention" && !replied.includes(replyId)) {
  
          // create a status
        const status = await masto.v1.statuses.create({
          status: `@${acct} 😅`,    // reply to user that originally mentioned
          visibility: "public",
          in_reply_to_id: replyId,        // id # of the mention post so that you reply in the thread
        });
      }
    }
      replied.push(replyId);
    }
  }
  
  // call the reply function so it can always wait for notifications
  reply()

async function makeStatus(text){
    const status = await masto.v1.statuses.create({
        status: text,
        visibility: "public",

    })
console.log(masto.url)
}

function multipleStatuses(){
    //external req
    const dadJokes = [
        "Two fish are in a tank.\nOne turns to the other and says, 'Any idea how to drive this thing?'",
        "What has five toes and isn't your foot?\nMy foot.",
        "I don't tell dad jokes that often.\nBut when I do, he usually laughs.",
        "What’s the best way to get to the hospital after breaking your foot?\nWith a tow truck.",
        "Why does a chicken coop only have two doors?\nBecause if it had four it would be a sedan.",
        "What did the pirate say on his birthday?\n'Aye, matey!'",
        "I was going to tell a sodium joke,\nthen I thought, 'Na.'",
        "What's a witch's favorite subject in school?\nSpelling.",
        "Why are frogs good at baseball?\nThey know how to catch fly balls.",
        "What's the easiest building to lift?\nA lighthouse.",
        "Why do sweaters tend to hang out together?\nThey're pretty close-knit.",
        "Why did the zombie take a nap?\nHe was dead tired.",
        "Did you hear about the archeologist that got fired?\nNow his career is in ruins.",
        "What did the buffalo say to her son on the first day of school?\n'Bison.'",
        "Why do ducks have feathers on their tales?\nTo hide their butt-quacks.",
        "Why shouldn't you tell secrets in a cornfield?\nThere are too many ears all around.",
        "What kind of underpants do lawyers wear?\nBriefs.",
        "What do you call it when a cow grows facial hair?\nA moo-stache.",
        "Did you hear about the two rowboats that got into an argument?\nIt was an oar-deal.",
        "Did you hear about the cleaners who went to space?\nThey ended up scrubbing the mission.",
        "My boss said 'dress for the job you want, not for the job you have.'\nSo I went in as Batman.",
        "I went to the aquarium this weekend, but I didn’t stay long.\nThere’s something fishy about that place.",
        "What do you call a sheep who can sing and dance?\nLady Ba Ba.",
        "What do you call a French man wearing sandals?\nPhilipe Fallop.",
        "Why can't dinosaurs clap their hands?\nBecause they're extinct.",
        "I gave my handyman a to-do list, but he only did jobs 1, 3, and 5.\nTurns out he only does odd jobs.",
        "Today at the bank, an old lady asked me to check her balance...\nSo I pushed her over.",
        "Who won the neck decorating contest?\nIt was a tie.",
        "Where do rainbows go when they've been bad?\nTo prism, so they have time to reflect on what they've done.",
        "Dogs can't operate MRI machines.\nBut catscan.",
        "What do mermaids use to wash their fins?\nTide.",
        "What did the skillet eat on its birthday?\nPan-cakes.",
        "Why couldn't the produce manager make it to work?\nHe could drive, but he didn't avocado.",
        "I went to a silent auction.\nI won a dog whistle and two mimes.",
        "If your house is cold, just stand in the corner.\nIt’s always 90 degrees there.",
        "What do you call a dog who meditates?\nAware wolf.",
        "What kind of fish do penguins catch at night?\nStar fish.",
        "Which vegetable has the best kung fu?\nBroc-lee.",
        "Can a frog jump higher than a house?\nOf course, a house can't jump.",
        "I was going to try an all almond diet,\nbut that's just nuts.",
        "What do you call fake potatoes?\nImitaters!",
        "Why don’t eggs tell jokes?\nBecause they might crack up.",
        "I only know 25 letters of the alphabet…\nI don't know Y.",
        "Why did the scarecrow become a successful motivational speaker?\nHe was great at 'fielding' questions.",
        "How do you organize a space party?\nYou planet.",
        "Why don’t skeletons ever go trick or treating?\nBecause they have no body to go with.",
        "What do you call a bear with no teeth?\nA gummy bear.",
        "How does a penguin build its house?\nIgloos it together.",
        "What do you get when you cross a snowman and a vampire?\nFrostbite.",
        "I got hit in the head with a can of soda.\nLuckily, it was a soft drink.",
        "What did the ocean say to the beach?\nNothing, it just waved.",
        "Why don’t some couples go to the gym?\nBecause some relationships don’t work out.",
        "Why was the math book sad?\nIt had too many problems.",
        "What’s orange and sounds like a parrot?\nA carrot.",
        "I used to have a job as a professional cricket player...\nBut I got bowled over.",
        "What do you call cheese that isn’t yours?\nNacho cheese.",
        "I told my wife she was drawing her eyebrows too high.\nShe looked surprised.",
        "Why don’t bakers tell secrets?\nBecause they might ‘whisk’ it all.",
        "Did you hear about the guy who invented Lifesavers?\nHe made a mint!",
        "Why can’t your nose be 12 inches long?\nBecause then it would be a foot."
    ];
    
    let rad1 = Math.floor(Math.random()*dadJokes.length);
    let rad2 = Math.floor(Math.random()*dadJokes.length);

    if(rad1 == rad2){
        rad1 = Math.floor(Math.random()*dadJokes.length);
        rad2 = Math.floor(Math.random()*dadJokes.length);
    }

    let post = "Here is your Quarter-hourly Dad Jokes feed: \n" + dadJokes[rad1] + "\n" + dadJokes[rad2];
    makeStatus(post)
}
setInterval(multipleStatuses, 900000)
