import './sass/style.scss';
import { IDimensions } from "./interfaces/interfaces";
import { blockButtons, sleep } from "./utils";

let randomizeArray: HTMLElement | null = document.getElementById("random_btn");
let sortBtn: HTMLElement | null = document.getElementById("sort_btn");
let restartBtn: HTMLElement | null = document.getElementById("restart_btn");
let selectAlgorithm: HTMLInputElement | null = (document.getElementById("algorithms") as HTMLInputElement);
let barsContainer: HTMLElement | null = document.getElementById("bars_container");
let slider: HTMLInputElement | null = (document.getElementById("slider") as HTMLInputElement);
let speed: HTMLInputElement | null = (document.getElementById("speed") as HTMLInputElement);
let numsOfBars = parseInt(slider!.value);
let heightFactor = 40;
let speedFactor = 20;
let widthBar = 60;
let dimensions: IDimensions[] = [];
let unsortedArray = new Array(numsOfBars);
let comparisons: HTMLElement | null = document.getElementById("comparisons")
let postionChangesCounter = 0;
let comparisonsCounter = 0;
let algorithmToUse = "";

document.addEventListener("DOMContentLoaded", function () {
  numsOfBars = 250;
  unsortedArray = createRandomArray();
  generateDimensions();
  renderBars(unsortedArray);
  selectAlgorithm!.value = "quick";
  speed!.value = "20";
  slider!.value = "250";
  restartBtn!.style.display = "none";
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
});

randomizeArray?.addEventListener("click", () => {
  unsortedArray = createRandomArray();
  barsContainer!.innerHTML = "";
  comparisons!.textContent = "";
  renderBars(unsortedArray);
});

sortBtn?.addEventListener("click", () => {
  postionChangesCounter = 0;
  comparisonsCounter = 0;
  
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
    case "heap":
      HeapSort(unsortedArray);
      break;
    default:
      quickSort(unsortedArray, 0, unsortedArray.length - 1);
      break;
  }
});

restartBtn?.addEventListener("click", () => {
  document.location.reload();
});

function generateDimensions() {
  let counter = 1;
  for (let i = 10; i <= 480; i += 10) {
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

async function quickSort(items: number[], left: number, right: number) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5", "none", "inline-block");
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
      bars[k].style.backgroundColor = "#12c413";
      await sleep(10);
    }
  }

  blockButtons("auto", "1", "inline-block", "none");
  return items;
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
      await swap(items, i, j, bars, "#12c413", "Quick sort");
      i++;
      j--;
    }
  }

  return i
};

async function swap(array: number[], i: number, j: number,
  bars: HTMLCollectionOf<HTMLElement>, color: string, sortName: string) {
  comparisons!.textContent = `${sortName}
  \nTime Complexity: O(nlog(n))
  \nArray length: ${array.length}
  \nSwitched positions: ${(postionChangesCounter++).toString()}
  \nComparisons: ${(comparisonsCounter).toString()}`;
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = array[i] * heightFactor + "px";
  bars[j].style.height = array[j] * heightFactor + "px";
  bars[i].style.backgroundColor = color;
  bars[j].style.backgroundColor = color;
  await sleep(speedFactor);
  return array;
};

async function HeapSort(array: number[]) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5", "none", "inline-block");
  for (let i = Math.floor(array.length / 2); i >= 0; i--) {
    await heapify(array, array.length, i);
  }
  for (let i = array.length - 1; i >= 0; i--) {
    await swap(array, 0, i, bars, "#0088ff", "Heap sort");
    await heapify(array, i, 0);
  }
  for (let k = 0; k < bars.length; k++) {
    bars[k].style.backgroundColor = "#12c413";
    await sleep(0.5);
  }

  blockButtons("auto", "1", "inline-block", "none");
  return array;
};

async function heapify(array: number[], n: number, i: number) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (left < n && array[left] > array[largest]) {
    largest = left;
    comparisonsCounter++;
  }
  if (right < n && array[right] > array[largest]) {
    largest = right;
    comparisonsCounter++;
  }
  if (largest != i) {
    await swap(array, i, largest, bars, "#fff", "Heap sort");
    await heapify(array, n, largest);
    comparisonsCounter++;
  }
};

async function bubbleSort(array: number[]) {
  blockButtons("none", "0.5", "none", "inline-block");
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
    bars[k].style.backgroundColor = "#12c413";
    await sleep(speedFactor);
  }

  blockButtons("auto", "1", "inline-block", "none");
  return array;
};

async function insertionSort(array: number[]) {
  let bars = (document.getElementsByClassName("bar") as HTMLCollectionOf<HTMLElement>);
  blockButtons("none", "0.5", "none", "inline-block");
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
    bars[k].style.backgroundColor = "#12c413";
    await sleep(speedFactor);
  }
  blockButtons("auto", "1", "inline-block", "none");
  return array;
};
