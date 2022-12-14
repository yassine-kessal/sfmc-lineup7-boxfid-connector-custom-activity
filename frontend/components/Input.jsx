export default function Input({
  id,
  disabled = false,
  label,
  defaultValue,
  onChange,
  required = false,
}) {
  return (
    <>
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
        <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_right slds-border_bottom">
          <svg
            className="slds-icon slds-input__icon slds-input__icon_right slds-icon-text-default scm-anchor-right"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="scm-anchor-right"
            >
              <path d="M4.4 15.4l4.1 4.1c.2.2.5.2.6 0L19.4 9.2c.2-.2.2-.4 0-.6l-4.1-4.1c-.2-.2-.4-.2-.6 0L4.4 14.8c-.2.2-.2.5 0 .6zM16.7 2.6c-.2.2-.2.5 0 .7l4 4c.2.2.5.2.7 0l1.1-1.1c.8-.7.8-1.8 0-2.6l-2.1-2.1c-.8-.8-1.9-.8-2.7 0l-1 1.1zM1 22.2c-.1.5.3.9.8.8l5-1.2c.2 0 .3-.1.4-.2l.1-.1c.1-.1.1-.4-.1-.6l-4.1-4.1c-.2-.2-.5-.2-.6-.1l-.1.1c-.1.1-.2.3-.2.4l-1.2 5z"></path>
            </svg>
          </svg>
          <div id="activity-name">
            <input
              type="text"
              id={id}
              className="slds-input slds-input_bare slds-p-around_none"
              defaultValue={defaultValue}
              onChange={onChange}
              disabled={disabled}
              required={required}
            />
          </div>
        </div>
        <div className="slds-form-element__help slds-hide"></div>
      </div>
    </>
  );
}
