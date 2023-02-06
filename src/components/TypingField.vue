<template>
  <div class="container">
    <div class="race-details flex">
      <div class="">
        <h5 id="init-countdown">The race will start in 10</h5>
      </div>
      <div class="flex bubbles">
        <div class="bubble" id="speed">{{ speed }} wpm</div>
        <div class="bubble" id="accuracy">{{ accuracy }}%</div>
      </div>
    </div>
    <div class="field">
      <div id="text">
        {{ text }}
      </div>
      <input
        onpaste="return false"
        autocomplete="off"
        @keydown="keydown($event)"
        type="text"
        name=""
        id="textField"
        placeholder="Type the above text here when the race begins"
      />
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
    <div v-if="finished">
      You had your mistakes in the following keys.
      <DataChart :chartData="wrongKeys" />
      <DataLine :times="secsData" :words="filteredInstantSpeed" />
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
      finished: false,
      times: [],
      loggedIn: localStorage.getItem("loggedIn") == "true" ? true : false,
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      races: localStorage.getItem("races_completed"),
      avgSpeed: localStorage.getItem("average_speed"),
      wrongKeys: {},
      wordsPerFive: [],
      countPerFive: 0,
      secsData: [],
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
    textField: function (): HTMLInputElement {
      return <HTMLInputElement>document.querySelector("#textField");
    },
    totalCounter: function (): number {
      return this.text.split(" ").length * 3 - 1;
    },
    speed: function (): number {
      if (this.finished) {
        return this.speed;
      }
      return Math.round(
        (this.wordsTyped / (this.totalCounter - this.timeleft)) * 60
      );
    },
    ...mapState(["userInfo"]),
  },
  created() {},
  methods: {
    ...mapActions(["completeRace"]),
    // initialCountdown() {
    //   const self = this;
    //   var timeleft = 5;
    //   var initCountdown = <HTMLDivElement>(
    //     document.getElementById("init-countdown")
    //   );
    //   var downloadTimer = setInterval(function () {
    //     if (timeleft <= 0) {
    //       clearInterval(downloadTimer);
    //       initCountdown.innerHTML = "THE RACE BEGINS!";
    //     } else {
    //       initCountdown.innerHTML = "The race will start in " + timeleft;
    //     }
    //     timeleft -= 1;
    //     if (timeleft < 0 && !self.finished) {
    //       self.countdown(self.totalCounter);
    //       return;
    //     }
    //   }, 1000);
    // },
    keydown(e: KeyboardEvent) {
      if (this.counter == 0 && this.wrongCounter == 0) {
        this.countdown(this.totalCounter);
      }
      const rightKey = this.text[this.counter];
      if (this.ignoredKeys.includes(e.key) || this.textField.readOnly) {
        // terminates the function for unnecessary keys
        return;
      }
      this.times.push({ timestamp: e.timeStamp, key: e.key }); // records the keystrokes
      if (e.key === "Backspace") {
        if (this.counter === 0) {
          return;
        }
        if (this.wrong) {
          this.wrongCounter--;
          this.wrongText(e);
          this.wrong = this.wrongCounter === 0 ? false : true;
        } else {
          this.counter--;
          this.written();
        }
        return;
      }
      if (e.key === rightKey && !this.wrong) {
        if (e.key == " ") {
          this.wordsPerFive[this.countPerFive]++;
          this.wordsTyped++;
          this.textField.value = "";
        }
        this.counter++;
        this.written();
        if (this.counter === this.text.length) {
          this.wordsTyped++;
          this.finishedFunc();
        }
      } else {
        this.wrong = true;
        this.wrongCounter++;
        this.wrongText();
        if (this.wrongCounter === 1) {
          this.wrongKeys[rightKey] = this.wrongKeys[rightKey]
            ? this.wrongKeys[rightKey] + 1
            : 1;
          this.wrongPressed++;
        }
      }
    },
    // Marks the wrongly typed text as red
    wrongText(key: KeyboardEvent) {
      const text = <HTMLDivElement>document.querySelector("#text");
      text.innerHTML = `<span class="written">${this.text.slice(
        0,
        this.counter
      )}</span><span class="wrong">${this.text.slice(
        this.counter,
        this.counter + this.wrongCounter
      )}</span>${this.text.slice(
        this.counter + this.wrongCounter,
        this.text.length + 1
      )}`;
    },
    // Marks the correctly typed text as green
    written() {
      const text = <HTMLDivElement>document.querySelector("#text");
      text.innerHTML = `<span class="written">${this.text.slice(
        0,
        this.counter
      )}</span>${this.text.slice(this.counter, this.text.length + 1)}`;
    },
    // A basic countdown function
    countdown(total: number) {
      this.textField.setAttribute("placeholder", "");
      console.log("executed");
      let progress = <HTMLHeadingElement>(
        document.getElementById("init-countdown")
      );
      let speed = <HTMLDivElement>document.getElementById("speed");
      const self = this;
      this.timeleft = total;
      var downloadTimer = setInterval(function () {
        self.timeleft--;
        if (self.timeleft <= 0 || self.finished) {
          clearInterval(downloadTimer);
          progress.innerHTML = "Finished";
        } else {
          progress.innerHTML = "Timer: " + self.timeleft;
        }
        if ((self.totalCounter - self.timeleft) % 5 === 0) {
          self.countPerFive++;
        }
        if (self.timeleft < 1) {
          self.finished = true;
          self.textField.setAttribute("readonly", true);
        }
      }, 1000);
    },
    async finishedFunc() {
      this.finished = true;
      let progress = <HTMLHeadingElement>(
        document.getElementById("init-countdown")
      );
      progress.innerHTML = "Finished";
      this.wordsPerFive[this.countPerFive + 1] = "finished";
      console.log(this.wordsPerFive);
      let counter = 0;
      for (const i in this.wordsPerFive) {
        console.log(i, this.wordsPerFive[i]);
        if (this.wordsPerFive[i] != "finished") {
          this.filteredInstantSpeed.push(parseInt(this.wordsPerFive[i]));
          counter++;
        } else {
          break;
        }
      }
      for (let i = 0; i < counter; i++) {
        this.secsData[i] = i;
      }
      console.log("secsdata", this.secsData, this.filteredInstantSpeed);
      this.textField.setAttribute("readonly", true);
      if (this.loggedIn) {
        const new_avg =
          (+this.avgSpeed * +this.races + +this.speed) / (+this.races + 1);
        localStorage.setItem("average_speed", `${new_avg}`);
        this.avgSpeed = new_avg;
        localStorage.setItem("races_completed", `${+this.races + 1}`);
        this.races = +this.races + 1;
        const prevData = localStorage.getItem("key_data");
        const previousData = JSON.parse(prevData || "{}");
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
        console.log(newData);
        const newdt = JSON.stringify(newData);
        console.log("stringified", newdt, "un", newData);
        console.log(previousData, this.wrongKeys, newData);
        localStorage.setItem("key_data", newdt);
        console.log(localStorage.getItem("key_data"));
        this.completeRace("log", +this.speed);
        console.log(this.userInfo);

        await axiosInstance
          .patch(
            `http://localhost:8000/users/${this.id}/`,
            {
              races_completed: +this.races + 1,
              average_speed: new_avg,
              key_data: newdt,
            },
            { headers: { "Content-type": "application/json; charset=UTF-8" } }
          )
          .then((data) => console.log(data));
      } else {
        const new_avg =
          (+this.avgSpeed * +this.races + +this.speed) / (+this.races + 1);
        this.avgSpeed = new_avg;
        localStorage.setItem("average_speed", `${new_avg}`);
        localStorage.setItem("races_completed", `${+this.races + 1}`);
        const prevData = localStorage.getItem("key_data");
        const previousData = JSON.parse(prevData || "");
        const newData: keys = {};
        for (const key in previousData) {
          if (Object.keys(this.wrongKeys).includes(key)) {
            newData[key] = previousData[key] + this.wrongKeys[key];
          } else {
            newData[key] = previousData[key];
          }
        }
        const newdt = JSON.stringify(newData);
        localStorage.setItem("key_data", newdt);
        this.races = +this.races + 1;
        this.completeRace(+this.speed);
        console.log(this.userInfo);
        console.log(this.races);
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
          console.log(keyTime.key);
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
      this.textField.removeAttribute("readonly");
      this.textField.value = "";
      // this.initialCountdown();
      this.counter = 0;
      this.wrongCounter = 0;
      this.wrongPressed = 0;
      this.wrongKeys = {};
      this.times = [];
      this.timeleft = 59;
      this.wordsTyped = 0;
      this.text = "";
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
        url: `https://api.paperquotes.com/apiv1/quotes/?minlength=50&tags=${tag}&order=-likes`,
        headers: {
          Authorization: "Token cc2218fa4c809aea84c71c84efd2b57e9f2911bc",
        },
      }).then((res) => {
        this.quotes = res.data;
        console.log("quote", res.data);
        this.text =
          res.data.results[
            Math.floor(Math.random() * res.data.results.length)
          ].quote;
      });
      for (let i = 0; i < this.totalCounter / 5; i++) {
        this.wordsPerFive.push(0);
        console.log("created", this.wordsPerFive, this.totalCounter);
      }
    },
  },
  async mounted() {
    // this.initialCountdown();
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
a {
  color: #42b983;
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
