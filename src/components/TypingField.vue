<template>
  <div class="container">
    <div class="race-details">
      <div class="flex">
        <h5 id="init-countdown">The race will start in 10</h5>
      </div>
      <div id="speed">Speed: {{ speed }} wpm</div>
      <div id="accuracy">Accuracy {{ accuracy }}%</div>
    </div>
    <div class="field">
      <div id="text">
        {{ text }}
      </div>
      <input
        readonly
        onpaste="return false"
        autocomplete="off"
        @keydown="keydown($event)"
        type="text"
        name=""
        id="textField"
        placeholder="Type the above text here when the race begins"
      />
    </div>
    <div id="review">
      <h4>Review your typing.</h4>
      <button class="button" id="replay" @click="replay">
        Replay your keystrokes
      </button>
    </div>
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
      text: "Hello there old man",
      // text: "People have the right to think and say whatever they want to. But you have the right not to take it to heart, and not to react.",
      counter: 0,
      wrongCounter: 0,
      wrongPressed: 0,
      wrong: false,
      timeleft: 59,
      wordsTyped: 0,
      finished: false,
      times: [],
    };
  },
  computed: {
    words: function (): string[] {
      return this.text.split(" ");
    },
    speed: function (): number {
      if (this.finished) {
        return this.speed;
      }
      return Math.round((this.wordsTyped / (60 - this.timeleft)) * 60);
    },
    accuracy: function (): number {
      return Math.round((1 - this.wrongPressed / this.text.length) * 100);
    },
    textField: function (): HTMLInputElement {
      return <HTMLInputElement>document.querySelector("#textField");
    },
  },
  methods: {
    initialCountdown() {
      const self = this;
      var timeleft = 10;
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
        if (timeleft < 0) {
          self.countdown(59);
          return;
        }
      }, 1000);
    },
    keydown(e: KeyboardEvent) {
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
          this.wrong = this.wrongCounter === 0 ? false : true;
          this.wrongText();
        } else {
          this.counter--;
          this.written();
        }
        return;
      }
      if (e.key === this.text[this.counter] && !this.wrong) {
        if (e.key == " ") {
          this.wordsTyped++;
          this.textField.value = "";
        }
        this.counter++;
        this.written();
        if (this.counter === this.text.length) {
          this.finishedFunc();
        }
      } else {
        this.wrong = true;
        this.wrongCounter++;
        this.wrongPressed++;
        this.wrongText();
      }
    },
    // Marks the wrongly typed text as red
    wrongText() {
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
      this.textField.removeAttribute("readonly");
      this.textField.setAttribute("placeholder", "");
      console.log("executed");
      let progress = <HTMLHeadingElement>(
        document.getElementById("init-countdown")
      );
      let speed = <HTMLDivElement>document.getElementById("speed");
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
              "Speed: " +
              Math.round(
                Number(self.wordsTyped) / (60 - Number(self.timeleft))
              ) *
                60 +
              " wpm";
          }
        }
        self.timeleft--;
        if (self.timeleft < 1) {
          self.finished = true;
          self.textField.setAttribute("readonly", true);
        }
      }, 1000);
    },
    finishedFunc() {
      this.finished = true;
      this.textField.setAttribute("readonly", true);
      const mainField = <HTMLDivElement>document.querySelector(".field");
      const review = <HTMLDivElement>document.querySelector("#review")
      mainField.setAttribute("style", "display: none;");
      review.setAttribute("style", "display: block;");
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
  },
  mounted() {
    this.initialCountdown();
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
  width: 10em;
}

#text {
  font-size: 1.3em;
  font-family: courier;
}

.field {
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

#review {
  background: #323437;
  border-radius: 10px;
  display: none;
}

</style>
