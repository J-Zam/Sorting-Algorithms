let randomizeArray: HTMLElement | null = document.getElementById("random_btn");
let sortBtn: HTMLElement | null = document.getElementById("sort_btn");
let restartBtn: HTMLElement | null = document.getElementById("restart_btn");
let selectAlgorithm: HTMLInputElement | null = (document.getElementById("algorithms") as HTMLInputElement);
let slider: HTMLInputElement | null = (document.getElementById("slider") as HTMLInputElement);

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
};

export function blockButtons(pointer: string, opacity: string, display1: string, display2: string) {
    randomizeArray!.style.pointerEvents = pointer;
    selectAlgorithm!.style.pointerEvents = pointer;
    sortBtn!.style.display = display1;
    restartBtn!.style.display = display2;
    slider!.style.pointerEvents = pointer;
    randomizeArray!.style.opacity = opacity;
    selectAlgorithm!.style.opacity = opacity;
    sortBtn!.style.opacity = opacity;
    slider!.style.opacity = opacity;
};
