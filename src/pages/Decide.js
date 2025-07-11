import { useEffect, useState } from "react";
import { Label, MyDatePicker } from "./Todo/AddItem";

export default () => {
  const [date, setDate] = useState("2017-01-01");

  return (
    <div>
      selectValue: {date}
      <div>
        <MyDatePicker value={date} onChange={(val) => setDate(val)}></MyDatePicker>
      </div>
    </div>
  );
};
