import { useEffect, useRef, useState } from "react";
import "./style.scss";
export default function SearchBox(props) {
  const { placeholder, varStyle } = props;

  const [expand, setExpand] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (expand) {
      ref.current.focus();
    } else {
      ref.current.blur();
    }
  }, [expand]);

  return (
    <div className="search-box" style={{ ...varStyle }}>
      <div className="search-box-content">
        <input
          ref={ref}
          // type="search"
          name="input"
          className={`search-box-input ${expand ? "square" : ""}`}
          enterKeyHint="search"
          placeholder={expand ? placeholder : ""}
        />
        <button
          type="reset"
          className={`search-box-btn ${expand ? "close" : ""}`}
          onClick={() => {
            setExpand(!expand);
          }}
        ></button>
      </div>
    </div>
  );
}

function Demo() {
  return (
    <div>
      <SearchBox
        placeholder={"please enter something"}
        varStyle={{
          // "--width": "250px",
          "--height": "32px",
          "--border-width": "2px",
          "--color": "#0078d4"
        }}
      ></SearchBox>
    </div>
  );
}
