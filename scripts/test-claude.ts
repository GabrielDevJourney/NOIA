import { generateConnection } from "../lib/claude";

const noteA =
  "Falling or skipping something because it's okay. Discipline must be in place. Procrastination is killing you without your consent. If you miss a day, that's fine. Don't beat yourself up. But climb aboard and get back at it tomorrow. Otherwise, too many \"tomorrows\" will go by. I was procrastinating my reading habit, i tried to understand why. Then i realized if this habit will be something my 25 year old me will do with consistency, I must do it now.";

const noteB =
  "This is an important topic to be discussed. I think i have conditioned myself to think i am someone who doesn't need to socialize, but i have realized that isn't as true as i thought. Why do i always end up pushing people away? Afraid of loss, not wanting to put the effort, thinking they will always be there. I have done a very bad decision of thinking i would just need to have time with a partner and myself and that would be enough but i was very wrong.";

generateConnection(noteA, noteB).then((result) => {
  console.log(JSON.stringify(result, null, 2));
}).catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
