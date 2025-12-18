import { useState } from "react";
import Select from "react-select";

export default function Controls({ categories, channels, onFilter }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState(null);

  const used = new Set();
  Object.values(channels).forEach(c =>
    c.categories?.forEach(x => used.add(x))
  );

  const options = categories
    .filter(c => used.has(c.id))
    .map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="controls">
      <input
        style={{border: "1px solid rgba(206, 212, 218, 0.2)"}}
        placeholder="Search channel"
        onChange={e => {
          setText(e.target.value);
          onFilter(e.target.value, cat?.value);
        }}
      />

      <Select
        isSearchable={true}
        options={options}
        isClearable
        placeholder="All Categories"
        onChange={v => {
          setCat(v);
          onFilter(text, v?.value);
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            background: "#020617",
            border: "1px solid rgba(206, 212, 218, 0.2)",
            boxShadow: state.isFocused ? "0 0 0 1px rgba(37,99,235,0.25)" : "none",
            minHeight: 44,
            height: 44,
            color: "#fff",
            cursor: "pointer"
          }),
          singleValue: base => ({
            ...base,
            color: "#fff"
          }),
          placeholder: base => ({
            ...base,
            color: "#9ca3af"
          }),
          menu: base => ({
            ...base,
            background: "#020617",
            color: "#fff",
            zIndex: 9999
          }),
          option: (base, state) => ({
            ...base,
            background: state.isFocused ? "#2563eb" : "transparent",
            color: "#fff",
            cursor: "pointer"
          }),
          input: base => ({
            ...base,
            color: "#fff"
          }),
          valueContainer: base => ({
            ...base,
            padding: "6px 8px"
          }),
          indicatorsContainer: base => ({
            ...base,
            color: "#fff"
          })
        }}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
        classNamePrefix="react-select"
      />
    </div>
  );
}
