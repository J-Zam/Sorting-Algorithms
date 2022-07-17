import './style.scss'
import { IDimensions } from "./interfaces";

let randomizeArray: HTMLElement | null = document.getElementById("random_btn");
let sortBtn: HTMLElement | null = document.getElementById("sort_btn");
let selectAlgorithm: HTMLInputElement | null = (document.getElementById("algorithms") as HTMLInputElement);
let barsContainer: HTMLElement | null = document.getElementById("bars_container");
let slider: HTMLInputElement | null = (document.getElementById("slider") as HTMLInputElement);
let speed: HTMLInputElement | null = (document.getElementById("speed") as HTMLInputElement);
let numsOfBars = parseInt(slider!.value);
let heightFactor = 40;
let speedFactor = 100;
let widthBar = 60;
let dimensions: IDimensions[] = [];
let unsortedArray = new Array(numsOfBars);
let comparisons: HTMLElement | null = document.getElementById("comparisons")
let algorithmToUse = "";

document.addEventListener("DOMContentLoaded", function () {
  unsortedArray = createRandomArray();
  generateDimensions();
  renderBars(unsortedArray);
  selectAlgorithm!.value = "bubble";
  speed!.value = "50";
  slider!.value = "10";
});

slider.addEventListener("input", () => {
  numsOfBars = parseInt(slider!.value);
  unsortedArray = createRandomArray();
  barsContainer!.innerHTML = "";
  comparisons!.textContent = "";
  renderBars(unsortedArray);
});

speed?.addEventListener("change", (e: any) => {
  speedFactor = parseInt(e.target.value)
});

selectAlgorithm?.addEventListener("change", () => {
  algorithmToUse = selectAlgorithm!.value;
  localStorage.setItem("algorithm", algorithmToUse);
});

randomizeArray?.addEventListener("click", () => {
  unsortedArray = createRandomArray();
  barsContainer!.innerHTML = "";
  comparisons!.textContent = "";
  renderBars(unsortedArray);
});

sortBtn?.addEventListener("click", () => {
  switch (algorithmToUse) {
    case "bubble":
      bubbleSort(unsortedArray);
      break;
    case "insertion":
      insertionSort(unsortedArray);
      break;
    default:
      bubbleSort(unsortedArray);
      break;
  }
});

function generateDimensions() {
  let counter = 1;
  for (let i = 10; i <= 200; i += 10) {
    dimensions.push(
      {
        key: i,
        widthBar: widthBar / counter,
        heightBar: heightFactor / counter
      });
    counter++;
  }
};

function createRandomArray() {
  let array = [...Array(numsOfBars).keys()].map(i => i + 1)
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

function renderBars(array: number[]) {
  let barDimension = dimensions!.find((item: IDimensions) => item.key === numsOfBars);
  heightFactor = barDimension!.heightBar;

  for (let i = 0; i < numsOfBars; i++) {
    let bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.width = barDimension!.widthBar + "px";
    bar.style.height = array[i] * heightFactor + "px";
    barsContainer?.appendChild(bar);
  }
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
};

function blockButtons(pointer: string, opacity: string) {
  randomizeArray!.style.pointerEvents = pointer;
  selectAlgorithm!.style.pointerEvents = pointer;
  sortBtn!.style.pointerEvents = pointer;
  slider!.style.pointerEvents = pointer;
  randomizeArray!.style.opacity = opacity;
  selectAlgorithm!.style.opacity = opacity;
  sortBtn!.style.opacity = opacity;
  slider!.style.opacity = opacity;
};

async function bubbleSort(array: number[]) {
  blockButtons("none", "0.5");
  let postionChangesCounter = 0;
  let arrayAccessCounter = 0;
  let bars: any = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    arrayAccessCounter++;
    for (let j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        comparisons!.textContent = `Bubble sort
        \nArray length: ${array.length}
        \nSwitched positions: ${(postionChangesCounter++).toString()}
        \nArray accesses: ${(arrayAccessCounter).toString()}`
        for (let k = 0; k < bars!.length; k++) {
          if (k !== j && k !== j + 1) {
            bars![k].style.backgroundColor = "#fff";
          }
        }
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        bars![j].style.height = array[j] * heightFactor + "px";
        bars![j].style.backgroundColor = "orange";
        bars![j + 1].style.height = array[j + 1] * heightFactor + "px";
        bars![j + 1].style.backgroundColor = "red";
        await sleep(speedFactor);
      }
    }
    await sleep(speedFactor);
  }
  blockButtons("auto", "1");
  return array;
}

async function insertionSort(array: number[]) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5");
  let postionChangesCounter = 0;
  let arrayAccessCounter = 0;
  for (let i = 1; i < array.length; i++) {

    for (let j = i; j >= 1; j--) {
      let aux = array[j];
      if (array[j] < array[j - 1]) {
        comparisons!.textContent = `Insertion sort
           \nArray length: ${array.length}
           \nSwitched positions: ${(postionChangesCounter++).toString()}
           \nArray accesses: ${(arrayAccessCounter).toString()}`;

        array[j] = array[j - 1];
        bars[j].style.height = array[j - 1] * heightFactor + "px";
        bars[j].style.backgroundColor = "red";

        await sleep(speedFactor);
        for (let k = 0; k < bars.length; k++) {
          if ((k != j) || (k != j - 1))
            bars[k].style.backgroundColor = "#fff";
        };

        array[j - 1] = aux;
        bars[j - 1].style.height = array[j - 1] * heightFactor + "px";
        bars[j - 1].style.backgroundColor = "red";

      } else {
        bars[j].style.height = array[j] * heightFactor + "px";
        bars[j].style.backgroundColor = "lightGreen";
        break;
      }
    }
  }

  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#fff";
  }
  blockButtons("auto", "1");
  return array;
}
