import Context from "./context/Context";
import Board from "./sections/Board";
import Header from "./sections/Header";

export default function Home() {
  return (
    <Context>
      <Header />
      <Board />
    </Context>
  );
}
