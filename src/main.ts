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
let postionChangesCounter = 0;
let comparisonsCounter = 0;

document.addEventListener("DOMContentLoaded", function () {
  numsOfBars = 250;
  unsortedArray = createRandomArray();
  generateDimensions();
  renderBars(unsortedArray);
  selectAlgorithm!.value = "bubble";
  speed!.value = "50";
  slider!.value = "250";
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
    case "quick":
      quickSort(unsortedArray, 0, unsortedArray.length - 1);
      break;
    default:
      bubbleSort(unsortedArray);
      break;
  }
});

function generateDimensions() {
  let counter = 1;
  for (let i = 10; i <= 500; i += 10) {
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
    [array[i], array[j]] = [array[j], array[i]];
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

async function partition(items: number[], left: number, right: number) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  let pivotIndex = Math.floor((right + left) / 2); 
  bars[pivotIndex].style.backgroundColor = "red";
  var pivot = items[pivotIndex]; 
  let [i, j] = [left, right];

  for (let i = 0; i < bars.length; i++) {
    if (i != pivotIndex) {
      bars[i].style.backgroundColor = "#fff";
    }
  };

  while (i <= j) {
    comparisonsCounter++;
    while (items[i] < pivot) {
      i++;
    }
    while (items[j] > pivot) {
      j--;
    }
    if (i <= j) {
      await swap(items, i, j, bars);
      i++;
      j--;
    }
  }

  return i
}

async function swap(array: number[], i: number, j: number, bars: HTMLCollectionOf<HTMLElement>) {
  comparisons!.textContent = `Quick sort
  \nTime Complexity: O(nlog(n))
  \nArray length: ${array.length}
  \nSwitched positions: ${(postionChangesCounter++).toString()}
  \nComparisons: ${(comparisonsCounter).toString()}`;
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = array[i] * heightFactor + "px";
  bars[j].style.height = array[j] * heightFactor + "px";
  bars[i].style.backgroundColor = "blue";
  bars[j].style.backgroundColor = "blue";
  await sleep(speedFactor);

  return array;
}

async function quickSort(items: number[], left: number, right: number) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5");
  let index;

  if (items.length > 1) {
    index = await partition(items, left, right);
    if (left < index - 1)
      await quickSort(items, left, index - 1);
    if (index < right)
      await quickSort(items, index, right);
  }

  if (index === 0 || index === items.length - 1) {
    for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = "#00ff00";
      await sleep(1);
    }
  }

  blockButtons("auto", "1");
  return items;
}

async function bubbleSort(array: number[]) {
  blockButtons("none", "0.5");
  postionChangesCounter = 0;
  comparisonsCounter = 0;
  let bars: any = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    comparisonsCounter++;
    for (let j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        comparisons!.textContent = `Bubble sort
        \nTime Complexity: θ(n²)
        \nArray length: ${array.length}
        \nSwitched positions: ${(postionChangesCounter++).toString()}
        \nComparisons: ${(comparisonsCounter).toString()}`
        for (let k = 0; k < bars!.length; k++) {
          if (k !== j && k !== j + 1) {
            bars![k].style.backgroundColor = "#fff";
          }
        }
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars![j].style.height = array[j] * heightFactor + "px";
        bars![j].style.backgroundColor = "red";
        bars![j + 1].style.height = array[j + 1] * heightFactor + "px";
        bars![j + 1].style.backgroundColor = "red";
        await sleep(speedFactor);
      }
    }
    await sleep(speedFactor);
  }

  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#00ff00";
    await sleep(speedFactor);
  }

  blockButtons("auto", "1");
  return array;
}

async function insertionSort(array: number[]) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5");
  postionChangesCounter = 0;
  comparisonsCounter = 0;

  for (let i = 1; i < array.length; i++) {

    for (let j = i; j >= 1; j--) {
      comparisonsCounter++;
      if (array[j] < array[j - 1]) {
        let aux = array[j];
        comparisons!.textContent = `Insertion sort
           \nTime Complexity: θ(n²)
           \nArray length: ${array.length}
           \nSwitched positions: ${(postionChangesCounter++).toString()}
           \nComparisons: ${(comparisonsCounter).toString()}`;

        array[j] = array[j - 1];
        bars[j].style.height = array[j] * heightFactor + "px";
        bars[j].style.backgroundColor = "red";

        array[j - 1] = aux;
        bars[j - 1].style.height = array[j - 1] * heightFactor + "px";
        bars[j - 1].style.backgroundColor = "red";

        await sleep(speedFactor);

        for (let k = 0; k < bars.length; k++) {
          if ((k != j) || (k != j - 1))
            bars[k].style.backgroundColor = "#fff";
        }
      } else {
        break;
      }
    }
  }

  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#00ff00";
    await sleep(speedFactor);
  }
  blockButtons("auto", "1");
  return array;
}
