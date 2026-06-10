import { createSignal, type Component, type JSX } from "solid-js";

interface Props {
  initValue: number;
  children?: JSX.Element;
}

export const Counter: Component<Props> = (props) => {
  const [counter, setCounter] = createSignal(props.initValue);

  return (
    <>
      {/* <h1 class="text-4xl">Counter</h1> */}
      {props.children}

      <h3 class="text-xl">Value: {counter()}</h3>

      <button
        class="mr-2 rounded bg-blue-500 p-2"
        onClick={() => setCounter((prev) => ++prev)}
      >
        +1
      </button>
      <button
        class="mr-2 rounded bg-blue-500 p-2"
        onClick={() => setCounter((prev) => --prev)}
      >
        -1
      </button>
    </>
  );
};
