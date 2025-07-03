import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Decide from "./pages/Decide";
import Demo from "./pages/Demo";
import TagManager from "./pages/Todo/TagManager";
import App from "./App";

export default () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="todo" element={<Todo />} />
        <Route path="decide" element={<Decide />} />
      </Route>
      <Route path="todo/tag_manager" element={<TagManager />} />
      <Route path="demo" element={<Demo />} />
    </Routes>
  );
};
