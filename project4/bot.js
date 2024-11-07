// import the .env file so that we can keep our password outside of our script
require("dotenv").config()

// importing the masto library to interface with our mastodon server
const m = require("masto")

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/", // this is our mastodon server
    accessToken: process.env.TOKEN,
})

// we need to use a different client in order to run all the time
// this will pull in every notification as they happen
const stream = m.createStreamingAPIClient({
    accessToken: process.env.TOKEN,
    streamingApiUrl: "wss://networked-media.itp.io", // special url we use for sockets
  });
  
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
      let replyContent = notif.payload.status.content;
      let emojiReply = "😅"
      let noEmoRep = "Yayyy!"
      let selfReply = ""

      
      //Copyright: ChatGPT
      function isEmoji(content) {
        //Reference:https://stackoverflow.com/questions/18862256/how-to-detect-emoji-using-javascript
        const emojiRegex = /\p{RGI_Emoji}/v
        return emojiRegex.test(content);
      }


      // if the type of notification is a mention
      if (notif.payload.type == "mention") {
        if (isEmoji(replyContent)) {
            selfReply = emojiReply;
            console.log("Emoji");
          } else {
            selfReply = noEmoRep
            console.log("NoEmoji");
          }
          // create a status
        const status = await masto.v1.statuses.create({
          status: `@${acct} ${selfReply}`,    // reply to user that originally mentioned
          visibility: "public",
          in_reply_to_id: replyId,        // id # of the mention post so that you reply in the thread
        });
      }
    }
  }
  
  // call the reply function so it can always wait for notifications
  reply()

async function makeStatus(text){

    const status = await masto.v1.statuses.create({
        status: text,
        visibility: "public"
    })

    console.log(status.url)
}

// makeStatus("hello my second status!")

function multipleStatuses(){
    // if you want to make an external req, do it here
    const dadJokes = [
        "Two fish are in a tank.\n-- One turns to the other and says, 'Any idea how to drive this thing?'",
        "What has five toes and isn't your foot?\n-- My foot.",
        "I don't tell dad jokes that often.\n-- But when I do, he usually laughs.",
        "What’s the best way to get to the hospital after breaking your foot?\n-- With a tow truck.",
        "Why does a chicken coop only have two doors?\n-- Because if it had four it would be a sedan.",
        "What did the pirate say on his birthday?\n-- 'Aye, matey!'",
        "I was going to tell a sodium joke,\n-- then I thought, 'Na.'",
        "What's a witch's favorite subject in school?\n-- Spelling.",
        "Why are frogs good at baseball?\n-- They know how to catch fly balls.",
        "What's the easiest building to lift?\n-- A lighthouse.",
        "Why do sweaters tend to hang out together?\n-- They're pretty close-knit.",
        "Why did the zombie take a nap?\n-- He was dead tired.",
        "Did you hear about the archeologist that got fired?\n-- Now his career is in ruins.",
        "What did the buffalo say to her son on the first day of school?\n-- 'Bison.'",
        "Why do ducks have feathers on their tales?\n-- To hide their butt-quacks.",
        "Why shouldn't you tell secrets in a cornfield?\n-- There are too many ears all around.",
        "What kind of underpants do lawyers wear?\n-- Briefs.",
        "What do you call it when a cow grows facial hair?\n-- A moo-stache.",
        "Did you hear about the two rowboats that got into an argument?\n-- It was an oar-deal.",
        "Did you hear about the cleaners who went to space?\n-- They ended up scrubbing the mission.",
        "My boss said 'dress for the job you want, not for the job you have.'\n-- So I went in as Batman.",
        "I went to the aquarium this weekend, but I didn’t stay long.\n-- There’s something fishy about that place.",
        "What do you call a sheep who can sing and dance?\n-- Lady Ba Ba.",
        "What do you call a French man wearing sandals?\n-- Philipe Fallop.",
        "Why can't dinosaurs clap their hands?\n-- Because they're extinct.",
        "I gave my handyman a to-do list, but he only did jobs 1, 3, and 5.\n-- Turns out he only does odd jobs.",
        "Today at the bank, an old lady asked me to check her balance...\n-- So I pushed her over.",
        "Who won the neck decorating contest?\n-- It was a tie.",
        "Where do rainbows go when they've been bad?\n-- To prism, so they have time to reflect on what they've done.",
        "Dogs can't operate MRI machines.\n-- But catscan.",
        "What do mermaids use to wash their fins?\n-- Tide.",
        "What did the skillet eat on its birthday?\n-- Pan-cakes.",
        "Why couldn't the produce manager make it to work?\n-- He could drive, but he didn't avocado.",
        "I went to a silent auction.\n-- I won a dog whistle and two mimes.",
        "If your house is cold, just stand in the corner.\n-- It’s always 90 degrees there.",
        "What do you call a dog who meditates?\n-- Aware wolf.",
        "What kind of fish do penguins catch at night?\n-- Star fish.",
        "Which vegetable has the best kung fu?\n-- Broc-lee.",
        "Can a frog jump higher than a house?\n-- Of course, a house can't jump.",
        "I was going to try an all almond diet,\n-- but that's just nuts.",
        "What do you call fake potatoes?\n-- Imitaters!",
        "Why don’t eggs tell jokes?\n-- Because they might crack up.",
        "I only know 25 letters of the alphabet…\n-- I don't know Y.",
        "Why did the scarecrow become a successful motivational speaker?\n-- He was great at 'fielding' questions.",
        "How do you organize a space party?\n-- You planet.",
        "Why don’t skeletons ever go trick or treating?\n-- Because they have no body to go with.",
        "What do you call a bear with no teeth?\n-- A gummy bear.",
        "How does a penguin build its house?\n-- Igloos it together.",
        "What do you get when you cross a snowman and a vampire?\n-- Frostbite.",
        "I got hit in the head with a can of soda.\n-- Luckily, it was a soft drink.",
        "What did the ocean say to the beach?\n-- Nothing, it just waved.",
        "Why don’t some couples go to the gym?\n-- Because some relationships don’t work out.",
        "Why was the math book sad?\n-- It had too many problems.",
        "What’s orange and sounds like a parrot?\n-- A carrot.",
        "I used to have a job as a professional cricket player...\n-- But I got bowled over.",
        "What do you call cheese that isn’t yours?\n-- Nacho cheese.",
        "I told my wife she was drawing her eyebrows too high.\n-- She looked surprised.",
        "Why don’t bakers tell secrets?\n-- Because they might ‘whisk’ it all.",
        "Did you hear about the guy who invented Lifesavers?\n-- He made a mint!",
        "Why can’t your nose be 12 inches long?\n-- Because then it would be a foot."
    ];
    
    
    let rad1 = Math.floor(Math.random()*dadJokes.length);
    let rad2 = Math.floor(Math.random()*dadJokes.length);

    if(rad1 == rad2){
        rad1 = Math.floor(Math.random()*dadJokes.length);
        rad2 = Math.floor(Math.random()*dadJokes.length);
    }

    let post = "!!! Here's your Quarter-Hourly Dad Jokes feed 😍 !!! : \n" + dadJokes[rad1] + "\n" + dadJokes[rad2] + "\n" + "If you laughed, just reply! 😬";
    makeStatus(post)
}
setInterval(multipleStatuses, 900000)
console.log("bot start")