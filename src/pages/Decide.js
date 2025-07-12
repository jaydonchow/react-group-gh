import { useEffect, useState } from "react";
import { Label, MyDatePicker } from "./Todo/AddItem";
import { DatePicker } from "@nutui/nutui-react"
export default () => {
  const [date, setDate] = useState("2017-01-01");
  const [visible, setVisible] = useState(false)

  const beforeYears = new Date("1970-01-01");
  const afterYears = new Date("2050-12-31");

  return (
    <div>
      selectValue: {date}
    </div>
  );
};
