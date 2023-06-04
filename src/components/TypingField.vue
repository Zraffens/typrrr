<template>
  <div class="container">
    <div class="race-details flex">
      <div class="">
        <h5 id="init-countdown">The race will start in</h5>
      </div>
      <div class="flex bubbles">
        <div class="bubble" id="speed">{{ speed }} wpm</div>
        <div class="bubble" id="accuracy">{{ accuracy }}%</div>
      </div>
    </div>
    <div class="field">
      <div id="text" @keydown="keydown($event)">
        <span v-for="letter in text">{{ letter }}</span>
      </div>
    </div>
    <div v-if="finished" class="align-center">
      <button @click="tryAgain" class="button race-again enlarge">
        Race again!
      </button>
    </div>
    <div id="review" v-if="finished">
      <h4>Review your typing.</h4>
      <button class="button" id="replay" @click="replay">
        Replay your keystrokes
      </button>
    </div>
    <div v-if="finished" id="replayed-text"></div>
    <div class="center" v-if="finished" lazy>
      <h3 class="center">You had your mistakes in the following keys.</h3>
      <DataChart v-if="wrongKeys" :chartData="wrongKeys" />
      
      <h3 class="center">Your speed at different times</h3>
      <DataLine :words="wordsData" />
    </div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { keyTiming, keys } from "../types";
import { mapActions } from "vuex";
import { mapState } from "vuex";
import axiosInstance from "axios";
import DataChart from "./DataChart.vue";
import DataLine from "./DataLine.vue";

@Options({
  components: {
    DataChart,
    DataLine,
  },
  data() {
    return {
      quotes: [],
      ignoredKeys: [
        "Shift",
        "Tab",
        "Alt",
        "Control",
        "CapsLock",
        "ArrowLeft",
        "ArrowRight",
        "ArrowDown",
        "ArrowUp",
      ],
      text: "",
      // text: "People have the right to think and say whatever they want to. But you have the right not to take it to heart, and not to react.",
      counter: 0,
      wrongCounter: 0,
      wrongPressed: 0,
      wrong: false,
      timeleft: 59,
      wordsTyped: 0,
      charsTyped: 0,
      started: false,
      finished: false,
      times: [],
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      races: localStorage.getItem("races_completed"),
      avgSpeed: localStorage.getItem("average_speed"),
      wrongKeys: {},
      wordsData: [],
      filteredInstantSpeed: [],
    };
  },
  computed: {
    words: function (): string[] {
      return this.text.split(" ");
    },
    accuracy: function (): number {
      return Math.round((1 - this.wrongPressed / this.text.length) * 100);
    },
    totalCounter: function (): number {
      return this.text.split(" ").length * 3 - 1;
    },
    speed: function (): number {
      if (this.finished) {
        return this.speed;
      }
      const speed = Math.round(
        (this.wordsTyped / (this.totalCounter - this.timeleft)) * 60
      )
      if (!Number.isNaN(speed) && Number.isFinite(speed)) {
        return speed
      }
      return 0
    },
    ...mapState(["userInfo"]),
  },
  created() {},
  methods: {
    ...mapActions(["completeRace"]),
    initialCountdown() {
      const self = this;
      var timeleft = 5;
      var initCountdown = <HTMLDivElement>(
        document.getElementById("init-countdown")
      );
      var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          initCountdown.innerHTML = "THE RACE BEGINS!";
        } else {
          initCountdown.innerHTML = "The race will start in " + timeleft;
        }
        timeleft -= 1;
        if (timeleft < 0 && !self.finished) {
          self.countdown(self.totalCounter);
          self.started = true;
          return;
        }
      }, 1000);
    },
    keydown(e: KeyboardEvent) {
      if (this.ignoredKeys.includes(e.key) || !this.started) {
        // terminates the function for unnecessary keys
        return;
      }
      this.times.push({ timestamp: e.timeStamp, key: e.key }); // records the keystrokes
      const currentLetter = document.getElementById("text")?.childNodes[
        this.counter
      ] as HTMLSpanElement;
      if (e.key === "Backspace") {
        if (this.counter === 0 && this.wroungCounter === 0) {
          return;
        }
        if (this.wrong) {
          this.wrongCounter--;
          this.wrong = this.wrongCounter === 0 ? false : true;
          const currentLetter = document.getElementById("text")?.childNodes[
            this.counter + this.wrongCounter + 1
          ] as HTMLSpanElement;
          console.log(currentLetter.innerText)
          currentLetter.classList.remove("animation", "wrong");
          if (currentLetter.innerText == " ") {
            currentLetter.style.background = "#333";
          }
        } else {
          this.counter--;
          currentLetter.classList.remove("animation", "written");
        }
        return;
      }
      if (e.key === this.text[this.counter] && !this.wrong) {
        if (e.key == " ") {
          this.wordsTyped++;
        }
        this.charsTyped++;
        this.counter++;
        this.written();
        if (this.counter === this.text.length) {
          this.wordsTyped++;
          this.finishedFunc();
        }
      } else {
        this.wrong = true;
        const wrongLetter = document.getElementById("text")?.childNodes[
            this.counter + this.wrongCounter + 1
      ] as HTMLSpanElement;
        console.log(wrongLetter.innerText)
        if (wrongLetter.innerText in this.wrongKeys) {
          this.wrongKeys[wrongLetter.innerText]++;
        } else {
          this.wrongKeys[wrongLetter.innerText] = 1;
        }
        this.wrongCounter++;
        this.wrongPressed++;
        this.wrongText();
      }
    },
    // Marks the wrongly typed text as red
    wrongText(key: KeyboardEvent) {
      const currentLetter = document.getElementById("text")?.childNodes[
        this.counter + this.wrongCounter
      ] as HTMLSpanElement;
      currentLetter.classList.add("animation", "wrong");
      if (currentLetter.innerText == " ") {
        currentLetter.style.background = "red";
      }
    },
    // Marks the correctly typed text as green
    written() {
      const currentLetter = document.getElementById("text")?.childNodes[
        this.counter
      ] as HTMLSpanElement;
      currentLetter.classList.add("animation", "written");
    },
    // A basic countdown function
    countdown(total: number) {
      let progress = <HTMLHeadingElement>(
        document.getElementById("init-countdown")
      );
      this.timeleft--;
      let speed = <HTMLDivElement>document.getElementById("speed");
      const self = this;
      this.timeleft = total;
      let typed = 0;
      var downloadTimer = setInterval(function () {
        self.timeleft--;
        if (self.timeleft <= 0 || self.finished) {
          clearInterval(downloadTimer);
          progress.innerHTML = "Finished";
        } else {
          progress.innerHTML = "Timer: " + self.timeleft;
        }
        if (self.timeleft % 3 == 0) {
          const avg = self.text.length / self.words.length;
          console.log(avg);
          let grossWords: Number = (self.charsTyped - typed) / avg;
          console.log(self.charsTyped - typed, "gross", self.text.length);
          self.wordsData.push(grossWords);
          console.log("typed", typed, self.wordsData);
          typed = self.charsTyped;
        }
        if (self.timeleft < 1) {
          self.finished = true;
        }
      }, 1000);
    },
    async finishedFunc() {
      this.started = false;
      this.finished = true;
      let progress = <HTMLHeadingElement>(
        document.getElementById("init-countdown")
      );
      progress.innerHTML = "Finished";
      this.speed = (this.words / (this.totalCounter - this.timeleft)) * 60
      
      this.$store.dispatch("completeRace", this.speed);
      if (this.loggedIn) {
        const new_avg =
          Math.round((+this.avgSpeed * +this.races + +this.speed) / (+this.races + 1));
        localStorage.setItem("average_speed", `${new_avg}`);
        this.avgSpeed = new_avg;
        localStorage.setItem("races_completed", `${+this.races + 1}`);
        this.races = +this.races + 1;
        const prevData = localStorage.getItem("key_data");
        const previousData = JSON.parse(prevData || "{}");
        const best = +previousData.best_speed || 0
        const newData: keys = {};
        for (
          let i = 0;
          i <
          Object.keys(this.wrongKeys).length + Object.keys(previousData).length;
          i++
        ) {
          const key1 =
            i < Object.keys(this.wrongKeys).length
              ? Object.keys(this.wrongKeys)[i]
              : "";
          const key2 =
            i < Object.keys(previousData).length
              ? Object.keys(previousData)[i]
              : "";
          if (key1 && !Object.keys(previousData).includes(key1)) {
            newData[key1] = this.wrongKeys[key1];
          } else if (key1 && Object.keys(previousData).includes(key1)) {
            newData[key1] =
              parseInt(this.wrongKeys[key1]) + parseInt(previousData[key1]);
          }
          if (key2 && !Object.keys(this.wrongKeys).includes(key2)) {
            newData[key2] = previousData[key2];
          }
        }
        const newbest = this.speed > best ? this.speed : best
        localStorage.setItem("best_speed", newbest)
        const newdt = JSON.stringify(newData);
        localStorage.setItem("key_data", newdt);
        this.completeRace("log", +this.speed);

        await axiosInstance
          .patch(
            `https://typrrr-backend.vercel.app/users/${this.id}/`,
            {
              races_completed: +this.races,
              average_speed: new_avg,
              best_speed: newbest,
              key_data: newdt,
            },
            { headers: { "Content-type": "application/json; charset=UTF-8" } }
          )
          .then((data) => console.log(data));
      } else {
        const new_avg =
          Math.round((+this.avgSpeed * +this.races + +this.speed) / (+this.races + 1));
        this.avgSpeed = new_avg;
        localStorage.setItem("average_speed", `${new_avg}`);
        localStorage.setItem("races_completed", `${+this.races + 1}`);
        const prevData = localStorage.getItem("key_data");
        const newData: keys = {};
        const previousData = prevData ? JSON.parse(prevData) : {}
        const best = localStorage.getItem("best_speed") || 0
        for (
          let i = 0;
          i <
          Object.keys(this.wrongKeys).length + Object.keys(previousData).length;
          i++
        ) {
          const key1 =
            i < Object.keys(this.wrongKeys).length
              ? Object.keys(this.wrongKeys)[i]
              : "";
          const key2 =
            i < Object.keys(previousData).length
              ? Object.keys(previousData)[i]
              : "";
          if (key1 && !Object.keys(previousData).includes(key1)) {
            newData[key1] = this.wrongKeys[key1];
          } else if (key1 && Object.keys(previousData).includes(key1)) {
            newData[key1] =
              parseInt(this.wrongKeys[key1]) + parseInt(previousData[key1]);
          }
          if (key2 && !Object.keys(this.wrongKeys).includes(key2)) {
            newData[key2] = previousData[key2];
          }
        }
        console.log('notstring', newData)
        const newbest = this.speed > best ? this.speed : best
        localStorage.setItem("best_speed", newbest)
        const newdt = JSON.stringify(newData);
        localStorage.setItem("key_data", newdt);
        console.log('newstringified', newdt)
        this.races = +this.races + 1;
        this.completeRace(+this.speed);
      }
      console.log("FINISHED");
    },
    replay() {
      if (!this.finished) {
        return;
      }
      const replayedText = <HTMLDivElement>(
        document.querySelector("#replayed-text")
      );
      const filteredKeys = this.times.filter((keyTime: keyTiming): Boolean => {
        return !this.ignoredKeys.includes(keyTime.key);
      });
      const firstKey = filteredKeys[0].timestamp;
      const properlyTimedKeys = filteredKeys.map(
        (keyItem: keyTiming): keyTiming => {
          let newItem = keyItem;
          newItem.timestamp = keyItem.timestamp - firstKey;
          return newItem;
        }
      );
      properlyTimedKeys.forEach((keyTime: keyTiming) => {
        setTimeout(function () {
          if (keyTime.key === "Backspace") {
            replayedText.innerHTML = replayedText.innerHTML.slice(
              0,
              replayedText.innerHTML.length - 1
            );
          } else {
            replayedText.innerHTML += keyTime.key;
          }
        }, keyTime.timestamp);
      });
    },
    tryAgain() {
      this.finished = false;
      this.initialCountdown();
      this.counter = 0;
      this.wrongCounter = 0;
      this.wrongPressed = 0;
      this.wrongKeys = {};
      this.times = [];
      this.timeleft = 59;
      this.wordsTyped = 0;
      this.text = "";
      this.charsTyped = 0
      this.generateQuote();
      this.written();
    },
    async generateQuote() {
      const tags = [
        "calling",
        "money",
        "passion",
        "joblessness",
        "kingdom",
        "opportunities",
        "principles",
        "serving-god",
        "love",
        "purpose",
        "jobless",
        "people",
        "values",
        "worship",
        "life",
        "employment",
        "work",
        "service",
        "time",
        "god",
        "destiny",
      ];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      await axiosInstance({
        method: "GET",
        url: `https://api.paperquotes.com/apiv1/quotes/?minlength=75&tags=${tag}&order=-likes`,
        headers: {
          Authorization: "Token cc2218fa4c809aea84c71c84efd2b57e9f2911bc",
        },
      }).then((res) => {
        this.quotes = res.data;
        this.text =
          res.data.results[
            Math.floor(Math.random() * res.data.results.length)
          ].quote;
      });
    },
    ...mapActions(["createdFunc"]),
  },
  async mounted() {
    const self = this;
    document.addEventListener("keydown", function (event) {
      self.keydown(event);
    });
    this.initialCountdown();
    await this.generateQuote();
  },
})
export default class TypingField extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.animation {
  transition: color 0.2s ease;
}

#init-countdown {
  background: rgb(32, 32, 32);
  margin: 0.3em 0 0.3em 0;
  width: 30vw;
  border-radius: 5px;
  padding: 0.4em;
  border: #333;
  color: white;
}

.race-details {
  margin-top: 1em;
}

#speed,
#accuracy {
  background: #212b86;
  font-size: 1.5em;
  width: 5em;
  padding: 0.4em;
}

#accuracy {
  color: #42b983;
}

.bubbles {
  left: 5;
}

.bubble {
  border-radius: 40px;
  width: 80%;
  font-size: 0.9em;
}

#text,
#replayed-text {
  font-size: 1.3em;
  font-family: courier;
}

.field,
#replayed-text {
  background: #333333;
  margin: 1em 0 1em 0;
  padding: 0.5em;
  border-radius: 5px;
}

input[type="text"] {
  width: 100%;
  background: #222;
  font-size: 1.3em;
  color: white;
}

#text:hover {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.race-again.button {
  margin: 1em;
  font-size: 2em;
  padding: 0.5em 1.5em;
  height: auto;
}

#review {
  background: #323437;
  padding: 1em;
  border-radius: 10px;
}
</style>
