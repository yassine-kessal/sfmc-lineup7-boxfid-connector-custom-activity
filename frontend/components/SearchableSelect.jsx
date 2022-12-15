import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function SearchableSelect({
  label,
  id,
  required = false,
  options,
  value,
  isDisabled = false,
  isClearable = true,
  onChange,
  components,
  isCreatable = false,
  error = false,
}) {
  const p = {
    components,
    isDisabled,
    required,
    value,
    id,
    options,
    isClearable,
    onChange,
    styles: {
      control: (baseStyles, state) => ({
        ...baseStyles,
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderColor: error ? "red" : "#E5E5E5",
        marginTop: "5px",
      }),
    },
    theme: (theme) => ({
      ...theme,
      borderRadius: 0,
      borderColor: "#E5E5E5",
      colors: {
        ...theme.colors,
        primary: "#322A74",
      },
    }),
  };

  return (
    <div className="slds-form-element">
      {required && (
        <abbr className="slds-required" title="">
          *
        </abbr>
      )}
      <label
        style={{ cursor: "pointer" }}
        className="slds-form-element__label slds-text-title_caps"
        htmlFor={id}
      >
        {label}
      </label>
      {isCreatable ? (
        <CreatableSelect
          formatCreateLabel={(value) => `Utiliser '${value}'`}
          {...p}
        />
      ) : (
        <Select {...p} />
      )}
      {error && <span style={{ color: "red" }}>Le champ est obligatoire</span>}
    </div>
  );
}
