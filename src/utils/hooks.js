import { useState } from "react";

export function useFormState(initValue) {
  const [form, setForm] = useState(initValue);
  const setValue = (newValue) => {
    setForm({
      ...form,
      ...newValue,
    });
  };

  return {
    ...form,
    setValue,
    formValue: form,
  };
}
