<template>
  <div class="parent">
    <div class="text">
      {{ sentence }}
    </div>
    <div class="field">
      <input @keyup="keyup($event)" type="text" name="" id="textField" placeholder="Type the above text here">
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  data() {
    return {
      sentence: 'Hello, I am Abhinav Acharya. This is one of my first big projects so please help me with this.',
      counter: 0
    }
  },
  methods: {
    keyup(e: any): void {
      let textField = <HTMLInputElement>document.querySelector('#textField')
      console.log(e.key, this.sentence[this.counter])
      if (e.key === this.sentence[this.counter]) {
        this.counter++
        console.log(this.counter)
      } else {
        console.log('wrong')
        textField.value = this.sentence.slice(0, this.counter)
      }
    }
  }
})
export default class TypingField extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
