<template>
  <div class="parent">
    <div id="timer"></div>
    <div id="speed">0 wpm</div>
    <div id="accuracy">{{ accuracy }}</div>
    <div id="text">
      {{ sentence }}
    </div>
    <div class="field">
      <input
        onpaste="return false"
        autocomplete="off"
        @keydown="keyup($event)"
        type="text"
        name=""
        id="textField"
        placeholder="Type the above text here"
      />
    </div>
    <button class="button" id="replay" @click="replay">
      Replay your keystrokes
    </button>
    <div id="replayed-text"></div>
  </div>
</template>

<script lang="ts">
import { VueElement } from "@vue/runtime-dom";
import { Options, Vue } from "vue-class-component";
import { keyTiming } from "../types";

@Options({
  data() {
    return {
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
      // sentence: 'People have the right to think and say whatever they want to. But you have the right not to take it to heart, and not to react.',
      sentence: "fuck you",
      counter: 0,
      wrongCounter: 0,
      wrongPressed: 0,
      wrong: false,
      timeleft: 60,
      wordsTyped: 0,
      finished: false,
      times: [],
    };
  },
  computed: {
    words: function (): string[] {
      return this.sentence.split(" ");
    },
    accuracy: function (): number {
      return (1 - this.wrongPressed / this.sentence.length) * 100;
    },
  },
  methods: {
    keyup(e: KeyboardEvent) {
      console.log(this.sentence.length);

      console.log(this.times);
      const textField = <HTMLInputElement>document.querySelector("#textField");
      if (this.ignoredKeys.includes(e.key)) {
        return;
      }
      this.times.push({ timestamp: e.timeStamp, key: e.key });
      if (e.key === "Backspace") {
        if (this.wrong) {
          console.log(this.wrongCounter);
          this.wrongCounter--;
          console.log(this.wrongCounter);
          if (this.wrongCounter == 0) {
            this.wrong = false;
          }
          this.wrongText();
        } else {
          this.counter--;
          this.written();
        }
        return;
      }
      if (this.counter === 0) {
        this.countdown(60);
      }
      if (e.key === this.sentence[this.counter] && !this.wrong) {
        if (e.key == " ") {
          this.wordsTyped++;
          textField.value = "";
          console.log("words", this.wordsTyped);
        }
        this.counter++;
        this.written();
        if (this.counter === this.sentence.length) {
          this.finishedFunc();
          return;
        }
        console.log(e.key);
        console.log(this.counter);
      } else {
        console.log(e.key);
        console.log("wrong");
        this.wrong = true;
        this.wrongCounter++;
        this.wrongPressed++;
        console.log(this.wrongCounter);
        this.wrongText();
      }
    },
    wrongText() {
      const text = <HTMLDivElement>document.querySelector("#text");
      text.innerHTML = `<span class="written">${this.sentence.slice(
        0,
        this.counter
      )}</span><span class="wrong">${this.sentence.slice(
        this.counter,
        this.counter + this.wrongCounter
      )}</span>${this.sentence.slice(this.counter + this.wrongCounter, -1)}`;
    },
    written() {
      const text = <HTMLDivElement>document.querySelector("#text");
      text.innerHTML = `<span class="written">${this.sentence.slice(
        0,
        this.counter
      )}</span>${this.sentence.slice(this.counter, -1)}`;
    },
    countdown(total: number) {
      console.log("executed");
      let progress: any = <HTMLDivElement>document.getElementById("timer");
      let speed: any = <HTMLDivElement>document.getElementById("speed");
      const self = this;
      this.timeleft = total;
      var downloadTimer = setInterval(function () {
        if (self.timeleft <= 0) {
          clearInterval(downloadTimer);
          progress.innerHTML = "Finished";
        } else {
          progress.innerHTML = "Timer: " + self.timeleft;
          if (!self.finished) {
            speed.innerHTML =
              (Number(self.wordsTyped) / (60 - Number(self.timeleft))) * 60;
          }
        }
        self.timeleft--;
      }, 1000);
    },
    finishedFunc() {
      this.finished = true;
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
      // console.log('filtered before', filteredKeys)
      // const filteredMappedKeys = filteredKeys.map((keyItem: keyTiming): keyTiming => {
      //   let newItem = keyItem
      //   newItem.timestamp = keyItem.timestamp - filteredKeys[0].timestamp
      //   console.log('0', filteredKeys[0].timestamp)
      //   return newItem
      // })
      console.log("filtered after", filteredKeys);
      // console.log('mapped', filteredMappedKeys)
      console.log("replaying");
      filteredKeys.forEach((keyTime: keyTiming) => {
        setTimeout(function () {
          console.log(keyTime.key);
          replayedText.innerHTML += keyTime.key;
        }, keyTime.timestamp);
      });
    },
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

#text:hover {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.written {
  color: #42b983;
}
</style>
